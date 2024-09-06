import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { apiWrapper, streaming } from 'api/apiWrapper';
import {
  NOVA_CHAT_API,
  PO_DRIVE_CONVERT,
  PO_DRIVE_CONVERT_DOWNLOAD,
  PO_DRIVE_CONVERT_STATUS,
  PO_DRIVE_DOC_OPEN_STATUS,
  PO_DRIVE_DOWNLOAD,
  PO_DRIVE_UPLOAD,
  PROMOTION_USER_INFO
} from 'api/constant';
import { load } from 'cheerio';
import IconButton from 'components/buttons/IconButton';
import { useConfirm } from 'components/Confirm';
import { useChatNova } from 'components/hooks/useChatNova';
import useErrorHandle from 'components/hooks/useErrorHandle';
import { useShowCreditToast } from 'components/hooks/useShowCreditToast';
import { ChatBanner } from 'components/nova/ChatBanner';
import ChatList from 'components/nova/ChatList';
import InputBar, { InputBarSubmitParam } from 'components/nova/InputBar';
import { DriveFileInfo } from 'components/PoDrive';
import {
  DelayDocConverting,
  DocConvertingError,
  DocUnopenableError,
  ExceedPoDriveLimitError
} from 'error/error';
import { ReactComponent as IconArrowLeft } from 'img/ico_arrow_left.svg';
import { lang, LANG_KO_KR } from 'locale';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { appStateSelector } from 'store/slices/appState';
import {
  addChatOutputRes,
  appendChatOutput,
  NovaChatType,
  NovaFileInfo,
  novaHistorySelector,
  pushChat,
  removeChat,
  updateChatStatus
} from 'store/slices/novaHistorySlice';
import { selectTabSlice, setCreating } from 'store/slices/tabSlice';
import { activeToast } from 'store/slices/toastSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import styled from 'styled-components';
import Bridge from 'util/bridge';
import { getFileExtension, getFileName, insertDoc, markdownToHtml } from 'util/common';
import { v4 } from 'uuid';

import useManageFile from '../../components/hooks/nova/useManageFile';
import useFileDrop from '../../components/hooks/useFileDrop';
import { FileUploading } from '../../components/nova/FileUploading';
import NovaHeader from '../../components/nova/Header';
import { ImagePreview } from '../../components/nova/ImagePreview';
import Modals, { Overlay } from '../../components/nova/modals/Modals';
import { SearchGuide } from '../../components/nova/SearchGuide';
import { FileUpladState } from '../../constants/fileTypes';
import { IEventType, setPromotionUserInfo } from '../../store/slices/promotionUserInfo';
import { downloadImage } from '../../util/downloadImage';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Wrapper = styled(Container)`
  flex-direction: column;
  justify-content: flex-start;
`;

const Body = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  position: relative;
`;

const GuideWrapper = styled(Container)`
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  background-color: #f4f6f8;
  overflow-y: auto;
