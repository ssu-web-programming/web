import { useCallback, useRef } from 'react';
import { apiWrapper, sendNovaStatus, streaming } from 'api/apiWrapper';
import { load } from 'cheerio';
import { DocUnopenableError, ExceedPoDriveLimitError } from 'error/error';
import { overlay } from 'overlay-kit';
import { useTranslation } from 'react-i18next';
import {
  addChatOutputRes,
  appendChatOutput,
  appendChatRecommendedQuestions,
  changeChatOutput,
  novaChatModeSelector,
  NovaChatType,
  NovaFileInfo,
  novaHistorySelector,
  pushChat,
  removeChat,
  updateChatStatus
} from 'store/slices/nova/novaHistorySlice';
import { selectNovaTab, selectTabSlice, setCreating, setUsingAI } from 'store/slices/tabSlice';
import { getCookie, getFileExtension, getFileName, markdownToHtml } from 'util/common';
import { v4 } from 'uuid';

import { track } from '@amplitude/analytics-browser';

import {
  NOVA_CHAT_API,
  NOVA_GET_CREDIT_USE_COUNT,
  PO_DRIVE_DOC_OPEN_STATUS
} from '../../../api/constant';
import { parseGptVer } from '../../../api/usePostSplunkLog';
import { FileUploadState } from '../../../constants/fileTypes';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import {
  getServiceEngineName,
  getServiceLoggingInfo,
  SERVICE_TYPE
} from '../../../constants/serviceType';
import { appStateSelector, setIsExternal } from '../../../store/slices/appState';
import {
  selectAllServiceCredits,
  selectPageCreditReceived,
  setPageServiceUsage,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { DriveFileInfo, getCurrentFile } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import Bridge from '../../../util/bridge';
import { convertFiles, downloadFiles, fileToBase64, uploadFiles } from '../../../util/files';
import { useConfirm } from '../../Confirm';
import { InputBarSubmitParam } from '../../nova/inputBar';
import SurveyModalContent from '../../nova/satisfactionSurvey/survey-modal-content';
import OverlayModal from '../../overlay-modal';
import useErrorHandle from '../useErrorHandle';

import useGetChatReferences from './useGetChatReferences';

interface SubmitHandlerProps {
  setFileUploadState: React.Dispatch<React.SetStateAction<FileUploadState>>;
  setExpiredNOVA: React.Dispatch<React.SetStateAction<boolean>>;
}

const useSubmitHandler = ({ setFileUploadState, setExpiredNOVA }: SubmitHandlerProps) => {
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);
  const { novaExpireTime } = useAppSelector(appStateSelector);
  const currentFile = useAppSelector(getCurrentFile);
  const chatMode = useAppSelector(novaChatModeSelector);
  const serviceCredits = useAppSelector(selectAllServiceCredits);
  const { getReferences } = useGetChatReferences();
  const errorHandle = useErrorHandle();
  const { t } = useTranslation();
  const confirm = useConfirm();
  const expireTimer = useRef<NodeJS.Timeout | null>(null);
  const requestor = useRef<ReturnType<typeof apiWrapper>>();

  const checkDocStatus = async (files: NovaFileInfo[]) => {
    const promises = files.map(async (file) => {
      requestor.current = apiWrapper();
      const { res } = await requestor.current.request(PO_DRIVE_DOC_OPEN_STATUS, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: file.fileId, fileRevision: file.fileRevision }),
        method: 'POST'
      });
      const json = await res.json();
      const {
        success,
        data: { status }
      } = json;
      if (!success) throw new Error('Invalid File');
      return { ...file, valid: status };
    });

    const results = await Promise.all(promises);
    return results;
  };

  const createChatSubmitHandler = useCallback(
    async (submitParam: InputBarSubmitParam, isAnswer?: boolean, chatType?: SERVICE_TYPE) => {
      const id = v4();
      let result = '';
      const lastChat = novaHistory[novaHistory.length - 1];
      const { vsId = '', threadId = '' } = lastChat || {};
      const { input, files = [], type } = submitParam;
      let splunk = null;
      let timer = null;
      let citations: string[] = [];

      const curTab =
        chatType === SERVICE_TYPE.NOVA_WEBSEARCH_PERPLEXITY ||
        chatType === SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
          ? NOVA_TAB_TYPE.perplexity
          : NOVA_TAB_TYPE.aiChat;

      try {
        dispatch(setCreating('NOVA'));
        dispatch(setUsingAI(true));
        dispatch(setIsExternal(false));

        Bridge.callBridgeApi('curNovaTab', curTab);
        dispatch(selectNovaTab(curTab));
        dispatch(setPageStatus({ tab: curTab, status: 'chat' }));

        const fileInfo: NovaChatType['files'] = [];
        if (expireTimer.current) clearTimeout(expireTimer.current);

        const formData = new FormData();
        if (files[0]) {
          if (type === 'image' || type === 'document')
            setFileUploadState({ type, state: 'upload', progress: 20 });

          let targetFiles = [];
          if (files[0] instanceof File) {
            targetFiles = await uploadFiles(files as File[]);
          } else if ('fileId' in files[0]) {
            targetFiles = await downloadFiles(files as DriveFileInfo[]);
          }

          for (const target of targetFiles.filter((target) => target.success)) {
            let base64Data: string | null = null;

            if (target.success) {
              if (type === 'image') {
                const { contentType, data } = await fileToBase64(target.file);
                base64Data = `data:${contentType};base64,${data}`;
              }

              fileInfo.push({
                name: target.file.name,
                fileId: target.data.fileId,
                file: new File(
                  [target.file],
                  `${getFileName(target.file.name)}${getFileExtension(target.file.name).toLowerCase()}`,
                  { type: target.file.type }
                ),
                base64: base64Data, // 이미지 파일일 경우 Base64 데이터가 포함되고, 아닐 경우 null
                fileRevision: target.data.fileRevision
              });
            }
          }

          if (type === 'document') {
            const getDocStatus = await checkDocStatus(fileInfo);
            const invalid = getDocStatus.filter((doc) => doc.valid !== 'NORMAL');
            if (invalid.length > 0) {
              throw new DocUnopenableError(
                invalid.map((inval) => ({ filename: inval.name, type: inval.valid }))
              );
            }
          }
          const convertedFileInfo = await convertFiles(fileInfo);

          convertedFileInfo.forEach((info) => {
            formData.append('uploadFiles', info.file);
            formData.append('fileIds[]', info.fileId);
          });
        }

        const role = 'user';
        formData.append('content', input);
        formData.append('role', role);
        formData.append('type', type);
        formData.append('vsId', vsId);
        formData.append('threadId', threadId);
        formData.append('model', getServiceEngineName(chatType ?? chatMode));
        const history = novaHistory.map(({ files, ...rest }) => rest);
        formData.append('history', JSON.stringify(history.length > 0 ? history : []));

        dispatch(
          pushChat({
            id,
            input,
            type,
            role,
            vsId,
            threadId,
            chatType: chatType ?? chatMode,
            output: '',
            files: fileInfo,
            isAnswer: isAnswer
          })
        );

        requestor.current = apiWrapper();
        if (type === 'image' || type === 'document') {
          setFileUploadState((prev: any) => ({ ...prev, state: 'wait', progress: 40 }));
          const progressing = () =>
            setTimeout(() => {
              setFileUploadState((prev: any) => {
                if (prev.progress < 90) {
                  timer = progressing();
                  return { ...prev, progress: prev.progress + 10 };
                } else {
                  return { ...prev, state: 'delay', progress: 90 };
                }
              });
            }, 3000);
          timer = progressing();
        }
        const { res, logger } = await requestor.current.request(
          NOVA_CHAT_API,
          {
            body: formData,
            method: 'POST'
          },
          { name: curTab, uuid: v4() }
        );
        splunk = logger;

        if (timer) clearTimeout(timer);

        const resVsId = res.headers.get('X-PO-AI-NOVA-API-VSID') || '';
        const resThreadId = res.headers.get('X-PO-AI-NOVA-API-TID') || '';
        const askType = res.headers.get('X-PO-AI-NOVA-API-ASK-TYPE') || '';
        const expiredTime = res.headers.get('X-PO-AI-NOVA-API-EXPIRED-TIME') || '';

        setFileUploadState({ type: '', state: 'ready', progress: 0 });
        await streaming(
          res,
          (contents) => {
            dispatch(
              appendChatOutput({
                id,
                output: contents,
                vsId: resVsId,
                threadId: resThreadId,
                askType: askType as NovaChatType['askType'],
                expiredTime: parseInt(expiredTime)
              })
            );
            result += contents;
          },
          (obj: string) => {
            return obj
              .toString()
              .split('\n\n')
              .filter((element: string) => element !== '')
              .map((element: string) => {
                const data = element.replace('data:', '');
                try {
                  if (!data) throw new Error();
                  const json = JSON.parse(data);
                  switch (json.event_type) {
                    case 'text': {
                      return json.data;
                    }
                    case 'fulltext': {
                      dispatch(
                        changeChatOutput({
                          id,
                          output: json.data
                        })
                      );
                      return;
                    }
                    case 'credit': {
                      // #svr-5601 credit 사용 toast 제거
                      // const { deductCredit, remainCredit } = json.data;
                      return '';
                    }
                    case 'annotations': {
                      const ref = JSON.parse(json.data);
                      return `\n\n${t('Nova.Chat.ReferFile', {
                        file: ref
                          .map((r: string) => (r.length > 20 ? `${r.slice(0, 20)}...` : r))
                          .join(', ')
                      })}`;
                    }
                    case 'citations': {
                      citations = json.data;
                      return '';
                    }
                    case 'related_questions': {
                      dispatch(
                        appendChatRecommendedQuestions({
                          id,
                          recommendedQuestions: json.data
                        })
                      );
                      return '';
                    }
                    default:
                      return '';
                  }
                } catch (error) {
                  return '';
                }
              })
              .join('');
          }
        );
        dispatch(updateChatStatus({ id, status: 'done' }));
        dispatch(setPageServiceUsage({ tab: curTab, serviceType: chatMode, isUsed: true }));
      } catch (err) {
        if (timer) clearTimeout(timer);
        if (requestor.current?.isAborted() === true) {
          dispatch(updateChatStatus({ id, status: 'cancel' }));
        } else if (err instanceof ExceedPoDriveLimitError) {
          await confirm({
            title: '',
            msg: t(`Nova.Alert.LackOfStorage`),
            onOk: {
              text: t('Confirm'),
              callback: () => {}
            }
          });
        } else {
          dispatch(removeChat(id));
          errorHandle(err);
        }

        dispatch(setUsingAI(false));

        await Bridge.callBridgeApi('amplitudeData', {
          type: 'nova_chating',
          props: {
            is_document: type != '',
            document_format: currentFile.ext,
            file_id: currentFile.id,
            model_type: chatMode,
            chating_type: type == '' ? 'default' : type,
            function_result: true
          }
        });
      } finally {
        dispatch(setCreating('none'));
        setFileUploadState({ type: '', state: 'ready', progress: 0 });

        try {
          if (citations.length > 0) {
            await getReferences(citations, id);
          }
          await sendNovaStatus({ name: curTab, uuid: '' }, 'finish');

          if (splunk) {
            const log_info = getServiceLoggingInfo(chatType ?? chatMode);
            splunk({
              dp: 'ai.nova',
              el: vsId || type !== '' ? 'nova_document_or_image' : log_info.name,
              gpt_ver: log_info.detail
            });
            if (type) {
              splunk({
                dp: 'ai.nova',
                el: 'upload_file',
                file_type: type
              });
            }

<<<<<<< Updated upstream
            track('nova_chating', {
              is_document: type != '',
              document_format: currentFile.ext,
              file_id: currentFile.id,
              model_type: chatType ?? chatMode,
              chating_type: type == '' ? 'default' : type,
              credit:
                type === ''
                  ? serviceCredits[chatType ?? chatMode]
                  : type == 'image'
                    ? serviceCredits[SERVICE_TYPE.NOVA_ASK_IMG_GPT4O]
                    : serviceCredits[SERVICE_TYPE.NOVA_ASK_DOC_GPT4O],
              function_result: true
=======
            await Bridge.callBridgeApi('amplitudeData', {
              type: 'nova_chating',
              props: {
                is_document: type != '',
                document_format: currentFile.ext,
                file_id: currentFile.id,
                model_type: chatMode,
                chating_type: type == '' ? 'default' : type,
                credit:
                  type === ''
                    ? serviceCredits[chatType ?? chatMode]
                    : serviceCredits[SERVICE_TYPE.NOVA_ASK_DOC_GPT4_1],
                function_result: true
              }
>>>>>>> Stashed changes
            });
          }
        } catch (err) {
          /*empty*/
        }

        expireTimer.current = setTimeout(() => {
          setExpiredNOVA(true);
        }, novaExpireTime);

        const html = await markdownToHtml(result);
        if (html) {
          const $ = load(html);
          const $image = $('img');
          if ($image.length > 0) {
            const image = $image[0] as cheerio.TagElement;
            dispatch(addChatOutputRes({ id, res: image.attribs.src }));
          }
        }
      }
    },
    [dispatch, errorHandle, novaHistory, setFileUploadState, t, confirm]
  );

  return { createChatSubmitHandler };
};

export default useSubmitHandler;
