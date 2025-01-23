import { useCallback, useRef } from 'react';
import { apiWrapper, streaming } from 'api/apiWrapper';
import { load } from 'cheerio';
import { DocUnopenableError, ExceedPoDriveLimitError } from 'error/error';
import { useTranslation } from 'react-i18next';
import {
  addChatOutputRes,
  appendChatOutput,
  appendChatReferences,
  NovaChatType,
  NovaFileInfo,
  novaHistorySelector,
  pushChat,
  removeChat,
  updateChatStatus
} from 'store/slices/nova/novaHistorySlice';
import { setCreating, setUsingAI } from 'store/slices/tabSlice';
import { getFileExtension, getFileName, markdownToHtml } from 'util/common';
import { v4 } from 'uuid';

import { track } from '@amplitude/analytics-browser';

import {
  AI_WRITE_RESPONSE_STREAM_API,
  NOVA_CHAT_API,
  NOVA_GET_LINK_REFERENCE,
  PO_DRIVE_DOC_OPEN_STATUS
} from '../../../api/constant';
import { ChatMode, getChatEngine } from '../../../constants/chatType';
import { FileUploadState } from '../../../constants/fileTypes';
import { appStateSelector } from '../../../store/slices/appState';
import { DriveFileInfo } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { convertFiles, downloadFiles, fileToBase64, uploadFiles } from '../../../util/files';
import { useConfirm } from '../../Confirm';
import { InputBarSubmitParam } from '../../nova/inputBar';
import useErrorHandle from '../useErrorHandle';
import { useShowCreditToast } from '../useShowCreditToast';

interface SubmitHandlerProps {
  setFileUploadState: React.Dispatch<React.SetStateAction<FileUploadState>>;
  setExpiredNOVA: React.Dispatch<React.SetStateAction<boolean>>;
}

