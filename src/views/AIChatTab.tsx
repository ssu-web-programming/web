import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import SpeechBubble from '../components/SpeechBubble';
import TextArea from '../components/TextArea';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  Chat,
  INPUT_MAX_LENGTH,
  appendChat,
  initChatHistory,
  resetDefaultInput,
  selectChatHistory,
  updateChat
} from '../store/slices/chatHistorySlice';
import { v4 as uuidv4 } from 'uuid';
import Button from '../components/Button';
import OpenAILinkText from '../components/OpenAILinkText';
import ExButton from '../components/ExButton';
import FuncRecBox, { REC_ID_LIST, RowWrapBox } from '../img/aiChat/FuncRecBox';
import {
  activeRecFunc,
  inactiveRecFunc,
  initRecFunc,
  selectRecFuncSlice
} from '../store/slices/recFuncSlice';
import { activeToast } from '../store/slices/toastSlice';
import icon_ai from '../img/ico_ai.svg';
import Icon from '../components/Icon';
import CopyIcon from '../components/CopyIcon';
import StopButton from '../components/StopButton';
import {
  TableCss,
  justiCenter,
  flexColumn,
  flexGrow,
  flexShrink,
  alignItemCenter,
  purpleBtnCss,
  justiSpaceBetween,
  alignItemEnd,
  flex
} from '../style/cssCommon';
import { setLoadingTab } from '../store/slices/tabSlice';
import { CHAT_STREAM_API, JSON_CONTENT_TYPE } from '../api/constant';
import { calLeftCredit, insertDoc } from '../util/common';
import icon_sand from '../img/ico_send.svg';
import { setBridgeMessage } from '../store/slices/bridge';
import useApiWrapper from '../api/useApiWrapper';
import icon_credit from '../img/ico_credit.svg';
import { useTranslation } from 'react-i18next';
import useErrorHandle from '../components/hooks/useErrorHandle';
import { firstRecList } from '../img/aiChat/FuncRecBox';
import { updateDefaultInput } from '../store/slices/chatHistorySlice';

const INPUT_HEIGHT = 120;
const TEXT_MAX_HEIGHT = 268;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${flexColumn}
  ${justiSpaceBetween}
  box-sizing: border-box;
  background-color: var(--ai-purple-99-bg-light);

  ${TableCss}
`;

const ChatListWrapper = styled.div<{ isLoading: boolean }>`
  ${flexColumn}
  /* ${flexColumn}
  ${flexGrow} */
  position: relative;

  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  overflow-x: hidden;
  margin-bottom: ${({ isLoading }: { isLoading: boolean }) => (isLoading ? '0px' : '48px')};
`;

const FloatingBox = styled.div`
  position: absolute;
  top: 0px;
  width: 100%;
  box-sizing: border-box;
  /* flex: 1; */
  ${flexGrow}
  ${flexShrink}

  transform: translate(0, -100%);
  background-color: transparent;
  box-sizing: border-box;
`;

const InputBox = styled.div<{ activeInputWrap: boolean }>`
  box-sizing: border-box;
  /* padding: ${({ activeInputWrap }: { activeInputWrap: boolean }) =>
    activeInputWrap ? '5px 5px 0px 5px' : '5px'}; */
  /* padding: 5px; */
  /* min-height: 30px; */
  ${alignItemCenter}

  height: fit-content;
  width: 100%;
  background-color: white;
  ${alignItemCenter}
  ${flexColumn}
  ${flexShrink}
  box-shadow: 0 -2px 8px 0 rgba(111, 58, 208, 0.11);
`;

export const RowBox = styled.div<{ cssExt?: any }>`
  ${justiSpaceBetween}
  ${alignItemCenter}
  width: 100%;

  ${({ cssExt }) => cssExt && cssExt}
`;

export const LengthWrapper = styled.div<{ isError?: boolean; cssExt?: any }>`
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

export const RightBox = styled.div`
  ${alignItemCenter}

  align-self: flex-end;
  margin-top: 9px;
`;

const Info = styled.div`
  background-color: var(--ai-purple-99-bg-light);
  color: var(--ai-purple-50-main);
  padding: 14px 16px 14px 16px;
  font-size: 12px;
  height: 48px;
  box-sizing: border-box;
  font-size: 12px;

  ${alignItemCenter}
`;

const CenterBox = styled.div`
  width: 100%;
  margin-bottom: 16px;
  margin-top: 16px;
  ${justiCenter};
`;

