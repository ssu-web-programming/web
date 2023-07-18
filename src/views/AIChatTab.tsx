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
import ChatRecommend, { RowWrapBox } from '../components/chat/RecommendBox/ChatRecommend';
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
  flex
} from '../style/cssCommon';
import { calcToken, getElValue } from '../api/usePostSplunkLog';
import { setCreating } from '../store/slices/tabSlice';
import { CHAT_STREAM_API, JSON_CONTENT_TYPE } from '../api/constant';
import { calLeftCredit } from '../util/common';
import useApiWrapper from '../api/useApiWrapper';
import { useTranslation } from 'react-i18next';
import useErrorHandle from '../components/hooks/useErrorHandle';
import { GPT_EXCEEDED_LIMIT } from '../error/error';
import SendCoinButton from '../components/buttons/SendCoinButton';
import { REC_ID_LIST } from '../components/chat/RecommendBox/FunctionRec';
import { ClientType, getPlatform } from '../util/bridge';

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
  gap: 16px;
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

export const BoldLengthWrapper = styled(LengthWrapper)`
  font-weight: 500;
`;

export const RightBox = styled.div<{ cssExt?: FlattenSimpleInterpolation }>`
  ${flex}
  ${alignItemCenter}

  align-self: flex-end;
  gap: 11px;

  ${({ cssExt }) => cssExt && cssExt}
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

const InputBottomArea = styled(RowWrapBox)`
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
}

interface WriteTabProps {
  options: ChatOptions;
  setOptions: React.Dispatch<React.SetStateAction<ChatOptions>>;
}

const AIChatTab = (props: WriteTabProps) => {
  const dispatch = useAppDispatch();
  const apiWrapper = useApiWrapper();
  const { history: chatHistory, defaultInput } = useAppSelector(selectChatHistory);
  const { selectedRecFunction, selectedSubRecFunction } = useAppSelector(selectRecFuncSlice);
  const { t } = useTranslation();
  const errorHandle = useErrorHandle();

  const chatTipList = useMemo(() => {
    const platform = getPlatform();

    const tipList = [
      '1ChatingCredit',
      'EnterInfo',
      'DoSepecificQuestion',
      'DateInfo',
      platform === ClientType.ios || platform === ClientType.android
        ? 'CtrlShiftEnterInfo'
        : 'CtrlEnterInfo'
    ];

    return tipList;
  }, []);

  const {
    options: { input: chatInput },
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
  const stopRef = useRef<boolean>(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const toggleActiveInput = (isActive: boolean) => {
    setIsActiveInput(isActive);
    dispatch(isActive ? activeRecFunc() : inactiveRecFunc());
  };

  const refreshExampleText = () => {
    const text = exampleList[Math.floor(Math.random() * exampleList.length)];
    setChatInput({ input: t(`ExampleList.${text}`) });
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
      setChatInput({ input: defaultInput });
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
    let splunk = null;
    const assistantId = uuidv4();
    const userId = uuidv4();
    let input = chat
      ? chat.input
      : chatInput.length > 0
      ? chatInput
      : chatHistory[chatHistory.length - 1].result;

    dispatch(setCreating('Chating'));

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
          preProcessing: preProc
        })
      );
    }
    dispatch(
      appendChat({
        id: assistantId,
        role: 'assistant',
        result: '',
        input: input,
        preProcessing: preProc
      })
    );

    try {
      const { res, logger } = await apiWrapper(CHAT_STREAM_API, {
        headers: {
          ...JSON_CONTENT_TYPE,
          'User-Agent': navigator.userAgent
        }, //   responseType: 'stream',
        body: JSON.stringify({
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
        }),
        method: 'POST'
      });
      splunk = logger;

      if (res.status !== 200) {
        if (res.status === 400) throw new Error(GPT_EXCEEDED_LIMIT);
        else throw res;
      }

      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
      dispatch(
        activeToast({
          type: 'info',
          msg: t(`ToastMsg.StartCreating`, {
            deductionCredit: deductionCredit,
            leftCredit: leftCredit
          })
        })
      );

      const reader = res.body?.getReader();
      var enc = new TextDecoder('utf-8');

      while (reader) {
        // if (isFull) break;
        if (stopRef.current) {
          reader.cancel();
          dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.StopMsg`) }));
          break;
        }

        const { value, done } = await reader.read();
        if (done) {
          // setProcessState(PROCESS_STATE.COMPLETE_GENERATE);
          break;
        }

        const decodeStr = enc.decode(value);
        dispatch(
          updateChat({ id: assistantId, role: 'assistant', result: decodeStr, input: input })
        );
        resultText += decodeStr;
      }

      setChatInput({ input: '' });
      dispatch(initRecFunc());
    } catch (error: any) {
      errorHandle(error);

      const assistantResult = chatHistory?.filter((history) => history.id === assistantId)[0]
        ?.result;
      if (!assistantResult || assistantResult?.length === 0) {
        dispatch(removeChat(userId));
        dispatch(removeChat(assistantId));
        if (input) {
          setChatInput({ input });
          setIsActiveInput(true);
        }
      }
    } finally {
      if (splunk) {
        const el = getElValue(selectedRecFunction?.id);
        const input_token = calcToken(chatInput);
        const output_token = calcToken(resultText);
        splunk({
          dp: 'ai.write',
          el,
          input_token,
          output_token
        });
      }

      setLoadingId(null);
      stopRef.current = false;
      dispatch(setCreating('none'));
      // toggleActiveInput(false);

      setRetryOrigin(null);
    }
  };

  const placeholder = useMemo(() => t(`ChatingTab.InputPlaceholder`), [t]);

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
          <StopButton
            onClick={() => {
              stopRef.current = true;
            }}
          />
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
                setChatInput({ input: e.target.value.slice(0, INPUT_MAX_LENGTH) });
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
              <LengthWrapper isError={chatInput.length >= INPUT_MAX_LENGTH}>
                {chatInput.length}/{INPUT_MAX_LENGTH}
              </LengthWrapper>
              <ChangeExampleButton disable={chatInput.length > 0} onClick={refreshExampleText} />
            </InputBottomArea>
          )}
        </InputBox>
      </div>
    </Wrapper>
  );
};

export default AIChatTab;
