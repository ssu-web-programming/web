import { useCallback, useEffect, useRef, useState } from 'react';
import InputBar, { InputBarSubmitParam } from 'components/nova/InputBar';
import styled, { css } from 'styled-components';
import { useAppDispatch, useAppSelector } from 'store/store';
import {
  pushChat,
  novaHistorySelector,
  appendChatOutput,
  addChatOutputRes,
  updateChatStatus,
  NovaChatType,
  removeChat,
  NovaFileInfo
} from 'store/slices/novaHistorySlice';
import { apiWrapper, streaming } from 'api/apiWrapper';
import { v4 } from 'uuid';
import Tooltip from 'components/Tooltip';
import { useConfirm } from 'components/Confirm';
import { NOVA_CHAT_API, PO_DRIVE_DOWNLOAD, PO_DRIVE_UPLOAD } from 'api/constant';
import { insertDoc, markdownToHtml } from 'util/common';
import Bridge, { useCopyClipboard } from 'util/bridge';
import { load } from 'cheerio';
import Icon from 'components/Icon';
import IconButton from 'components/buttons/IconButton';
import ico_ai from 'img/ico_ai.svg';
import ico_nova from 'img/ico_nova.svg';
import ico_credit_info from 'img/ico_credit_line.svg';
import ico_credit from 'img/ico_credit_gray.svg';
import { ReactComponent as IconMessagePlus } from 'img/ico_message_plus.svg';
import { ReactComponent as AgentFraphic } from 'img/agent_graphic.svg';
import { ReactComponent as IconArrowLeft } from 'img/ico_arrow_left.svg';
import ChatList from 'components/nova/ChatList';
import ico_image from 'img/ico_image.svg';
import ico_documents from 'img/ico_documents.svg';
// import stop_circle from 'img/stop_circle.svg';
import { useTranslation } from 'react-i18next';
import { activeToast } from 'store/slices/toastSlice';
import { selectTabSlice, setCreating } from 'store/slices/tabSlice';
import { useLocation } from 'react-router-dom';
// import IconTextButton from 'components/buttons/IconTextButton';
import { creditInfoSelector, InitialState } from 'store/slices/creditInfo';
import { DriveFileInfo } from 'components/PoDrive';
import { useShowCreditToast } from 'components/hooks/useShowCreditToast';
import useErrorHandle from 'components/hooks/useErrorHandle';
import { useChatNova } from 'components/hooks/useChatNova';
import { ExceedPoDriveLimitError } from 'error/error';
import { ReactComponent as closeIcon } from 'img/ico_ai_close.svg';

const flexCenter = css`
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Wrapper = styled(Container)`
  flex-direction: column;
  justify-content: flex-start;
`;

const Header = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: space-between;
  padding: 0px 16px;
  color: var(--ai-purple-50-main);

  > div {
    ${flexCenter}
    flex-direction: row;
  }
`;

const Body = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  position: relative;
`;

const TitleWrapper = styled.div`
  gap: 4px;

  img.nova {
    width: 55px;
    height: 16px;
  }
`;

const ButtonWrapper = styled.div`
  gap: 8px;
`;

const GuideWrapper = styled(Container)`
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  background-color: #f4f6f8;
  overflow-y: auto;
`;

const GuideTitle = styled.div`
  div.title {
    ${flexCenter}
    justify-content: center;
    margin-bottom: 8px;

    font-size: 18px;
    font-weight: 500;
    line-height: 27px;
    color: var(--ai-purple-50-main);
  }

  p.subTitle {
    font-size: 14px;
    line-height: 21px;
    letter-spacing: -0.02em;
    color: var(--gray-gray-80-02);
    text-align: center;
  }
`;
const Guidebody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-bottom: 24px;
`;

const GuideExample = styled.div`
  ${flexCenter}
  justify-content: flex-start;
  gap: 8px;
  padding: 12px;
  margin: 0 16px;
  border: 1px solid var(--gray-gray-40);
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
`;

// const StopButton = styled.div`
//   position: absolute;
//   left: 50%;
//   bottom: 24px;
//   transform: translate(-50%);
// `;

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

export const SUPPORT_DOCUMENT_TYPE = [
  {
    mimeType: 'application/msword',
    extensions: '.doc'
  },
  {
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extensions: '.docx'
  },
  {
    mimeType: 'application/vnd.ms-powerpoint',
    extensions: '.ppt'
  },
  {
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    extensions: '.pptx'
  },
  {
    mimeType: 'application/vnd.ms-excel',
    extensions: '.xls'
  },
  {
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extensions: '.xlsx'
  },
  {
    mimeType: 'application/x-hwp',
    extensions: '.hwp'
  },
  {
    mimeType: 'application/vnd.hancom.hwp',
    extensions: '.hwp'
  },
  {
    mimeType: 'application/pdf',
    extensions: '.pdf'
  }
];

