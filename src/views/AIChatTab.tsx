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
import FuncRecBox, { RowWrapBox } from '../img/aiChat/FuncRecBox';
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
  alignItemEnd
} from '../style/cssCommon';
import { setLoadingTab } from '../store/slices/tabSlice';
import { CHAT_STREAM_API, JSON_CONTENT_TYPE } from '../api/constant';
import { insertDoc } from '../util/common';
import icon_sand from '../img/ico_send.svg';
import { setBridgeMessage } from '../store/slices/bridge';
import apiWrapper from '../api/apiWrapper';
import icon_credit from '../img/ico_credit.svg';

const INPUT_HEIGHT = 120;
const TEXT_MAX_HEIGHT = 168;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${flexColumn}
  ${justiSpaceBetween}
  box-sizing: border-box;
  background-color: var(--ai-purple-99-bg-light);

  ${TableCss}
`;

const ChatListWrapper = styled.div<{ activeInputWrap: boolean }>`
  ${flexColumn}
  /* ${flexColumn}
  ${flexGrow} */
  position: relative;

  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 30px;
  overflow-x: hidden;
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
  padding: ${({ activeInputWrap }: { activeInputWrap: boolean }) =>
    activeInputWrap ? '5px 5px 0px 5px' : '5px'};
  /* min-height: 30px; */
  align-items: center;

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

export const LengthWrapper = styled.div<{ isError?: boolean }>`
  ${alignItemCenter}

  font-size: 12px;
  color: var(--gray-gray-70);

  ${({ isError }) =>
    isError !== undefined &&
    css`
      color: ${isError ? 'var(--sale)' : 'var(--gray-gray-70)'};
    `}
`;

export const RightBox = styled.div`
  ${alignItemCenter}

  align-self: flex-end;
  margin: 4px;
`;

const Info = styled.div`
  background-color: var(--ai-purple-99-bg-light);
  color: var(--ai-purple-50-main);
  padding: 14px 16px 14px 16px;
  font-size: 12px;

  ${alignItemCenter}
`;

const CenterBox = styled.div`
  width: 100%;
  ${justiCenter}
`;

export const ColumDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--ai-purple-97-list-over);
  margin-top: 8px;
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
  margin-bottom: 3px;
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

const exampleList = [
  '건강한 생활습관을 위한 효과적인 5가지 방법',
  '배달 서비스 마케팅 아이디어를 브레인스토밍하고 각 아이디어가 지닌 장점 설명',
  '비 오는 바다 주제의 소설 시놉시스',
  '중고 의류 쇼핑몰 CEO 인터뷰 질문 목록 10가지',
  '부모님 생일 선물을 추천해줘',
  '문서 작성을 효율적으로 하는 방법',
  'AI 기술 발전에 대한 자료조사 시, 조사할 내용을 정리해줘.',
  '맛있는 알리오 올리오 파스타 요리 레시피',
  '신사업 비즈니스 계획서 목차 작성하기',
  '회의 결과 보고 메일 작성 방법 '
];

const chatTipList = [
  '대화 1회당 N 크레딧이 차감됩니다.',
  'Ctrl + Enter로 줄을 바꾸세요',
  'Enter를 눌러 대화를 할 수 있습니다.',
  '구체적인 질문으로 더 좋은 답변을 받아보세요.',
  '2021년 9월 이후의 사건은 부정확할 수 있습니다.'
];

