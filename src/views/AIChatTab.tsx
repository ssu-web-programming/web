import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import SpeechBubble from '../components/SpeechBubble';
import TextArea from '../components/TextArea';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  Chat,
  appendChat,
  initChatHistory,
  selectChatHistory,
  updateChat,
  updateDefaultInput
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
import { TableCss, purpleBtnCss } from '../style/cssCommon';
import { setLoadingTab } from '../store/slices/tabSlice';
import { CHAT_STREAM_API, JSON_CONTENT_TYPE } from '../api/constant';
import { insertDoc } from '../util/common';
import icon_sand from '../img/ico_send.svg';
import { selectLoginSessionSlice } from '../store/slices/loginSession';
import icon_credit from '../img/ico_credit.svg';

const INPUT_HEIGHT = 120;
const TEXT_MAX_HEIGHT = 168;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: var(--ai-purple-99-bg-light);

  position: relative;
  ${TableCss}
`;

const ChatListWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 20px;
`;

const InputWrapper = styled.div<{ activeInputWrap: boolean }>`
  display: flex;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;

  /* height: ${({ activeInputWrap }: { activeInputWrap: boolean }) =>
    activeInputWrap ? INPUT_HEIGHT + 'px' : ''}; */
  margin-top: ${({ activeInputWrap }: { activeInputWrap: boolean }) =>
    activeInputWrap ? 100 : 50}px;
`;

const ActiveInputBox = styled.div`
  position: absolute;
  bottom: 0px;
  /* padding: 5px; */
  width: 100%;
  box-sizing: border-box;
  flex: 1;

  left: 50%;
  transform: translate(-50%);
  background-color: white;
  box-sizing: border-box;

  &:hover {
    border-color: blue;
  }
`;

const ActiveInput = styled.div`
  box-sizing: border-box;
  padding: 5px;
  /* min-height: 30px; */
  align-items: center;
  box-shadow: 0 -2px 8px 0 rgba(111, 58, 208, 0.11);
`;

export const RowBox = styled.div<{ cssExt?: any }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  ${({ cssExt }) => cssExt && cssExt}
`;

export const LengthWrapper = styled.div`
  display: flex;
  font-size: 12px;
  color: var(--gray-gray-70);
`;

export const RightBox = styled.div`
  display: flex;
  align-self: flex-end;
  margin: 4px;
  align-items: center;
`;

const Info = styled.div`
  display: flex;
  background-color: transparrent;
  color: var(--ai-purple-50-main);
  padding: 14px 16px 14px 16px;
  background-color: var(--ai-purple-99-bg-light);
  font-size: 12px;

  align-items: center;
`;

const CenterBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

export const ColumDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--ai-purple-97-list-over);
  margin-top: 8px;
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

const inputMaxLength = 1000;

const AIChatTab = () => {
  const dispatch = useAppDispatch();
  const { history: chatHistory, defaultInput } = useAppSelector(selectChatHistory);
  const { selectedRecFunction, selectedSubRecFunction } = useAppSelector(selectRecFuncSlice);

  const [chatInput, setChatInput] = useState<string>('');
  const [isActiveInput, setIsActiveInput] = useState<boolean>(false);
  const [loadingResId, setLoadingResId] = useState<string | null>(null);
  const [retryRes, setRetryRes] = useState<string | null>(null);
  const chatEndRef = useRef<any>();
  const stopRef = useRef<boolean>(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const { AID, BID, SID } = useAppSelector(selectLoginSessionSlice);

  const toggleActiveInput = (isActive: boolean) => {
    setIsActiveInput(isActive);
    dispatch(isActive ? activeRecFunc() : inactiveRecFunc());
  };

  useEffect(() => {
    if (defaultInput && defaultInput.length > 0 && !loadingResId) {
      // setActiveInput(true);
      setChatInput(defaultInput);
      dispatch(updateDefaultInput(null));
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

      if (!chat && chatInput.length > 1) {
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

      dispatch(
        activeToast({
          active: true,
          msg: '내용을 생성합니다. 10 크레딧이 차감되었습니다. (잔여 크레딧 :980)',
          isError: false
        })
      );

      const res = await fetch(CHAT_STREAM_API, {
        headers: {
          ...JSON_CONTENT_TYPE,
          'X-PO-AI-MayFlower-Auth-SID': SID,
          'X-PO-AI-MayFlower-Auth-BID': BID,
          'X-PO-AI-MayFlower-Auth-AID': AID
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

      if (res.status !== 200) throw new Error('not 200 error');

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

      if (!stopRef.current)
        dispatch(
          activeToast({
            active: true,
            msg: `작성 완료. 원하는 작업을 실행하세요.`,
            isError: false
          })
        );
    } catch (error) {
      dispatch(
        activeToast({
          active: true,
          msg: `폴라리스 오피스 AI의 생성이 잘 되지 않았습니다.다시 시도해보세요.`,
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
            {chat.role !== 'user' && index !== 0 && !loadingResId && (
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
      <InputWrapper className="inputwrapper" activeInputWrap={isActiveInput && !loadingResId}>
        <ActiveInputBox>
          {isActiveInput && !loadingResId ? (
            <FuncRecBox chatLength={chatHistory.length} />
          ) : (
            !loadingResId && (
              <Info>
                <Icon
                  iconSrc={icon_ai}
                  cssExt={css`
                    width: 16px;
                    height: 20px;
                    margin: 0 8px 0 0px;
                  `}
                />
                대화 1회 당 크레딧이 차감됩니다.
              </Info>
            )
          )}
          <ActiveInput>
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
                  width: 80%;
                  border: 0;
                  max-height: ${TEXT_MAX_HEIGHT}px;
                  height: fit-content;
                  justify-content: center;
                  height: 20px;
                  padding: 8px 0px 0px 8px;
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
                  setChatInput(e.target.value.slice(0, inputMaxLength));
                }}
              />
              {!loadingResId && isActiveInput && (
                <div
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
                  <Icon
                    iconSrc={icon_sand}
                    cssExt={css`
                      padding: 5px;
                      width: 40px;
                      height: 32px;
                      box-sizing: border-box;
                      background-image: linear-gradient(to left, #a86cea, #6f3ad0 100%);
                      border-radius: 4px;
                      margin-bottom: 3px;
                    `}
                  />
                  <Icon
                    iconSrc={icon_credit}
                    cssExt={css`
                      display: flex;
                      position: absolute;
                      bottom: 7px;
                      right: 4px;
                    `}
                  />
                </div>
              )}
            </RowBox>
            {!loadingResId && isActiveInput && (
              <RowWrapBox
                cssExt={css`
                  padding: 8px 3px 8px 11px;
                  box-sizing: border-box;
                  border-top: 1px solid var(--ai-purple-97-list-over);
                `}>
                <LengthWrapper>
                  {chatInput.length}/{inputMaxLength}
                </LengthWrapper>
                {chatInput.length === 0 && (
                  <ExButton exampleList={exampleList} setExam={setChatInput} />
                )}
              </RowWrapBox>
            )}
          </ActiveInput>
        </ActiveInputBox>
      </InputWrapper>
    </Wrapper>
  );
};

export default AIChatTab;