export const SUPPORT_IMAGE_TYPE = [
  {
    mimeType: 'image/jpeg',
    extensions: '.jpg'
  },
  {
    mimeType: 'image/png',
    extensions: '.png'
  },
  {
    mimeType: 'image/gif',
    extensions: '.gif'
  }
];

export type ClientStatusType = 'home' | 'doc_edit_mode' | 'doc_view_mode';

export const SUPPORT_FILE_TYPE = [...SUPPORT_DOCUMENT_TYPE, ...SUPPORT_IMAGE_TYPE];
export const NOVA_EXPIRED_TIME = 1800000;
interface FileUpladState extends Pick<NovaChatType, 'type'> {
  state: 'ready' | 'upload' | 'wait' | 'delay';
  progress: number;
}
export default function Nova() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);
  const { creating } = useAppSelector(selectTabSlice);
  const creditInfo = useAppSelector(creditInfoSelector);
  const { t } = useTranslation();
  const confirm = useConfirm();
  const showCreditToast = useShowCreditToast();
  const errorHandle = useErrorHandle();
  const chatNova = useChatNova();
  const copyClipboard = useCopyClipboard();
  const [showScrollDownBtn, setShowScrollDownBtn] = useState(false);
  const chatListRef = useRef<HTMLDivElement>(null);
  const [expiredNOVA, setExpiredNOVA] = useState<boolean>(false);
  const [inputContents, setInputContents] = useState<{ input: string }>({ input: '' });
  const [imagePreview, setImagePreview] = useState<NovaFileInfo | null>(null);

  const [fileUploadState, setFileUploadState] = useState<FileUpladState>({
    type: '',
    state: 'ready',
    progress: 0
  });

  const CREDIT_NAME_MAP: { [key: string]: string } = {
    NOVA_CHAT_GPT4O: t(`Nova.CreditInfo.Chat`),
    NOVA_ASK_DOC_GPT4O: t(`Nova.CreditInfo.DocImgQuery`),
    NOVA_IMG_GPT4O: t(`Nova.CreditInfo.ImgGen`)
  };

  const credit = filterCreditInfo(creditInfo, CREDIT_NAME_MAP);

  const TOOLTIP_CREDIT_OPTIONS = credit.map((item) => ({
    name: CREDIT_NAME_MAP[item.serviceType] || 'Unknown',
    icon: { src: ico_credit, txt: String(item.deductCredit) }
  }));

  const expireTimer = useRef<NodeJS.Timeout | null>(null);

  const requestor = useRef<ReturnType<typeof apiWrapper>>();

  const reqUploadFiles = async (files: File[]) => {
    // TODO : promise all
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
    // const promises = files.map(
    //   (file) =>
    //     new Promise<{ file: File; success: boolean; data: { fileId: string } }>(async (resolve) => {
    //       const formData = new FormData();
    //       formData.append('uploadFile', file);
    //       const { res } = await apiWrapper().request(PO_DRIVE_UPLOAD, {
    //         body: formData,
    //         method: 'POST'
    //       });
    //       const json = await res.json();
    //       resolve({ ...json, file });
    //     })
    // );
    // const res = await Promise.all(promises);
    // return res;
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

  const onSubmit = useCallback(
    async (submitParam: InputBarSubmitParam) => {
      const id = v4();
      let result = '';
      const lastChat = novaHistory[novaHistory.length - 1];
      const { vsId = '', threadId = '' } = lastChat || {};
      const { input, files = [], type } = submitParam;
      let splunk = null;
      try {
        dispatch(setCreating('NOVA'));

        const fileInfo: NovaChatType['files'] = [];
        if (expireTimer.current) clearTimeout(expireTimer.current);

        const formData = new FormData();
        if (files[0]) {
          if (type === 'image' || type === 'document')
            setFileUploadState({ type, state: 'upload', progress: 20 });
          if (files[0] instanceof File) {
            const resUpload = await reqUploadFiles(files as File[]);
            resUpload
              .filter((res) => res.success)
              .forEach((res) => {
                if (res.success) {
                  formData.append('uploadFiles', res.file);
                  formData.append('fileIds[]', res.data.fileId);
                  fileInfo.push({
                    name: res.file.name,
                    fileId: res.data.fileId,
                    file: res.file,
                    fileRevision: res.data.fileRevision
                  });
                }
              });
          } else if ('fileId' in files[0]) {
            const resDownload = await reqDownloadFiles(files as DriveFileInfo[]);
            resDownload
              .filter((res) => res.success)
              .forEach((res) => {
                if (res.success) {
                  formData.append('uploadFiles', res.file);
                  formData.append('fileIds[]', res.data.fileId);
                  fileInfo.push({
                    name: res.file.name,
                    fileId: res.data.fileId,
                    file: res.file,
                    fileRevision: res.data.fileRevision
                  });
                }
              });
          }
        }

        const role = 'user';
        formData.append('content', input);
        formData.append('role', role);
        formData.append('type', type);
        formData.append('vsId', vsId);
        formData.append('threadId', threadId);

        dispatch(pushChat({ id, input, type, role, vsId, threadId, output: '', files: fileInfo }));

        requestor.current = apiWrapper();
        let timer = null;
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
      } catch (err) {
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
        } catch (err) {}

        expireTimer.current = setTimeout(() => {
          setExpiredNOVA(true);
        }, NOVA_EXPIRED_TIME);

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
            chatNova.newCHat();
          }
        }
      });
    }
  }, [expiredNOVA, t, confirm, chatNova]);

  const newChat = async () => {
    const ret = await confirm({
      title: t(`Nova.Confirm.NewChat.Title`)!,
      msg: t(`Nova.Confirm.NewChat.Msg`),
      onCancel: { text: t(`Cancel`)!, callback: () => {} },
      onOk: {
        text: t(`Nova.Confirm.NewChat.Ok`),
        callback: () => {}
      },
      direction: 'row'
    });

    if (!!ret) {
      chatNova.newCHat();
    }
  };

  // const onStop = () => {
  //   requestor.current?.abort();
  //   dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.StopMsg`) }));
  // };

  const onCopy = async (output: string) => {
    try {
      const imgReg = /!\[.*\]\((.*)\)/;
      const imgURL = output.match(imgReg)?.[1];

      let target = undefined;
      if (imgURL) {
        const data = await fetch(String(imgURL));
        target = await data.blob();
      } else {
        target = output;
      }
      copyClipboard(target);

      dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CopyCompleted`) }));
    } catch {
      dispatch(activeToast({ type: 'error', msg: t(`ToastMsg.CopyFailed`) }));
    }
  };

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
                } catch (err) {}
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

  const downloadImage = async (imageURL: string): Promise<void> => {
    try {
      const response = await fetch(imageURL);
      const blob: Blob = await response.blob();
      Bridge.callBridgeApi('downloadImage', blob);
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  const onSave = async (currentChat?: NovaChatType) => {
    const imageURL = currentChat?.res!;
    try {
      if (imageURL) {
        await downloadImage(imageURL);
        dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.SaveCompleted`) }));
      }
    } catch {
      dispatch(activeToast({ type: 'error', msg: t(`ToastMsg.SaveFailed`) }));
    }
  };

  const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrollPosition = el.scrollTop;
    const totalScrollHeight = el.scrollHeight;
    const visibleHeight = el.clientHeight;
    const scrollPercentage = (scrollPosition / (totalScrollHeight - visibleHeight)) * 100;

    if (scrollPercentage <= 30) {
      setShowScrollDownBtn(true);
    } else if (scrollPercentage > 30) {
      setShowScrollDownBtn(false);
    }
  };

  const contentsBody = location.state?.body || inputContents.input;
  if (location.state?.body) {
    location.state.body = '';
  }

  return (
    <Wrapper>
      <Header>
        <TitleWrapper>
          <Icon iconSrc={ico_ai} size="lg" />
          <Icon iconSrc={ico_nova} size="lg" className="nova" />
        </TitleWrapper>
        <ButtonWrapper>
          {novaHistory.length > 0 && (
            <IconButton
              iconComponent={IconMessagePlus}
              onClick={newChat}
              iconSize="lg"
              width={32}
              height={32}
            />
          )}
          <Tooltip
            title={t(`Nova.CreditInfo.Title`) as string}
            placement="bottom-end"
            type="normal"
            options={TOOLTIP_CREDIT_OPTIONS}>
            <Icon iconSrc={ico_credit_info} size={32} />
          </Tooltip>
        </ButtonWrapper>
      </Header>
      <Body>
        {novaHistory.length < 1 ? (
          <GuideWrapper>
            <Nova.SearchGuide setContents={setInputContents} />
          </GuideWrapper>
        ) : (
          <>
            <ChatList
              expiredNOVA={expiredNOVA}
              novaHistory={novaHistory}
              onSubmit={onSubmit}
              onCopy={onCopy}
              handleInsertDocs={handleInsertDocs}
              onSave={onSave}
              scrollHandler={handleOnScroll}
              setImagePreview={setImagePreview}
              ref={chatListRef}
            />
            {/* {creating !== 'none' && (
              <StopButton onClick={onStop}>
                <IconTextButton
                  iconPos="left"
                  iconSrc={stop_circle}
                  iconSize={21}
                  width={78}
                  height={36}
                  cssExt={css`
                    border-radius: 999px;
                    box-shadow: 0px 2px 8px 0px #0000001a;
                    font-weight: 500;
                    font-size: 14px;
                  `}>
                  STOP
                </IconTextButton>
              </StopButton>
            )} */}

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
        contents={{ input: contentsBody }}></InputBar>
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
    </Wrapper>
  );
}

interface SearchGuideProps {
  setContents: React.Dispatch<React.SetStateAction<{ input: string }>>;
}

const SearchGuide = (props: SearchGuideProps) => {
  const { t } = useTranslation();

  const PROMPT_EXAMPLE = [
    {
      src: ico_documents,
      txt: t(`Nova.SearchGuide.Example1`)
    },
    {
      src: ico_image,
      txt: t(`Nova.SearchGuide.Example2`)
    },
    {
      src: ico_documents,
      txt: t(`Nova.SearchGuide.Example3`)
    }
  ];

  return (
    <>
      <GuideTitle>
        <div className="title">
          <Icon iconSrc={ico_ai} size="lg" />
          <p>{t(`Nova.SearchGuide.Title`)}</p>
        </div>
        <p className="subTitle">{t(`Nova.SearchGuide.SubTitle`)}</p>
      </GuideTitle>

      <Guidebody>
        {PROMPT_EXAMPLE.map((item) => (
          <GuideExample key={item.txt} onClick={() => props.setContents({ input: item.txt })}>
            <Icon iconSrc={item.src} size="md" />
            <span>{item.txt}</span>
          </GuideExample>
        ))}
      </Guidebody>
    </>
  );
};

const FileUploadWrapper = styled(Wrapper)`
  position: absolute;
  left: 0;
  top: 0;
  background-color: white;

  .header {
    height: 56px;
    display: flex;
    flex-direction: row;
    padding: 12px 16px;
    align-items: center;
  }

  .contents {
    padding: 40px 24px;

    .title {
      height: 24px;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
    }

    .desc {
      height: 108px;
      margin-top: 12px;
      font-weight: 700;
      font-size: 24px;
      line-height: 36px;
    }
  }
  .agentImage {
    display: flex;
    justify-content: center;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 4px;
  padding: 0px;
  background-color: #6f3ad0;
`;

interface FileUploadingProps extends FileUpladState {
  onClickBack: () => void;
  progress: number;
}

const FileUploading = (props: FileUploadingProps) => {
  const { type, state, progress, onClickBack } = props;
  const { t } = useTranslation();
  if (state === 'ready') return null;

  return (
    <FileUploadWrapper>
      <div className="header">
        {state === 'upload' && (
          <IconButton
            iconComponent={IconArrowLeft}
            width={32}
            height={32}
            onClick={onClickBack}></IconButton>
        )}
      </div>
      <ProgressBar progress={progress}></ProgressBar>
      <div className="contents">
        <div className="title">{t(`Nova.UploadState.Uploading`, { type: t(type) })}</div>
        <div className="desc">
          {state === 'upload'
            ? t(`Nova.UploadState.${state}_${type}`)
            : t(`Nova.UploadState.${state}`)}
        </div>
      </div>
      <div className="agentImage">
        <AgentFraphic></AgentFraphic>
      </div>
    </FileUploadWrapper>
  );
};

const ImagePreviewWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;

  .btns {
    width: 100%;
  }

  img {
    background-color: white;
    width: 100%;
  }
`;

interface ImagePreviewProps extends NovaFileInfo {
  onClose: () => void;
}

const ImagePreview = (props: ImagePreviewProps) => {
  return (
    <ImagePreviewWrapper>
      <div className="btns">
        <IconButton
          iconSize="lg"
          cssExt={css`
            color: #fff;
            padding: 0;
            width: 100%;
            display: flex;
            justify-content: flex-end;
          `}
          iconComponent={closeIcon}
          onClick={() => props.onClose()}
        />
      </div>
      <img src={URL.createObjectURL(props.file)} alt="preview" />
    </ImagePreviewWrapper>
  );
};

Nova.SearchGuide = SearchGuide;
Nova.FileUploading = FileUploading;

export const filterCreditInfo = (
  creditInfo: InitialState[],
  nameMap: { [key: string]: string }
) => {
  return creditInfo.filter((item) => nameMap[item.serviceType]);
};