export const ColumDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--ai-purple-97-list-over);
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  margin: 0;
  padding: 0;
  border: none;
  background-image: linear-gradient(to left, #a86cea, #6f3ad0 100%);
  padding: 5px;
  width: 40px;
  height: 32px;
  box-sizing: border-box;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 8px;
  &:hover {
    cursor: pointer;
  }

  ${alignItemEnd}
  align-self: flex-end;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.3;
    `}
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

const chatTipList = [
  '1ChatingCredit',
  'EnterInfo',
  'CtrlEnterInfo',
  'DoSepecificQuestion',
  'DateInfo'
];

const AIChatTab = () => {
  const dispatch = useAppDispatch();
  const apiWrapper = useApiWrapper();
  const { history: chatHistory, defaultInput } = useAppSelector(selectChatHistory);
  const { selectedRecFunction, selectedSubRecFunction } = useAppSelector(selectRecFuncSlice);
  const { t } = useTranslation();
  const errorHandle = useErrorHandle();

  const [chatInput, setChatInput] = useState<string>('');
  const [isActiveInput, setIsActiveInput] = useState<boolean>(false);
  const [loadingInfo, setLoadingInfo] = useState<{ id: string; msg: string } | null>(null);
  const [retryOrigin, setRetryOrigin] = useState<string | null>(null);
  const [chatTip, setChatTip] = useState<string>(
    chatTipList[Math.floor(Math.random() * chatTipList.length)]
  );
  const [isDefaultInput, setIsDefaultInput] = useState<boolean>(false);
  const chatEndRef = useRef<any>();
  const stopRef = useRef<boolean>(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const toggleActiveInput = (isActive: boolean) => {
    setIsActiveInput(isActive);
    dispatch(isActive ? activeRecFunc() : inactiveRecFunc());
  };

  useEffect(() => {
    // update chat tip
    const timer = setInterval(() => {
      if (!loadingInfo && chatInput.length === 0)
        setChatTip(chatTipList[Math.floor(Math.random() * chatTipList.length)]);
    }, 5000);

    if (isActiveInput) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isActiveInput]);

  useEffect(() => {
    if (defaultInput && defaultInput.length > 0 && !loadingInfo) {
      // setActiveInput(true);
      setChatInput(defaultInput);
      textRef?.current?.focus();

      toggleActiveInput(true);
      dispatch(resetDefaultInput());
    }
  }, []);

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isActiveInput, loadingInfo]);

  useEffect(() => {
    if (chatHistory.length === 0) {
      dispatch(
        initChatHistory({
          id: uuidv4(),
          role: 'assistant',
          result: t(`ChatingTab.AIGreeting`),
          input: ''
        })
      );
    }

    if (defaultInput) setIsDefaultInput(true);

    return () => {
      setIsDefaultInput(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isDefaultInput && chatInput.length > 0) handleResizeHeight();
  }, [chatInput]);

  const handleResizeHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = textRef.current.scrollHeight + 'px';
      // chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const validInput = () => {
    if (chatHistory.length === 1 && chatInput.length === 0) return false;
    else if (chatInput.length === 0 && !selectedRecFunction) return false;
    else return true;
  };

  const getPreProcessing = (chat?: Chat) => {
    if (chat?.preProcessing) {
      return chat.preProcessing;
    } else if (chatHistory.length === 1) {
      return { type: 'just_chat', arg1: selectedRecFunction?.id };
    } else if (selectedRecFunction) {
      return { type: selectedRecFunction.id, arg1: selectedSubRecFunction?.id };
    } else return { type: 'just_chat' };
  };

  const submitChat = async (chat?: Chat) => {
    try {
      dispatch(setLoadingTab(true));
      setChatInput('');

      let input = chat
        ? chat.input
        : chatInput.length > 0
        ? chatInput
        : chatHistory[chatHistory.length - 1].result;

      const assistantId = uuidv4();
      const msg = selectLoadingMsg(chat ? true : false);
      setLoadingInfo({ id: assistantId, msg: msg });

      handleResizeHeight();
      if (textRef.current) textRef.current.style.height = 'auto';

      let preProc = getPreProcessing(chat);

      if (!chat && chatInput.length > 0) {
        dispatch(
          appendChat({
            id: uuidv4(),
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

      const res = await apiWrapper(CHAT_STREAM_API, {
        headers: {
          ...JSON_CONTENT_TYPE,
          'User-Agent': navigator.userAgent
        }, //   responseType: 'stream',
        body: JSON.stringify({
          history: [
            ...chatHistory.map((chat) => ({ content: chat.result, role: chat.role })),
            {
              content: input,
              role: 'user',
              preProcessing: preProc
            }
          ]
        }),
        method: 'POST'
      });

      if (res.status !== 200) {
        throw res;
      }

      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
      dispatch(
        activeToast({
          active: true,
          msg: t(`ToastMsg.StartCreating`, {
            deductionCredit: deductionCredit,
            leftCredit: leftCredit
          }),
          isError: false
        })
      );

      const reader = res.body?.getReader();
      var enc = new TextDecoder('utf-8');

      while (reader) {
        // if (isFull) break;
        if (stopRef.current) {
          reader.cancel();
          dispatch(
            activeToast({
              active: true,
              msg: t(`ToastMsg.StopMsg`),
              isError: false
            })
          );
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
      }
    } catch (error: any) {
      errorHandle(error);
    } finally {
      setLoadingInfo(null);
      stopRef.current = false;
      dispatch(initRecFunc());
      dispatch(setLoadingTab(false));
      toggleActiveInput(false);

      if (chat) setRetryOrigin(null);
    }
  };

  useEffect(() => {
    if (isActiveInput && textRef?.current) {
      textRef.current.focus();
    }
  }, [isActiveInput]);

  const selectLoadingMsg = (isRetry: boolean) => {
    if (isRetry) return t(`ChatingTab.LoadingMsg.ReCreating`);

    const isFirstRec = firstRecList.filter((rec) => rec.id === selectedRecFunction?.id).length > 0;
    if (isFirstRec || (!isFirstRec && !selectedRecFunction && chatInput.length > 0)) {
      return t(`ChatingTab.LoadingMsg.Creating`);
    }

    let msg = '';

    switch (selectedRecFunction?.id) {
      case REC_ID_LIST.RESUME_WRITING:
        if (chatInput.length > 0) msg = t(`ChatingTab.LoadingMsg.ContitnueWriting_input`);
        else msg = t(`ChatingTab.LoadingMsg.ContitnueWriting`);
        break;
      case REC_ID_LIST.SUMMARY:
        if (chatInput.length > 0) msg = t(`ChatingTab.LoadingMsg.Summary_input`);
        else msg = t(`ChatingTab.LoadingMsg.Summary`);
        break;
      case REC_ID_LIST.TRANSLATE:
        if (chatInput.length > 0 && selectedSubRecFunction)
          msg = t(`ChatingTab.LoadingMsg.Translate_input`, {
            language: t(`ChatingTab.FuncRecBtn.SubFuncRec.${selectedSubRecFunction.title}`)
          });
        else if (selectedSubRecFunction)
          msg = t(`ChatingTab.LoadingMsg.Translate`, {
            language: t(`ChatingTab.FuncRecBtn.SubFuncRec.${selectedSubRecFunction.title}`)
          });
        break;
      case REC_ID_LIST.CHANGE_TEXT_STYLE:
        if (chatInput.length > 0 && selectedSubRecFunction)
          msg = t(`ChatingTab.LoadingMsg.ChangeStyle_input`, {
            style: t(`ChatingTab.FuncRecBtn.SubFuncRec.${selectedSubRecFunction.title}`)
          });
        else if (selectedSubRecFunction)
          msg = t(`ChatingTab.LoadingMsg.ChangeStyle`, {
            style: t(`ChatingTab.FuncRecBtn.SubFuncRec.${selectedSubRecFunction.title}`)
          });
        break;
      case REC_ID_LIST.MODIFY_TEXT:
        if (chatInput.length > 0) msg = t(`ChatingTab.LoadingMsg.Grammar_input`);
        else msg = t(`ChatingTab.LoadingMsg.Grammar`);
        break;
    }

    return msg;
  };

  const placeholder = t(`ChatingTab.InputPlaceholder`);

  return (
    <Wrapper>
      <ChatListWrapper
        style={{ position: 'relative' }}
        isLoading={loadingInfo?.id ? true : false}
        onClick={(e) => {
          toggleActiveInput(false);
          // dispatch(closeRecFunc());
        }}>
        {chatHistory.map((chat, index) => (
          <SpeechBubble
            loadingMsg={loadingInfo?.id === chat.id ? loadingInfo.msg : undefined}
            key={chat.id}
            text={chat.role === 'assistant' ? chat.result : chat.input}
            isUser={chat.role === 'user'}
            innerChild={
              // chat.id !== loadingInfo?.id &&
              chat.role === 'assistant' &&
              index > 1 && (
                <>
                  <ColumDivider />
                  <RowWrapBox
                    cssExt={css`
                      padding: 9px 12px 12px 12px;
                      box-sizing: border-box;
                    `}>
                    <RowBox>
                      <LengthWrapper>
                        {t(`WriteTab.LengthInfo`, { length: chat.result.length })}
                      </LengthWrapper>
                      {/* {chat.id !== loadingResId && (
                      <CopyIcon
                        onClick={() => {
                          //TODO: 복사 로직

                          dispatch(
                            activeToast({
                              active: true,
                              msg: t(`ToastMsg.CompleteCopy`),
                              isError: false
                            })
                          );
                        }}
                      />
                    )} */}
                    </RowBox>

                    {chat.id !== loadingInfo?.id && (
                      <RowWrapBox
                        cssExt={css`
                          margin-top: 8px;
                          gap: 4px 8px;
                        `}>
                        {retryOrigin !== chat.id && (
                          <Button
                            cssExt={css`
                              min-width: 135px;
                              /* margin: 0px; */
                            `}
                            isCredit={true}
                            onClick={() => {
                              submitChat(chat);
                              setRetryOrigin(chat.id);
                            }}>
                            {t(`WriteTab.Recreating`)}
                          </Button>
                        )}
                        <Button
                          cssExt={css`
                            ${purpleBtnCss}
                            min-width: 135px;
                            /* margin: 0px; */
                          `}
                          onClick={() => {
                            insertDoc(chat.result);
                            dispatch(
                              activeToast({
                                active: true,
                                msg: t(`ToastMsg.CompleteInsert`),
                                isError: false
                              })
                            );
                          }}>
                          {t(`WriteTab.InsertDoc`)}
                        </Button>
                      </RowWrapBox>
                    )}
                  </RowWrapBox>
                </>
              )
            }>
            {chat.role !== 'user' && index !== 0 && loadingInfo?.id !== chat.id && (
              <RightBox>
                <OpenAILinkText />
              </RightBox>
            )}
          </SpeechBubble>
        ))}
        <div ref={chatEndRef}></div>
      </ChatListWrapper>
      {loadingInfo && (
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
          {isActiveInput && !loadingInfo ? (
            <FuncRecBox isFormRec={!isDefaultInput && chatHistory.length <= 1} />
          ) : (
            !loadingInfo &&
            chatInput.length === 0 && (
              <Info>
                <Icon
                  iconSrc={icon_ai}
                  cssExt={css`
                    width: 16px;
                    height: 20px;
                    margin: 0 8px 0 0px;
                  `}
                />
                {t(`ChatingTab.TipList.${chatTip}`)}
              </Info>
            )
          )}
        </FloatingBox>

        <InputBox
          activeInputWrap={isActiveInput && !loadingInfo}
          style={{ position: 'relative', display: 'flex' }}>
          <RowBox
            onClick={() => {
              toggleActiveInput(true);
            }}>
            <TextArea
              disable={loadingInfo !== null}
              placeholder={!loadingInfo ? placeholder || '' : ''}
              textRef={textRef}
              rows={1}
              cssExt={css`
                width: fit-content;
                ${flexGrow}
                border: 0;
                max-height: ${TEXT_MAX_HEIGHT}px;
                height: 48px;
                ${justiCenter}
                padding: 14px 16px 14px 16px;
                box-sizing: border-box;

                &:disabled {
                  background-color: #fff;
                }
              `}
              value={chatInput}
              onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  if (validInput()) {
                    setIsActiveInput(false);

                    submitChat();
                  } else {
                    e.preventDefault();
                  }
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setChatInput(e.target.value.slice(0, INPUT_MAX_LENGTH));
                handleResizeHeight();

                if (isDefaultInput && e.target.value.length === 0) setIsDefaultInput(false);
              }}
              onBlur={() => {
                if (chatInput.length > 0) dispatch(updateDefaultInput(chatInput));
              }}
            />
            {!loadingInfo && isActiveInput && (
              <SubmitButton
                disabled={
                  (chatHistory.length === 1 && chatInput.length === 0) ||
                  (chatHistory.length > 1 && chatInput.length === 0 && selectedRecFunction === null)
                }
                onClick={() => {
                  if (validInput()) {
                    setIsActiveInput(false);

                    submitChat();
                  }
                }}
                style={{ display: 'flex', position: 'relative', cursor: 'pointer' }}>
                <Icon iconSrc={icon_sand} />
                <Icon
                  iconSrc={icon_credit}
                  cssExt={css`
                    ${flex}
                    position: absolute;
                    bottom: 7px;
                    right: 4px;
                  `}
                />
              </SubmitButton>
            )}
          </RowBox>
          {!loadingInfo && isActiveInput && (
            <RowWrapBox
              cssExt={css`
                height: 34px;
                padding: 0px 3px 0px 9px;
                box-sizing: border-box;
                border-top: 1px solid var(--ai-purple-97-list-over);
                ${alignItemCenter}
              `}>
              <LengthWrapper isError={chatInput.length >= INPUT_MAX_LENGTH}>
                {chatInput.length}/{INPUT_MAX_LENGTH}
              </LengthWrapper>
              <ExButton
                disable={chatInput.length > 0}
                exampleList={exampleList}
                setExam={setChatInput}
              />
            </RowWrapBox>
          )}
        </InputBox>
      </div>
    </Wrapper>
  );
};

export default AIChatTab;
