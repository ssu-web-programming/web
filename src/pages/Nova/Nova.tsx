import { useCallback, useRef, useState } from 'react';
import InputBar, { InputBarSubmitParam } from 'components/nova/InputBar';
import styled, { css } from 'styled-components';
import { useAppDispatch, useAppSelector } from 'store/store';
import {
  pushChat,
  initNovaHistory,
  novaHistorySelector,
  appendChatOutput,
  addChatOutputRes,
  updateChatStatus
} from 'store/slices/novaHistorySlice';
import { apiWrapper, streaming } from 'api/apiWrapper';
import { v4 } from 'uuid';
import Tooltip, { TooltipOption } from 'components/Tooltip';
import { useConfirm } from 'components/Confirm';
import { NOVA_CHAT_API } from 'api/constant';
import { markdownToHtml } from 'util/common';
import { load } from 'cheerio';
import Icon from 'components/Icon';
import IconButton from 'components/buttons/IconButton';
import ico_ai from 'img/ico_ai.svg';
import ico_nova from 'img/ico_nova.svg';
import ico_credit_info from 'img/ico_credit_line.svg';
import ico_credit from 'img/ico_credit_gray.svg';
import { ReactComponent as IconMessagePlus } from 'img/ico_message_plus.svg';
import ChatList from 'components/nova/ChatList';
import ico_magnifying_glass from 'img/ico_magnifying_glass.svg';
import { useTranslation } from 'react-i18next';
import { activeToast } from 'store/slices/toastSlice';
import { selectTabSlice, setCreating } from 'store/slices/tabSlice';
import { useLocation } from 'react-router-dom';

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

const StopButton = styled.button`
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translate(-50%);
`;

type CreditInfoType = {
  [key: string]: string;
};

export default function Nova() {
  const location = useLocation();
  const [credit, setCredit] = useState<CreditInfoType>({
    chat: '3',
    doc: '10',
    img: '10',
    imgGen: '10'
  });
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);
  const { creating } = useAppSelector(selectTabSlice);
  const confirm = useConfirm();
  const { t } = useTranslation();

  const requestor = useRef<ReturnType<typeof apiWrapper>>();

  const onSubmit = useCallback(
    async (submitParam: InputBarSubmitParam) => {
      const id = v4();
      let result = '';
      try {
        dispatch(setCreating('NOVA'));
        const lastChat = novaHistory[novaHistory.length - 1];
        const { vsId = '', threadId = '' } = lastChat || {};
        const { input, files = [], type } = submitParam;
        const formData = new FormData();
        for (const file of files) {
          formData.append('uploadFiles', file);
        }

        const role = 'user';
        formData.append('content', input);
        formData.append('role', role);
        formData.append('type', type);
        formData.append('vsId', vsId);
        formData.append('threadId', threadId);

        dispatch(pushChat({ id, input, type, role, vsId, threadId, output: '' }));

        requestor.current = apiWrapper();
        const { res } = await requestor.current.request(NOVA_CHAT_API, {
          headers: {},
          body: formData,
          method: 'POST'
        });

        const resVsId = res.headers.get('X-PO-AI-ASSISTANT-API-VSID') || '';
        const resThreadId = res.headers.get('X-PO-AI-ASSISTANT-API-TID') || '';

        await streaming(res, (contents) => {
          dispatch(
            appendChatOutput({
              id,
              output: contents,
              vsId: resVsId,
              threadId: resThreadId
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
      dispatch(initNovaHistory());
    }
  };

  const nameMap: { [key: string]: string } = {
    chat: t(`Nova.CreditInfo.Chat`),
    doc: t(`Nova.CreditInfo.DocQuery`),
    img: t(`Nova.CreditInfo.ImgQuery`),
    imgGen: t(`Nova.CreditInfo.ImgGen`)
  };

  const TOOLTIP_CREDIT_OPTIONS: TooltipOption[] = Object.entries(credit).map(([key, value]) => ({
    name: nameMap[key] || 'Unknown',
    icon: { src: ico_credit, txt: value }
  }));

  const onStop = () => {
    requestor.current?.abort();
    dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.StopMsg`) }));
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
            <ChatList novaHistory={novaHistory} onSubmit={onSubmit}></ChatList>
            {creating !== 'none' && <StopButton onClick={onStop}>stop</StopButton>}
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
      src: ico_magnifying_glass,
      txt: t(`Nova.SearchGuide.Example1`)
    },
    {
      src: ico_magnifying_glass,
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
