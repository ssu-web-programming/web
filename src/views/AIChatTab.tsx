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
  updateChat
} from '../store/slices/chatHistorySlice';
import { v4 as uuidv4 } from 'uuid';
import Button from '../components/Button';
import OpenAILinkText from '../components/OpenAILinkText';
import ExButton from '../components/ExButton';
import FuncRecBox, { RowWrapBox, recSubList } from '../components/AIChat/FuncRecBox';
import {
  activeRecFunc,
  inactiveRecFunc,
  initRecFunc,
  selectRecFuncSlice
} from '../store/slices/recFuncSlice';
import { activeToast } from '../store/slices/toastSlice';

const INPUT_HEIGHT = 120;
const TEXT_MAX_HEIGHT = 168;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  position: relative;
  table {
    border-collapse: collapse;
    border-radius: 6px;
  }

  th,
  td {
    padding: 1em;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }

  table,
  tr,
  td,
  th {
    border-radius: 6px;
    border: 1px solid #555;
  }

  textarea:focus {
    outline: none;
  }

  input:focus {
    outline: none;
  }
`;

const ChatListWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 20px;
  overflow: auto;
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

  &:hover {
    border-color: blue;
  }
`;

export const RowBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const LengthWrapper = styled.div`
  display: flex;
  color: lightgray;
`;

const FitButton = styled.button`
  width: fit-content;
  height: fit-content;
  padding: 10px;
`;

