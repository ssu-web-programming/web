import styled, { FlattenSimpleInterpolation, css } from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import SpeechBubble from '../components/SpeechBubble';
import TextArea from '../components/TextArea';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  Chat,
  INPUT_MAX_LENGTH,
  appendChat,
  removeChat,
  resetDefaultInput,
  selectChatHistory,
  updateChat
} from '../store/slices/chatHistorySlice';
import { v4 as uuidv4 } from 'uuid';
import ChangeExampleButton from '../components/buttons/ChangeExampleButton';
import ChatRecommend from '../components/chat/RecommendBox/ChatRecommend';
import {
  activeRecFunc,
  inactiveRecFunc,
  initRecFunc,
  selectRecFuncSlice
} from '../store/slices/recFuncSlice';
import { activeToast } from '../store/slices/toastSlice';
import icon_ai from '../img/ico_ai.svg';
import Icon from '../components/Icon';
import StopButton from '../components/buttons/StopButton';
import {
  TableCss,
  justiCenter,
  flexColumn,
  flexGrow,
  flexShrink,
  alignItemCenter,
  justiSpaceBetween,
  flex,
  flexWrap
} from '../style/cssCommon';
import { calcToken, getElValue, parseGptVer } from '../api/usePostSplunkLog';
import { setCreating } from '../store/slices/tabSlice';
import { calLeftCredit } from '../util/common';
import { useTranslation } from 'react-i18next';
import useErrorHandle from '../components/hooks/useErrorHandle';
import SendCoinButton from '../components/buttons/SendCoinButton';
import { REC_ID_LIST } from '../components/chat/RecommendBox/FunctionRec';
import { ClientType, getPlatform } from '../util/bridge';
import Button from '../components/buttons/Button';
import { VersionListType, versionList } from '../components/chat/RecommendBox/FormRec';
import DropDownButton from '../components/buttons/DropDownButton';
import { useShowCreditToast } from '../components/hooks/useShowCreditToast';
import { AI_WRITE_RESPONSE_STREAM_API } from '../api/constant';
import { apiWrapper, streaming } from '../api/apiWrapper';

const TEXT_MAX_HEIGHT = 268;

const Wrapper = styled.div`
  ${flex}
  ${flexColumn}
  ${justiSpaceBetween}
  
  width: 100%;
  height: 100%;
  background-color: var(--ai-purple-99-bg-light);

  ${TableCss}
`;

const ChatListWrapper = styled.div<{ isLoading: boolean }>`
  ${flex}
  ${flexColumn}
  ${flexGrow}
  position: relative;

  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: ${({ isLoading }: { isLoading: boolean }) => (isLoading ? '0px' : '66px')};
  /* gap: 16px; */
  padding-top: 16px;
`;

const FloatingBox = styled.div`
  ${flex}
  ${flexGrow}
  ${flexShrink}
  
  position: absolute;
  top: 0px;
  width: 100%;
  transform: translate(0, -100%);
  background-color: transparent;
`;

const InputBox = styled.div<{ activeInputWrap: boolean }>`
  ${flex}
  ${alignItemCenter}
  ${flexColumn}
  ${flexShrink}
  
  height: fit-content;
  width: 100%;
  background-color: white;
  box-shadow: 0 -2px 8px 0 rgba(111, 58, 208, 0.11);
`;

export const RowBox = styled.div<{ cssExt?: FlattenSimpleInterpolation }>`
  ${flex}
  ${justiSpaceBetween}
  ${alignItemCenter}
  width: 100%;
  gap: 6px;

  ${({ cssExt }) => cssExt && cssExt}
`;

export const LengthWrapper = styled.div<{ isError?: boolean; cssExt?: FlattenSimpleInterpolation }>`
  ${flex}
  ${alignItemCenter}

  font-size: 12px;
  color: var(--gray-gray-70);

  ${({ isError }) =>
    isError !== undefined &&
    css`
      color: ${isError ? 'var(--sale)' : 'var(--gray-gray-70)'};
    `}

  ${({ cssExt }) => cssExt && cssExt}
`;

export const VersionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const BoldLengthWrapper = styled(LengthWrapper)`
  font-weight: 500;
`;

const Info = styled.div`
  ${flex}
  ${alignItemCenter}

  background-color: var(--ai-purple-99-bg-light);
  color: var(--ai-purple-50-main);
  padding: 0px 16px;
  line-height: 100%;
  font-size: 12px;
  height: 48px;
  width: 100%;
  gap: 8px;
`;

