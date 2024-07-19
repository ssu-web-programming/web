import { useCallback, useRef } from 'react';
import InputBar, { InputBarSubmitParam } from 'components/nova/InputBar';
import styled, { css } from 'styled-components';
import { useAppDispatch, useAppSelector } from 'store/store';
import {
  pushChat,
  initNovaHistory,
  novaHistorySelector,
  appendChatOutput,
  addChatOutputRes,
  updateChatStatus,
  NovaChatType
} from 'store/slices/novaHistorySlice';
import { apiWrapper, streaming } from 'api/apiWrapper';
import { v4 } from 'uuid';
import Tooltip from 'components/Tooltip';
import { useConfirm } from 'components/Confirm';
import { NOVA_CHAT_API, NOVA_DELETE_CONVERSATION, PO_DRIVE_UPLOAD } from 'api/constant';
import { insertDoc, markdownToHtml } from 'util/common';
import Bridge from 'util/bridge';
import { load } from 'cheerio';
import Icon from 'components/Icon';
import IconButton from 'components/buttons/IconButton';
import ico_ai from 'img/ico_ai.svg';
import ico_nova from 'img/ico_nova.svg';
import ico_credit_info from 'img/ico_credit_line.svg';
import ico_credit from 'img/ico_credit_gray.svg';
import { ReactComponent as IconMessagePlus } from 'img/ico_message_plus.svg';
import ChatList from 'components/nova/ChatList';
import ico_image from 'img/ico_image.svg';
import ico_documents from 'img/ico_documents.svg';
import stop_circle from 'img/stop_circle.svg';
import { useTranslation } from 'react-i18next';
import { activeToast } from 'store/slices/toastSlice';
import { selectTabSlice, setCreating } from 'store/slices/tabSlice';
import { useLocation } from 'react-router-dom';
import IconTextButton from 'components/buttons/IconTextButton';
import { creditInfoSelector, InitialState } from 'store/slices/creditInfo';

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

const StopButton = styled.div`
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translate(-50%);
`;