`;

const ScrollDownButton = styled.div`
  width: 48px;
  height: 48px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0px 2px 8px 0px #0000001a;

  button {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

export type ClientStatusType = 'home' | 'doc_edit_mode' | 'doc_view_mode';

interface PollingType extends NovaFileInfo {
  taskId: string;
}

export default function Nova() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);
  const { creating } = useAppSelector(selectTabSlice);
  const { novaExpireTime } = useAppSelector(appStateSelector);
  const { t } = useTranslation();
  const confirm = useConfirm();
  const showCreditToast = useShowCreditToast();
  const errorHandle = useErrorHandle();
  const chatNova = useChatNova();
  const [showScrollDownBtn, setShowScrollDownBtn] = useState(false);
  const chatListRef = useRef<HTMLDivElement>(null);
  const [expiredNOVA, setExpiredNOVA] = useState<boolean>(false);
  const [inputContents, setInputContents] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<NovaFileInfo | null>(null);
  const [fileUploadState, setFileUploadState] = useState<FileUpladState>({
    type: '',
    state: 'ready',
    progress: 0
  });
  const { handleDragOver, handleDragLeave, handleDrop } = useFileDrop();
  const { loadLocalFile } = useManageFile();

  const expireTimer = useRef<NodeJS.Timeout | null>(null);

  const requestor = useRef<ReturnType<typeof apiWrapper>>();

  const getConvertStatus = async (fileInfo: { taskId: string }) => {
    try {
      requestor.current = apiWrapper();
      const { res } = await requestor.current.request(PO_DRIVE_CONVERT_STATUS, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskId: fileInfo.taskId
        }),
        method: 'POST'
      });
      const json = await res.json();
      const {
        success,
        data: { status }
      } = json;

      if (!success) throw new Error();
      return status;
    } catch (err) {
      if (err instanceof DelayDocConverting) throw err;
      else throw new DocConvertingError();
    }
  };

  const downloadConvertFile = async (fileInfo: PollingType) => {
    const pollingConvertStatus = () =>
      new Promise<void>((resolve, reject) => {
        setTimeout(async () => {
          try {
            const status = await getConvertStatus(fileInfo);
            if (status === 'completed') {
              resolve();
            } else {
              resolve(await pollingConvertStatus());
            }
          } catch (err) {
            reject(err);
          }
        }, 100);
      });
    await pollingConvertStatus();

    requestor.current = apiWrapper();
    const { res } = await requestor.current.request(PO_DRIVE_CONVERT_DOWNLOAD, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileId: fileInfo.fileId,
        fileRevision: fileInfo.fileRevision
      }),
      method: 'POST'
    });
    const blob = await res.blob();
    return new File([blob], `${getFileName(fileInfo.name)}.pdf`, { type: 'application/pdf' });
  };

  const reqConvertFile = async (fileInfo: NovaFileInfo) => {
    requestor.current = apiWrapper();
    const { res } = await requestor.current.request(PO_DRIVE_CONVERT, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...fileInfo
      }),
      method: 'POST'
    });

    const json = await res.json();
    const {
      success,
      data: { taskId }
    } = json;

    if (!success) throw new Error('Convert Error');
    const converted = await downloadConvertFile({ ...fileInfo, taskId });
    return converted;
  };

  const checkDocStatus = async (files: NovaFileInfo[]) => {
    const promises = files.map(async (file) => {
      try {
        requestor.current = apiWrapper();
        const { res } = await requestor.current.request(PO_DRIVE_DOC_OPEN_STATUS, {
          headers: {
            'Content-Type': 'application/json'
          },
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
      } catch (err) {
        throw new Error('Failed to handle file status');
      }
    });
    return await Promise.all(promises);
  };

  const convertFiles = async (files: NovaFileInfo[]) => {
    const promises = files.map(async (file) => {
      const ext = getFileExtension(file.file.name);
      if (ext === '.hwp' || ext === '.xls' || ext === '.xlsx') {
        const converted = await reqConvertFile(file);
        return {
          ...file,
          file: converted
        };
      } else {
        return file;
      }
    });
    return await Promise.all(promises);
  };

  const reqUploadFiles = async (files: File[]) => {
    const ret = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('uploadFile', file);
      requestor.current = apiWrapper();
      const { res } = await requestor.current.request(PO_DRIVE_UPLOAD, {
        body: formData,
        method: 'POST'
      });
      const json = await res.json();
      ret.push({ ...json, file });
    }
    return ret;
  };

  const reqDownloadFiles = async (files: DriveFileInfo[]) => {
    const ret = [];
    for (const file of files) {
      requestor.current = apiWrapper();
      const { res } = await requestor.current.request(PO_DRIVE_DOWNLOAD, {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileId: file.fileId }),
        method: 'POST'
      });
      const blob = await res.blob();
      ret.push({
        success: true,
        file: new File([blob], file.name, { type: file.type }),
        data: { fileId: file.fileId, fileRevision: file.fileRevision }
      });
    }
    return ret;
  };

  const initPromotionUserInfo = useCallback(async () => {
    try {
      const eventType: IEventType = IEventType.AI_NOVA_LUCKY_EVENT;
      const { res } = await apiWrapper().request(PROMOTION_USER_INFO, {
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          type: eventType
        }),
        method: 'POST'
      });
      const response = await res.json();
      if (response.success) {
        dispatch(setPromotionUserInfo(response.data.accurePromotionUser));
      }
    } catch (err) {
      /* empty */
    }
  }, [dispatch]);

  const onSubmit = useCallback(
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

        const fileInfo: NovaChatType['files'] = [];
        if (expireTimer.current) clearTimeout(expireTimer.current);

        const formData = new FormData();
        if (files[0]) {
          if (type === 'image' || type === 'document')
            setFileUploadState({ type, state: 'upload', progress: 20 });

          let targetFiles = [];
          if (files[0] instanceof File) {
            targetFiles = await reqUploadFiles(files as File[]);
          } else if ('fileId' in files[0]) {
            targetFiles = await reqDownloadFiles(files as DriveFileInfo[]);
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
          setFileUploadState((prev) => ({ ...prev, state: 'wait', progress: 40 }));
          const progressing = () =>
            setTimeout(() => {
              setFileUploadState((prev) => {
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
        initPromotionUserInfo();
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
          /* empty */
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
    [novaHistory, dispatch, errorHandle, showCreditToast, t, confirm]
  );

  useEffect(() => {
    if (expiredNOVA) {
      confirm({
        title: '',
        msg: t('Nova.Alert.ExpiredNOVA'),
        onOk: {
          text: t(`Confirm`),
          callback: () => {
            setExpiredNOVA(false);
            chatNova.newChat();
          }
        }
      });
    }
  }, [expiredNOVA, t, confirm, chatNova]);

  useEffect(() => {
    if (location.state?.body) {
      setInputContents(location.state.body);
    }
  }, [location.state?.body]);

  useEffect(() => {
    const handleOrientationChange = () => {
      if (chatListRef.current) {
        ShowScrollButton(chatListRef.current);
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  });

  const handleInsertDocs = (history: NovaChatType) => {
    Bridge.callSyncBridgeApiWithCallback({
      api: 'getClientStatus',
      callback: async (status: ClientStatusType) => {
        switch (status) {
          case 'home':
            confirm({
              title: t(`Nova.Chat.InsertDoc.Fail.Title`)!,
              msg: t(`Nova.Chat.InsertDoc.Fail.Msg.Home`)!,
              onOk: {
                text: t(`Confirm`),
                callback: () => {}
              }
            });
            break;
          case 'doc_view_mode':
            confirm({
              title: t(`Nova.Chat.InsertDoc.Fail.Title`)!,
              msg: t(`Nova.Chat.InsertDoc.Fail.Msg.Viewer`)!,
              onOk: {
                text: t(`Confirm`),
                callback: () => {}
              }
            });
            break;
          case 'doc_edit_mode':
            switch (history.askType) {
              case 'image': {
                try {
                  const res = await fetch(history.res!);
                  const blob = await res.blob();
                  Bridge.callBridgeApi('insertImage', blob);
                  dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
                } catch (err) {
                  /* empty */
                }
                break;
              }
              case 'document':
              default: {
                insertDoc(history.output);
                dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CompleteInsert`) }));
                break;
              }
            }
            break;
        }
      }
    });
  };

  const onSave = async (currentChat?: NovaChatType) => {
    const imageURL = currentChat?.res;
    try {
      if (imageURL) {
        await downloadImage(imageURL);
        dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.SaveCompleted`) }));
      }
    } catch {
      dispatch(activeToast({ type: 'error', msg: t(`ToastMsg.SaveFailed`) }));
    }
  };

  const ShowScrollButton = (el: HTMLDivElement | null) => {
    if (!el) return;

    const scrollPosition = el.scrollTop;
    const totalScrollHeight = el.scrollHeight;
    const visibleHeight = el.clientHeight;
    const scrollPercentage = (scrollPosition / (totalScrollHeight - visibleHeight)) * 100;

    if (scrollPercentage <= 30) {
      setShowScrollDownBtn(true);
    } else {
      setShowScrollDownBtn(false);
    }
  };

  const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
    ShowScrollButton(e.currentTarget);
  };

  return (
    <Wrapper>
      <NovaHeader setInputContents={setInputContents} />
      <Body
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, loadLocalFile)}>
        {novaHistory.length < 1 ? (
          <>
            {lang === LANG_KO_KR && <ChatBanner />}
            <GuideWrapper>
              <SearchGuide setInputContents={setInputContents} />
            </GuideWrapper>
          </>
        ) : (
          <>
            <ChatList
              expiredNOVA={expiredNOVA}
              novaHistory={novaHistory}
              onSubmit={onSubmit}
              handleInsertDocs={handleInsertDocs}
              onSave={onSave}
              scrollHandler={handleOnScroll}
              setImagePreview={setImagePreview}
              ref={chatListRef}
            />
            {creating === 'none' && showScrollDownBtn && (
              <ScrollDownButton>
                <IconButton
                  iconComponent={IconArrowLeft}
                  iconSize="md"
                  onClick={() => {
                    chatListRef.current?.scrollTo({
                      top: chatListRef.current?.scrollHeight,
                      behavior: 'smooth'
                    });
                  }}
                />
              </ScrollDownButton>
            )}
          </>
        )}
      </Body>
      <InputBar
        novaHistory={novaHistory}
        disabled={creating !== 'none'}
        expiredNOVA={expiredNOVA}
        onSubmit={onSubmit}
        contents={inputContents}
        setContents={setInputContents}></InputBar>
      {
        <FileUploading
          {...fileUploadState}
          onClickBack={() => {
            requestor.current?.abort();
          }}></FileUploading>
      }
      {imagePreview && (
        <ImagePreview {...imagePreview} onClose={() => setImagePreview(null)}></ImagePreview>
      )}
      <Suspense fallback={<Overlay />}>
        <Modals />
      </Suspense>
    </Wrapper>
  );
}