const AIChatTab = () => {
  const dispatch = useAppDispatch();
  const { history: chatHistory, defaultInput } = useAppSelector(selectChatHistory);
  const { selectedRecFunction, selectedSubRecFunction } = useAppSelector(selectRecFuncSlice);

  const [chatInput, setChatInput] = useState<string>('');
  const [isActiveInput, setIsActiveInput] = useState<boolean>(false);
  const [loadingResId, setLoadingResId] = useState<string | null>(null);
  const [retryRes, setRetryRes] = useState<string | null>(null);
  const [chatTip, setChatTip] = useState<string>(
    chatTipList[Math.floor(Math.random() * chatTipList.length)]
  );
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
      if (!loadingResId && chatInput.length === 0)
        setChatTip(chatTipList[Math.floor(Math.random() * chatTipList.length)]);
    }, 5000);

    if (isActiveInput) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isActiveInput]);

  useEffect(() => {
    if (defaultInput && defaultInput.length > 0 && !loadingResId) {
      // setActiveInput(true);
      setChatInput(defaultInput);
      dispatch(resetDefaultInput());
      textRef?.current?.focus();
      toggleActiveInput(true);
    }
  }, [defaultInput]);

  useEffect(() => {
    handleResizeHeight();
  }, [chatInput]);

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isActiveInput, loadingResId]);

  useEffect(() => {
    if (chatHistory.length === 0) {
      dispatch(
        initChatHistory({
          id: uuidv4(),
          role: 'assistant',
          result: '안녕하세요. 쉽고, 빠르게 문서 작성을 도와주는 폴라리스오피스 AI Chat 입니다.',
          input: ''
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResizeHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = textRef.current.scrollHeight + 'px';
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
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
      return { type: 'create_text', arg1: selectedRecFunction?.id };
    } else if (selectedRecFunction) {
      return { type: selectedRecFunction.id, arg1: selectedSubRecFunction?.id };
    } else return undefined;
  };

  const submitChat = async (chat?: Chat) => {
    try {
      dispatch(setLoadingTab(true));

      let input = chat
        ? chat.input
        : chatInput.length > 0
        ? chatInput
        : chatHistory[chatHistory.length - 1].result;

      const assistantId = uuidv4();

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

      setLoadingResId(assistantId);

      // dispatch(
      //   activeToast({
      //     active: true,
      //     msg: '내용을 생성합니다. 10 크레딧이 차감되었습니다. (잔여 크레딧 :980)',
      //     isError: false
      //   })
      // );

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
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      dispatch(
        activeToast({
          active: true,
          msg: `내용을 생성합니다. ${res.headers.get(
            'X-PO-AI-Mayflower-Userinfo-Usedcredit'.toLowerCase()
          )} 크레딧이 차감되었습니다. (잔여 크레딧 : ${res.headers.get(
            'X-PO-AI-Mayflower-Userinfo-Credit'.toLowerCase()
          )})`,
          isError: false
        })
      );

      const reader = res.body?.getReader();
      var enc = new TextDecoder('utf-8');

      while (reader) {
        // if (isFull) break;
        if (stopRef.current) {
          dispatch(
            activeToast({
              active: true,
              msg: `작성 중지. 원하는 작업을 실행하세요.`,
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

      // if (!stopRef.current)
      //   dispatch(
      //     activeToast({
      //       active: true,
      //       msg: `작성 완료. 원하는 작업을 실행하세요.`,
      //       isError: false
      //     })
      //   );
    } catch (error: any) {
      dispatch(
        activeToast({
          active: true,
          msg: error.message,
          // msg: `폴라리스 오피스 AI의 생성이 잘 되지 않았습니다.다시 시도해보세요.`,
          isError: true
        })
      );
    } finally {
      setLoadingResId(null);
      stopRef.current = false;
      dispatch(initRecFunc());
      dispatch(setLoadingTab(false));
      toggleActiveInput(false);

      if (chat) setRetryRes(null);
    }
  };

  useEffect(() => {
    if (isActiveInput && textRef?.current) {
      textRef.current.focus();
    }
  }, [isActiveInput]);

  const selectLoadingMsg = (isRetry: boolean) => {
    if (isRetry) return '내용을 다시 만드는 중입니다...';

    if (!selectedRecFunction || chatHistory.length <= 3) {
      return '내용을 생성 중입니다...';
    }

    if (selectedRecFunction) {
      let msg = '';

      if (selectedSubRecFunction)
        msg += '작성 내용을 반영하여 ' + selectedSubRecFunction.title + '으로 ';
      msg += selectedRecFunction.title + '를 시작합니다...';

      return msg;
    }

    return '';
  };

  return (
    <Wrapper>
      <ChatListWrapper
        style={{ position: 'relative' }}
        activeInputWrap={isActiveInput && !loadingResId}
        onClick={(e) => {
          toggleActiveInput(false);
          // dispatch(closeRecFunc());
        }}>
        {chatHistory.map((chat, index) => (
          <SpeechBubble
            loadingMsg={loadingResId === chat.id ? selectLoadingMsg(false) : undefined}
            key={chat.id}
            text={chat.role === 'assistant' ? chat.result : chat.input}
            isUser={chat.role === 'user'}
            outterChild={
              chat.id !== loadingResId &&
              chat.role === 'assistant' &&
              index > 1 && (
                <>
                  <ColumDivider />
                  <RowBox
                    cssExt={css`
                      margin: 8px 0px 8px 0px;
                    `}>
                    <LengthWrapper>공백 포함 {chat.result.length}자</LengthWrapper>
                    {chat.id !== loadingResId && (
                      <CopyIcon
                        onClick={() => {
                          //TODO: 복사 로직

                          dispatch(
                            activeToast({
                              active: true,
                              msg: `내용 복사가 완료되었습니다.`,
                              isError: false
                            })
                          );
                        }}
                      />
                    )}
                  </RowBox>
                  <RowWrapBox>
                    {retryRes !== chat.id && (
                      <Button
                        cssExt={css`
                          min-width: 124px;
                        `}
                        isCredit={true}
                        onClick={() => {
                          submitChat(chat);
                        }}>
                        다시 만들기
                      </Button>
                    )}
                    <Button
                      cssExt={css`
                        ${purpleBtnCss}
                        min-width: 124px;
                      `}
                      onClick={() => {
                        insertDoc(chat.result);
                        dispatch(
                          activeToast({
                            active: true,
                            msg: `내용 삽입이 완료되었습니다.`,
                            isError: false
                          })
                        );
                      }}>
                      문서에 삽입하기
                    </Button>
                  </RowWrapBox>
                </>
              )
            }>
            {chat.role !== 'user' && index !== 0 && loadingResId !== chat.id && (
              <RightBox>
                <OpenAILinkText />
              </RightBox>
            )}
          </SpeechBubble>
        ))}
        <div ref={chatEndRef}></div>
      </ChatListWrapper>
      {loadingResId && (
        <CenterBox>
          {/* <StopButton
            onClick={() => {
              stopRef.current = true;
            }}
          /> */}
        </CenterBox>
      )}
      <div style={{ position: 'relative', display: 'flex' }}>
        <FloatingBox>
          {isActiveInput && !loadingResId ? (
            <FuncRecBox chatLength={chatHistory.length} />
          ) : (
            !loadingResId &&
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
                {chatTip}
              </Info>
            )
          )}
        </FloatingBox>

        <InputBox
          activeInputWrap={isActiveInput && !loadingResId}
          style={{ position: 'relative', display: 'flex' }}>
          <RowBox
            onClick={() => {
              toggleActiveInput(true);
            }}>
            <TextArea
              disable={loadingResId !== null}
              placeholder={!loadingResId ? '무엇이든 질문해주세요' : ''}
              textRef={textRef}
              rows={1}
              cssExt={css`
                width: fit-content;
                ${flexGrow}
                border: 0;
                max-height: ${TEXT_MAX_HEIGHT}px;
                height: fit-content;
                justify-content: center;
                margin: 6px 16px 6px 8px;

                &:disabled {
                  background-color: #fff;
                }
              `}
              value={chatInput}
              onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  if (validInput()) {
                    setChatInput('');
                    setIsActiveInput(false);

                    submitChat();
                  } else {
                    dispatch(
                      activeToast({
                        active: true,
                        msg: '추천 기능 선택 및 내용을 입력해주세요',
                        isError: true
                      })
                    );
                    e.preventDefault();
                  }
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setChatInput(e.target.value.slice(0, INPUT_MAX_LENGTH));
              }}
            />
            {!loadingResId && isActiveInput && (
              <SubmitButton
                disabled={
                  (chatHistory.length === 1 && chatInput.length === 0) ||
                  (chatHistory.length > 1 && chatInput.length === 0 && selectedRecFunction === null)
                }
                onClick={() => {
                  // TODO: 전송 가능 여부 체크
                  if (validInput()) {
                    setChatInput('');
                    setIsActiveInput(false);

                    submitChat();
                  } else {
                    dispatch(
                      activeToast({
                        active: true,
                        msg: '추천 기능 선택 및 내용을 입력해주세요',
                        isError: true
                      })
                    );
                  }
                }}
                style={{ display: 'flex', position: 'relative', cursor: 'pointer' }}>
                <Icon iconSrc={icon_sand} />
                <Icon
                  iconSrc={icon_credit}
                  cssExt={css`
                    display: flex;
                    position: absolute;
                    bottom: 7px;
                    right: 4px;
                  `}
                />
              </SubmitButton>
            )}
          </RowBox>
          {!loadingResId && isActiveInput && (
            <RowWrapBox
              cssExt={css`
                height: 34px;
                padding: 8px 3px 8px 11px;
                box-sizing: border-box;
                border-top: 1px solid var(--ai-purple-97-list-over);
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