export default function Nova() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);
  const { creating } = useAppSelector(selectTabSlice);
  const creditInfo = useAppSelector(creditInfoSelector);
  const { t } = useTranslation();
  const confirm = useConfirm();

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

  const requestor = useRef<ReturnType<typeof apiWrapper>>();

  const reqUploadFiles = async (files: File[]) => {
    // TODO : promise all
    const ret = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('uploadFile', file);
      const { res } = await apiWrapper().request(PO_DRIVE_UPLOAD, {
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

  const onSubmit = useCallback(
    async (submitParam: InputBarSubmitParam) => {
      const id = v4();
      let result = '';
      try {
        dispatch(setCreating('NOVA'));
        const lastChat = novaHistory[novaHistory.length - 1];
        const { vsId = '', threadId = '' } = lastChat || {};
        const { input, files = [], type } = submitParam;

        const resUpload = await reqUploadFiles(files);
        const formData = new FormData();
        resUpload
          .filter((res) => res.success)
          .forEach((res) => {
            if (res.success) {
              formData.append('uploadFiles', res.file);
              formData.append('fileIds[]', res.data.fileId);
            }
          });

        const role = 'user';
        formData.append('content', input);
        formData.append('role', role);
        formData.append('type', type);
        formData.append('vsId', vsId);
        formData.append('threadId', threadId);

        dispatch(pushChat({ id, input, type, role, vsId, threadId, output: '' }));

        requestor.current = apiWrapper();
        const { res } = await requestor.current.request(NOVA_CHAT_API, {
          body: formData,
          method: 'POST'
        });

        const resVsId = res.headers.get('X-PO-AI-NOVA-API-VSID') || '';
        const resThreadId = res.headers.get('X-PO-AI-NOVA-API-TID') || '';
        const askType = res.headers.get('X-PO-AI-NOVA-API-ASK-TYPE') || '';

        await streaming(res, (contents) => {
          dispatch(
            appendChatOutput({
              id,
              output: contents,
              vsId: resVsId,
              threadId: resThreadId,
              askType: askType as NovaChatType['askType']
            })
          );
          result += contents;
        });
        dispatch(updateChatStatus({ id, status: 'done' }));
      } catch (err) {
        if (requestor.current?.isAborted() === true) {
          dispatch(updateChatStatus({ id, status: 'cancel' }));
        } else {
          // TODO : error handling
        }
      } finally {
        dispatch(setCreating('none'));
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
    [novaHistory, dispatch]
  );

  const newChat = async () => {
    const ret = await confirm({
      title: t(`Nova.NewChat.Title`)!,
      msg: t(`Nova.NewChat.Msg`),
      onCancel: { text: t(`Cancel`)!, callback: () => {} },
      onOk: {
        text: t(`Nova.NewChat.Ok`),
        callback: () => {}
      },
      direction: 'row'
    });

    if (!!ret) {
      try {
        const lastChat = novaHistory[novaHistory.length - 1];
        apiWrapper().request(NOVA_DELETE_CONVERSATION, {
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ threadId: lastChat.threadId })
        });
        dispatch(initNovaHistory());
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onStop = () => {
    requestor.current?.abort();
    dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.StopMsg`) }));
  };

  const onCopy = (output: string) => {
    navigator.clipboard.writeText(output).then(
      () => {
        dispatch(activeToast({ type: 'info', msg: '복사 완료' }));
      },
      () => {
        dispatch(activeToast({ type: 'error', msg: '복사 실패' }));
      }
    );
  };

  const handleInsertDocs = (history: NovaChatType) => {
    type StatusType = 'home' | 'doc_edit_mode' | 'doc_view_mode';
    Bridge.callSyncBridgeApiWithCallback({
      api: 'getClientStatus',
      callback: async (status: StatusType) => {
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
                } catch (err) {}
                break;
              }
              case 'document':
              default: {
                insertDoc(history.output);
                break;
              }
            }
            break;
        }
      }
    });
  };

  const confirmPermission = async () => {
    const ret = await confirm({
      msg: t(`Nova.ConfirmAccess.Msg`),
      onCancel: { text: t(`Nova.ConfirmAccess.Cancel`), callback: () => {} },
      onOk: {
        text: t(`Nova.ConfirmAccess.Ok`),
        callback: () => {}
      },
      direction: 'row'
    });

    if (ret) {
      alert('접근 권한 허용함');
    }
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
    const hasPermission = true; // 임시
    const imageURL = currentChat?.res!;

    if (!!hasPermission) {
      try {
        if (imageURL) {
          await downloadImage(imageURL);
          dispatch(activeToast({ type: 'info', msg: '저장 완료' }));
        }
      } catch {
        dispatch(activeToast({ type: 'error', msg: '저장 실패' }));
      }
    } else {
      confirmPermission();
    }
  };

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
            <Nova.SearchGuide />
          </GuideWrapper>
        ) : (
          <>
            <ChatList
              novaHistory={novaHistory}
              onSubmit={onSubmit}
              onCopy={onCopy}
              handleInsertDocs={handleInsertDocs}
              onSave={onSave}
            />
            {creating !== 'none' && (
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
            )}
          </>
        )}
      </Body>
      <InputBar
        disabled={creating !== 'none'}
        onSubmit={onSubmit}
        contents={location.state?.body}></InputBar>
    </Wrapper>
  );
}

const SearchGuide = () => {
  const { t } = useTranslation();

  const PROMPT_EXAMPLE = [
    {
      src: ico_image,
      txt: t(`Nova.SearchGuide.Example1`)
    },
    {
      src: ico_documents,
      txt: t(`Nova.SearchGuide.Example2`)
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
          <GuideExample key={item.txt}>
            <Icon iconSrc={item.src} size="md" />
            <span>{item.txt}</span>
          </GuideExample>
        ))}
      </Guidebody>
    </>
  );
};

Nova.SearchGuide = SearchGuide;

export const filterCreditInfo = (
  creditInfo: InitialState[],
  nameMap: { [key: string]: string }
) => {
  return creditInfo.filter((item) => nameMap[item.serviceType]);
};
