import { useCallback, useRef } from 'react';
import { apiWrapper, streaming } from 'api/apiWrapper';
import { load } from 'cheerio';
import { DocUnopenableError, ExceedPoDriveLimitError } from 'error/error';
import { useTranslation } from 'react-i18next';
import {
  addChatOutputRes,
  appendChatOutput,
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

import { NOVA_CHAT_API, PO_DRIVE_DOC_OPEN_STATUS } from '../../../api/constant';
import { appStateSelector } from '../../../store/slices/appState';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { convertFiles, downloadFiles, uploadFiles } from '../../../util/files';
import { useConfirm } from '../../Confirm';
import { InputBarSubmitParam } from '../../nova/InputBar';
import { DriveFileInfo } from '../../PoDrive';
import useErrorHandle from '../useErrorHandle';
import { useShowCreditToast } from '../useShowCreditToast';

interface SubmitHandlerProps {
  setFileUploadState: React.Dispatch<React.SetStateAction<any>>;
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

  const createNovaSubmitHandler = useCallback(
    async (submitParam: InputBarSubmitParam) => {
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
          targetFiles
            .filter((target) => target.success)
            .forEach((target) => {
              if (target.success) {
                fileInfo.push({
                  name: target.file.name,
                  fileId: target.data.fileId,
                  file: new File(
                    [target.file],
                    `${getFileName(target.file.name)}${getFileExtension(
                      target.file.name
                    ).toLowerCase()}`,
                    {
                      type: target.file.type
                    }
                  ),
                  fileRevision: target.data.fileRevision
                });
              }
            });

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

        dispatch(pushChat({ id, input, type, role, vsId, threadId, output: '', files: fileInfo }));

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
                      return `\n\n${t('Nova.Chat.ReferFile', {
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
      } finally {
        dispatch(setCreating('none'));
        setFileUploadState({ type: '', state: 'ready', progress: 0 });

        try {
          if (splunk) {
            splunk({
              dp: 'ai.nova',
              el: vsId || type !== '' ? 'nova_document_or_image' : 'nova_chating'
            });
            if (type) {
              splunk({
                dp: 'ai.nova',
                el: 'upload_file',
                file_type: type
              });
            }
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
    [dispatch, errorHandle, novaHistory, setFileUploadState, showCreditToast, t, confirm]
  );

  return { createNovaSubmitHandler };
};

export default useSubmitHandler;