const RightBox = styled.div`
  display: flex;
  align-self: flex-end;
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
  const chatHistory = useAppSelector(selectChatHistory);
  const { selectedRecFunction, selectedSubRecFunction, isActive } =
    useAppSelector(selectRecFuncSlice);

  const [chatInput, setChatInput] = useState<string>('');
  const [activeInput, setActiveInput] = useState<boolean>(false);
  const [loadingResId, setLoadingResId] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState<string>('');
  const [retryRes, setRetryRes] = useState<string | null>(null);

  const chatEndRef = useRef<any>();
  const stopRef = useRef<boolean>(false);

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (chatHistory.length === 0) {
      dispatch(
        initChatHistory({
          id: uuidv4(),
          role: 'assistant',
          content: 'what do you want?',
          input: ''
        })
      );
    }
  }, []);

  const handleResizeHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = textRef.current.scrollHeight + 'px';
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const recFuncToDesc = (input: string) => {
    // TODO: 예외처리 세분화 필요

    if (chatHistory.length >= 2 && !selectedRecFunction && chatInput.length === 0) {
      // error
      return false;
    }

    if (chatHistory.length <= 1 && selectedRecFunction) {
      return (input += '\n 결과는' + selectedRecFunction.title + '형식으로 알려줘');
    }

    if (chatHistory.length >= 2 && !selectedRecFunction) return input;

    if (chatHistory.length >= 2 && selectedRecFunction) {
      if (
        recSubList.filter((sub) => sub.id === selectedRecFunction.id).length > 0 &&
        selectedSubRecFunction &&
        chatInput.length > 0
      )
        input +=
          '\n 위의 문장을 ' + selectedSubRecFunction?.title + '으로 ' + selectedRecFunction.title;
      else if (recSubList.filter((sub) => sub.id === selectedRecFunction.id).length === 0)
        return input;
      else return false;
    }

    return input;
  };

  const submitChat = async (targetQuestion?: string, targetRes?: Chat, isRetry?: boolean) => {
    let input: string | boolean = targetQuestion ? targetQuestion : chatInput;

    if (isRetry && targetRes) setRetryRes(targetRes.id);
    else if (isActive) {
      input = recFuncToDesc(input);
      if (!input) {
        // 오류 발생
        dispatch(activeToast({ active: true, msg: '추천 기능 선택 및 내용을 입력해주세요' }));
        return;
      }
    }

    const assistantId = uuidv4();
    setChatInput('');
    setActiveInput(false);
    setLoadingMsg(selectLoadingMsg(false));

    if (!isRetry)
      dispatch(appendChat({ id: uuidv4(), role: 'user', content: chatInput, input: input }));
    dispatch(appendChat({ id: assistantId, role: 'assistant', content: '', input: input }));

    setLoadingResId(assistantId);

    const res = await fetch('https://kittyhawk.polarisoffice.com/api/v2/chat/chatStream', {
      headers: { 'content-type': 'application/json' },
      //   responseType: 'stream',
      body: JSON.stringify({
        history: [
          {
            content: 'hello',
            role: 'system'
          },
          ...chatHistory.map((chat) => ({ content: chat.content, role: chat.role })),
          {
            content: input,
            role: 'user'
          }
        ]
      }),
      method: 'POST'
    });
    const reader = res.body?.getReader();
    var enc = new TextDecoder('utf-8');

    while (reader) {
      // if (isFull) break;
      if (stopRef.current) break;

      const { value, done } = await reader.read();
      if (done) {
        // setProcessState(PROCESS_STATE.COMPLETE_GENERATE);
        break;
      }

      const decodeStr = enc.decode(value);
      dispatch(
        updateChat({ id: assistantId, role: 'assistant', content: decodeStr, input: input })
      );
    }

    setLoadingResId(null);
    stopRef.current = false;
    setLoadingMsg('');
    dispatch(initRecFunc());

    if (isRetry && targetRes) setRetryRes(null);
  };

  const textRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (activeInput && textRef?.current) {
      textRef.current.focus();
    }
  }, [activeInput]);

  const selectLoadingMsg = (isRetry: boolean) => {
    if (isRetry) return '내용을 다시 만드는 중입니다...';

    if (!selectedRecFunction || chatHistory.length <= 1) {
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

  const toggleActiveInput = (isActive: boolean) => {
    setActiveInput(isActive);
    dispatch(isActive ? activeRecFunc() : inactiveRecFunc());
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
            loadingMsg={loadingMsg}
            key={chat.id}
            text={chat.content}
            isUser={chat.role === 'user'}
            outterChild={
              chat.id !== loadingResId &&
              chat.role === 'assistant' &&
              index > 1 && (
                <>
                  <RowBox>
                    <div>공백 포함 {chat.content.length}자</div>
                    {chat.id === loadingResId ? <div>로딩중</div> : <div>복사</div>}
                  </RowBox>
                  <RowBox>
                    {retryRes !== chat.id && (
                      <FitButton
                        onClick={() => {
                          submitChat(chat.input, chat, true);
                          setLoadingMsg(selectLoadingMsg(true));
                        }}>
                        다시 만들기
                      </FitButton>
                    )}
                    <FitButton
                      onClick={() => {
                        // TODO: 문서 삽입 로직
                      }}>
                      문서에 삽입하기
                    </FitButton>
                  </RowBox>
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
        <Button
          onClick={() => {
            stopRef.current = true;
          }}>
          STOP
        </Button>
      )}
      <InputWrapper activeInputWrap={activeInput}>
        <ActiveInputBox>
          {activeInput && !loadingResId ? (
            <FuncRecBox chatLength={chatHistory.length} />
          ) : (
            !loadingResId && <div>대화 1회 당 N크레딧이 차감됩니다.</div>
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
                  justify-content: center;
                `}
                value={chatInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleResizeHeight();
                  setChatInput(e.target.value);
                }}
              />
              {!loadingResId && activeInput && (
                <Button
                  onClick={() => {
                    submitChat();
                  }}>
                  전송
                </Button>
              )}
            </RowBox>
            {!loadingResId && activeInput && (
              <RowWrapBox>
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

// <ColumBox>
//   {!loadingResId && <div>대화 1회 당 N크레딧이 차감됩니다.</div>}
//   <InactiveInput
//     onClick={() => {
//       if (!loadingResId) setActiveInput(true);
//     }}>
//     {!loadingResId && '무엇이든 질문해주세요'}
//   </InactiveInput>
// </ColumBox>

// activeInput || chatInput.length > 0 &&

export default AIChatTab;