const useSubmitHandler = ({ setFileUploadState, setExpiredNOVA }: SubmitHandlerProps) => {
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);
  const { novaExpireTime } = useAppSelector(appStateSelector);
  const errorHandle = useErrorHandle();
  const showCreditToast = useShowCreditToast();
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
    async (submitParam: InputBarSubmitParam, chatMode: ChatMode) => {
      const id = v4();
      let result = '';
      const lastChat = novaHistory[novaHistory.length - 1];
      const { vsId = '', threadId = '' } = lastChat || {};
      const { input, files = [], type } = submitParam;
      let splunk = null;
      let timer = null;

      try {
        dispatch(setCreating('NOVA'));
        dispatch(setUsingAI(true));

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

        dispatch(
          pushChat({
            id,
            input,
            type,
            role,
            vsId,
            threadId,
            chatType: chatMode,
            output: '',
            files: fileInfo
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
        const { res, logger } = await requestor.current.request(NOVA_CHAT_API, {
          body: formData,
          method: 'POST'
        });
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
                    case 'credit': {
                      const { deductCredit, remainCredit } = json.data;
                      showCreditToast(`${deductCredit}`, `${remainCredit}`, 'nova');
                      return '';
                    }
                    case 'annotations': {
                      const ref = JSON.parse(json.data);
                      return `\n\n${t('Index.Chat.ReferFile', {
                        file: ref
                          .map((r: string) => (r.length > 20 ? `${r.slice(0, 20)}...` : r))
                          .join(', ')
                      })}`;
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
      } finally {
        dispatch(setCreating('none'));
        setFileUploadState({ type: '', state: 'ready', progress: 0 });

        try {
          if (splunk) {
            splunk({
              dp: 'ai.nova',
              el: vsId || type !== '' ? 'nova_document_or_image' : 'nova_chating',
              gpt_ver: vsId || type !== '' ? 'NOVA_ASK_DOC_GPT4O' : 'NOVA_CHAT_GPT4O'
            });
            if (type) {
              splunk({
                dp: 'ai.nova',
                el: 'upload_file',
                file_type: type
              });
            }
          }
          track('click_nova_chating', { is_document: files.length > 0 });
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
    [dispatch, errorHandle, novaHistory, setFileUploadState, showCreditToast, t, confirm]
  );

  const createAIWriteSubmitHandler = useCallback(
    async (submitParam: InputBarSubmitParam, chatMode: ChatMode) => {
      const id = v4();
      let result = '';
      const lastChat = novaHistory[novaHistory.length - 1];
      const { vsId = '', threadId = '' } = lastChat || {};
      const { input, files = [], type } = submitParam;
      let splunk = null;
      const timer = null;

      try {
        dispatch(setCreating('NOVA'));
        dispatch(setUsingAI(true));

        if (expireTimer.current) clearTimeout(expireTimer.current);

        const formData = new FormData();
        const role = 'user';
        formData.append('content', input);
        formData.append('role', role);
        formData.append('type', type);
        formData.append('vsId', vsId);
        formData.append('threadId', threadId);

        dispatch(
          pushChat({ id, input, type, role, vsId, threadId, chatType: chatMode, output: '' })
        );

        requestor.current = apiWrapper();
        const { res, logger } = await requestor.current.request(AI_WRITE_RESPONSE_STREAM_API, {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            engine: getChatEngine(chatMode),
            history: [
              {
                content: input,
                role: 'user'
              }
            ]
          }),
          method: 'POST'
        });
        splunk = logger;

        if (timer) clearTimeout(timer);

        const resVsId = res.headers.get('X-PO-AI-NOVA-API-VSID') || '';
        const resThreadId = res.headers.get('X-PO-AI-NOVA-API-TID') || '';
        const askType = res.headers.get('X-PO-AI-NOVA-API-ASK-TYPE') || '';
        const expiredTime = res.headers.get('X-PO-AI-NOVA-API-EXPIRED-TIME') || '';

        setFileUploadState({ type: '', state: 'ready', progress: 0 });
        await streaming(res, async (contents) => {
          const contentArr = contents.trim().split('\n');

          for (const content of contentArr) {
            if (!content.trim()) continue;

            try {
              const parsed = JSON.parse(content.trim());

              if (parsed.citations.length > 0) {
                const { res } = await apiWrapper().request(NOVA_GET_LINK_REFERENCE, {
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    urls: parsed.citations
                  }),
                  method: 'POST'
                });

                const response = await res.json();

                if (response.success && Array.isArray(response.data)) {
                  const references = response.data.map(
                    (item: {
                      data: {
                        success: boolean;
                        site_name: string;
                        title: string;
                        description: string;
                        type: string;
                        url: string;
                      };
                      url: string;
                    }) => ({
                      site: item.data.site_name || '',
                      title: item.data.title || '',
                      desc: item.data.description,
                      type: item.data.type || '',
                      url: item.url || '',
                      favicon: item.url
                        ? `https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}`
                        : ''
                    })
                  );

                  dispatch(
                    appendChatReferences({
                      id,
                      references
                    })
                  );
                  console.log('references: ', references);
                }
              }

              dispatch(
                appendChatOutput({
                  id,
                  output: parsed.content,
                  vsId: resVsId,
                  threadId: resThreadId,
                  askType: askType as NovaChatType['askType'],
                  expiredTime: parseInt(expiredTime, 10)
                })
              );
              console.log('parsed: ', parsed);

              result += parsed.content;
            } catch (error) {
              console.log('Error parsing JSON: ', error, 'Content:', content);
            }
          }
        });

        dispatch(updateChatStatus({ id, status: 'done' }));
      } catch (err) {
        if (timer) clearTimeout(timer);
        if (requestor.current?.isAborted() === true) {
          dispatch(updateChatStatus({ id, status: 'cancel' }));
        } else {
          dispatch(removeChat(id));
          errorHandle(err);
        }

        dispatch(setUsingAI(false));
      } finally {
        dispatch(setCreating('none'));
        setFileUploadState({ type: '', state: 'ready', progress: 0 });

        try {
          if (splunk) {
            splunk({
              dp: 'ai.nova',
              el: vsId || type !== '' ? 'nova_document_or_image' : 'nova_chating',
              gpt_ver: vsId || type !== '' ? 'NOVA_ASK_DOC_GPT4O' : 'NOVA_CHAT_GPT4O'
            });
            if (type) {
              splunk({
                dp: 'ai.nova',
                el: 'upload_file',
                file_type: type
              });
            }
          }
          track('click_nova_chating', { is_document: files.length > 0 });
        } catch (err) {
          /*empty*/
        }

        expireTimer.current = setTimeout(() => {
          setExpiredNOVA(true);
        }, novaExpireTime);
      }
    },
    [dispatch, errorHandle, novaHistory, setFileUploadState, showCreditToast, t, confirm]
  );

  return { createChatSubmitHandler, createAIWriteSubmitHandler };
};

export default useSubmitHandler;