const CenterBox = styled.div`
  ${flex}
  ${justiCenter};

  width: 100%;
  margin: 16px 0px 16px 0px;
`;

export const ColumDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--ai-purple-97-list-over);
`;

const TextBox = styled(RowBox)`
  textarea {
    ${flex}
    ${justiCenter}
    ${flexGrow}

    width: fit-content;
    border: 0;
    max-height: ${TEXT_MAX_HEIGHT}px;
    height: 48px;
    padding: 14px 16px 14px 16px;

    &:disabled {
      background-color: #fff;
      font-size: 13px;
    }
  }
`;

const InputBottomArea = styled.div`
  width: 100%;
  ${flex}
  ${flexWrap}
  ${justiCenter}
  ${justiSpaceBetween}
  ${alignItemCenter}
  height: 34px;
  padding: 0px 3px 0px 9px;
  border-top: 1px solid var(--ai-purple-99-bg-light);
`;

export const exampleList = [
  'Health',
  'DeliveryIdea',
  'Novel',
  'InterviewTopic',
  'RecommendGift',
  'CreateDoc',
  'AITech',
  'Recipe',
  'BusinessChart',
  'CreateReport'
];

export interface ChatOptions {
  input: string;
  version: VersionListType;
}

interface WriteTabProps {
  options: ChatOptions;
  setOptions: React.Dispatch<React.SetStateAction<ChatOptions>>;
}

const AIChatTab = (props: WriteTabProps) => {
  const dispatch = useAppDispatch();
  const { history: chatHistory, defaultInput } = useAppSelector(selectChatHistory);
  const { selectedRecFunction, selectedSubRecFunction } = useAppSelector(selectRecFuncSlice);
  const { t } = useTranslation();
  const errorHandle = useErrorHandle();
  const showCreditToast = useShowCreditToast();

  const chatTipList = useMemo(() => {
    const platform = getPlatform();

    const tipList = [
      '1ChatingCredit',
      'EnterInfo',
      'DoSepecificQuestion',
      platform === ClientType.ios || platform === ClientType.android
        ? 'CtrlShiftEnterInfo'
        : 'CtrlEnterInfo'
    ];

    return tipList;
  }, []);

  const {
    options: { input: chatInput, version },
    setOptions: setChatInput
  } = props;
  const [isActiveInput, setIsActiveInput] = useState<boolean>(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [retryOrigin, setRetryOrigin] = useState<string | null>(null);
  const [chatTip, setChatTip] = useState<string>(
    chatTipList[Math.floor(Math.random() * chatTipList.length)]
  );
  const [isDefaultInput, setIsDefaultInput] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const requestor = useRef<any>();
  const textRef = useRef<HTMLTextAreaElement>(null);

  const toggleActiveInput = (isActive: boolean) => {
    setIsActiveInput(isActive);
    dispatch(isActive ? activeRecFunc() : inactiveRecFunc());
  };

  const refreshExampleText = () => {
    const text = exampleList[Math.floor(Math.random() * exampleList.length)];
    setChatInput((prev) => ({ ...prev, input: t(`ExampleList.${text}`) }));
  };

  useEffect(() => {
    if (isActiveInput && textRef?.current) {
      textRef.current.focus();
      handleResizeHeight();
    }

    // update chat tip
    const timer = setInterval(() => {
      if (!loadingId && chatInput.length === 0)
        setChatTip(chatTipList[Math.floor(Math.random() * chatTipList.length)]);
    }, 5000);

    if (isActiveInput) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isActiveInput]);

  useEffect(() => {
    if (defaultInput && defaultInput.length > 0 && !loadingId) {
      // setActiveInput(true);
      setChatInput((prev) => ({ ...prev, input: defaultInput }));
      textRef?.current?.focus();

      toggleActiveInput(true);
      dispatch(resetDefaultInput());
    }
  }, [defaultInput]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isActiveInput, loadingId]);

  useEffect(() => {
    if (defaultInput) setIsDefaultInput(true);

    return () => {
      setIsDefaultInput(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleResizeHeight();
  }, [chatInput]);

  const isFormRec = useMemo(() => {
    return (
      (!isDefaultInput && chatHistory.length === 0) ||
      chatHistory[chatHistory.length - 1]?.role === 'reset'
    );
  }, [isDefaultInput, chatHistory]);

  const handleResizeHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = textRef.current.scrollHeight + 'px';
      // chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const validCheckSubmit = () => {
    if (selectedRecFunction?.subList && !selectedSubRecFunction) return false;

    if (chatHistory.length === 0 && chatInput.length === 0) return false;
    else if (chatInput.length === 0 && !selectedRecFunction) return false;
    else return true;
  };

  const getPreProcessing = (chat?: Chat) => {
    if (chat?.preProcessing) {
      return chat.preProcessing;
    } else if (selectedRecFunction && selectedRecFunction.id === REC_ID_LIST.START_NEW_CHATING) {
      return { type: 'just_chat' };
    } else if (isFormRec) {
      return { type: 'just_chat', arg1: selectedRecFunction?.id };
    } else if (selectedRecFunction) {
      return { type: selectedRecFunction.id, arg1: selectedSubRecFunction?.id };
    } else return { type: 'just_chat' };
  };

  const onStop = () => {
    requestor.current?.abort();
    dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.StopMsg`) }));
  };

  const submitChat = async (chat?: Chat) => {
    let history = [...chatHistory];

    if (selectedRecFunction?.id === REC_ID_LIST.START_NEW_CHATING) {
      const infoText = t('ChatingTab.InfoChat');

      dispatch(
        appendChat({
          id: uuidv4(),
          role: 'reset',
          result: infoText,
          input: infoText
        })
      );
      dispatch(initRecFunc());

      history = [];

      if (chatInput.length === 0) return;
    } else {
      const resetId = [...history].reverse().find((chat) => chat.role === 'reset')?.id;

      if (resetId) {
        const resetIndex = chatHistory.findIndex((chat) => chat.id === resetId);
        history = chatHistory.slice(resetIndex + 1, chatHistory.length);
      }
    }

    let resultText = '';
    let splunk = undefined;
    const assistantId = uuidv4();
    const userId = uuidv4();
    let input = chat
      ? chat.input
      : chatInput.length > 0
      ? chatInput
      : chatHistory[chatHistory.length - 1].result;

    const gptVer = chat ? chat.version : version.version;

    dispatch(setCreating('Chatting'));

    setLoadingId(assistantId);

    handleResizeHeight();
    if (textRef.current) textRef.current.style.height = 'auto';

    let preProc = getPreProcessing(chat);

    if (!chat && chatInput.length > 0) {
      dispatch(
        appendChat({
          id: userId,
          role: 'user',
          result: input,
          input: input,
          preProcessing: preProc,
          version: gptVer
        })
      );
    }
    dispatch(
      appendChat({
        id: assistantId,
        role: 'assistant',
        result: '',
        input: input,
        preProcessing: preProc,
        version: gptVer
      })
    );

    try {
      requestor.current = apiWrapper();
      const { res, logger } = await requestor.current?.request(AI_WRITE_RESPONSE_STREAM_API, {
        body: {
          engine: gptVer,
          history: [
            ...history
              .filter((history) => history.role !== 'reset')
              .map((chat) => ({ content: chat.result, role: chat.role })),
            {
              content: input,
              role: 'user',
              preProcessing: preProc
            }
          ]
        },
        method: 'POST'
      });
      splunk = logger;

      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
      showCreditToast(deductionCredit, leftCredit);

      await streaming(res, (contents) => {
        dispatch(
          updateChat({ id: assistantId, role: 'assistant', result: contents, input: input })
        );
        resultText += contents;
      });

      setChatInput((prev) => ({ ...prev, input: '' }));
      dispatch(initRecFunc());
    } catch (error: any) {
      if (requestor.current?.isAborted() === true) {
        setChatInput((prev) => ({ ...prev, input: '' }));
        dispatch(initRecFunc());
      } else {
        errorHandle(error);

        const assistantResult = chatHistory?.filter((history) => history.id === assistantId)[0]
          ?.result;
        if (!assistantResult || assistantResult?.length === 0) {
          dispatch(removeChat(userId));
          dispatch(removeChat(assistantId));
          if (input) {
            setChatInput((prev) => ({ ...prev, input }));
            setIsActiveInput(true);
          }
        }
      }
    } finally {
      setLoadingId(null);
      dispatch(setCreating('none'));
      setRetryOrigin(null);

      if (splunk) {
        try {
          const el = getElValue(selectedRecFunction?.id);
          const input_token = calcToken(chatInput);
          const output_token = calcToken(resultText);
          const gpt_ver = parseGptVer(gptVer!);
          splunk({
            dp: 'ai.write',
            el,
            input_token,
            output_token,
            gpt_ver
          });
        } catch (err) {}
      }
    }
  };

  const placeholder = useMemo(() => t(`ChatingTab.InputPlaceholder`), [t]);

  const groupVersionList = useMemo(() => {
    return versionList.reduce((acc: { group: string; list: VersionListType[] }[], cur) => {
      if (cur.group !== null) {
        const prevGroup = acc.findIndex((a) => cur.group === a.group);
        if (prevGroup >= 0) {
          acc[prevGroup].list.push(cur);
        } else acc.push({ group: cur.group, list: [cur] });
      }
      return acc;
    }, []);
  }, []);

  return (
    <Wrapper>
      <ChatListWrapper
        style={{ position: 'relative' }}
        isLoading={loadingId ? true : false}
        onClick={(e) => {
          toggleActiveInput(false);
          // dispatch(closeRecFunc());
        }}>
        <SpeechBubble
          chat={{
            id: 'info',
            result: t(`ChatingTab.AIGreeting`),
            role: 'info',
            input: t(`ChatingTab.AIGreeting`)
          }}
        />
        {chatHistory.map((chat) => (
          <SpeechBubble
            key={chat.id}
            loadingId={loadingId}
            chat={chat}
            submitChat={submitChat}
            retryOrigin={retryOrigin}
            setRetryOrigin={setRetryOrigin}
            chatInput={chatInput}
          />
        ))}
        <div ref={chatEndRef}></div>
      </ChatListWrapper>
      {loadingId && (
        <CenterBox>
          <StopButton onClick={onStop} />
        </CenterBox>
      )}
      <div style={{ position: 'relative', display: 'flex' }}>
        <FloatingBox>
          {isActiveInput && !loadingId ? (
            <ChatRecommend isFormRec={isFormRec} />
          ) : (
            !loadingId &&
            chatInput.length === 0 && (
              <Info>
                <div style={{ display: 'flex', width: '16px', height: '20px', marginRight: '6px' }}>
                  <Icon iconSrc={icon_ai} />
                </div>
                {t(`ChatingTab.TipList.${chatTip}`)}
              </Info>
            )
          )}
        </FloatingBox>

        <InputBox
          activeInputWrap={isActiveInput && !loadingId}
          style={{ position: 'relative', display: 'flex' }}>
          <TextBox
            onClick={() => {
              toggleActiveInput(true);
            }}>
            <TextArea
              disable={loadingId !== null}
              placeholder={!loadingId ? placeholder : ''}
              textRef={textRef}
              rows={1}
              value={loadingId !== null ? '' : chatInput}
              onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  if (validCheckSubmit()) {
                    setIsActiveInput(false);
                    submitChat();
                  } else {
                    e.preventDefault();
                  }
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setChatInput((prev) => ({
                  ...prev,
                  input: e.target.value.slice(0, INPUT_MAX_LENGTH)
                }));
                if (isDefaultInput && e.target.value.length === 0) setIsDefaultInput(false);
              }}
            />
            {!loadingId && isActiveInput && (
              <SendCoinButton
                disabled={!validCheckSubmit()}
                onClick={() => {
                  if (validCheckSubmit()) {
                    setIsActiveInput(false);
                    submitChat();
                  }
                }}
              />
            )}
          </TextBox>
          {!loadingId && isActiveInput && (
            <InputBottomArea>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                <LengthWrapper isError={chatInput.length >= INPUT_MAX_LENGTH}>
                  {chatInput.length}/{INPUT_MAX_LENGTH}
                </LengthWrapper>
                <VersionWrapper>
                  <>
                    {groupVersionList.map((group) => {
                      return group.list.length > 1 ? (
                        <DropDownButton<VersionListType>
                          width={77}
                          height="full"
                          key={group.group}
                          list={group.list}
                          onItemClick={(item: VersionListType) => {
                            setChatInput((prev) => ({ ...prev, version: item }));
                          }}
                          selectedId={version.id}
                          defaultId={group.list[0].id}
                        />
                      ) : (
                        <Button
                          key={group.list[0].id}
                          width="fit"
                          height={24}
                          variant={group.list[0].version === version.version ? 'purple' : 'gray'} // no comment
                          onClick={() =>
                            setChatInput((prev) => ({ ...prev, version: group.list[0] }))
                          }>
                          {group.list[0].id}
                        </Button>
                      );
                    })}
                  </>
                </VersionWrapper>
              </div>
              <ChangeExampleButton disable={chatInput.length > 0} onClick={refreshExampleText} />
            </InputBottomArea>
          )}
        </InputBox>
      </div>
    </Wrapper>
  );
};

export default AIChatTab;
