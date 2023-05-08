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
import FuncRecBox, { RowWrapBox, recSubList } from '../components/AIChat/FuncRecBox';
import {
  activeRecFunc,
  inactiveRecFunc,
  initRecFunc,
  selectRecFuncSlice
} from '../store/slices/recFuncSlice';
import { activeToast } from '../store/slices/toastSlice';
import icon_ai from '../img/ico_ai.svg';
import Icon from '../components/Icon';
import icon_stop from '../img/ico_stop.svg';
import icon_copy from '../img/ico_copy.svg';
import { load } from 'cheerio';
import { marked } from 'marked';

const INPUT_HEIGHT = 120;
const TEXT_MAX_HEIGHT = 168;

export const TableCss = css`
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
  font-family: NotoSansCJKSC;
  font-size: 12px;
  color: var(--gray-gray-70);
  margin: 11px;
`;

const FitButton = styled.button`
  width: fit-content;
  height: fit-content;
  padding: 10px;
`;

export const RightBox = styled.div`
  display: flex;
  align-self: flex-end;
  margin: 4px;
`;

const Info = styled.div`
  display: flex;
  background-color: transparrent;
  color: var(--ai-purple-50-main);
  padding: 14px 16px 14px 16px;
  background-color: var(--ai-purple-99-bg-light);
  font-family: NotoSansCJKKR;
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
  margin-bottom: 8px;
`;

const purpleBtnCss = css`
  background-image: linear-gradient(to left, #a86cea 100%, var(--ai-purple-50-main) 0%);
  color: #fff;
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

const html = `
<html>
<head>
<style>
table{
  border-collapse: collapse ;
  border-radius: 6px;
}

th ,
td{
  padding: 1em;
  padding-top: .5em;
  padding-bottom: .5em;
}

table,
tr,
td,
th 
{
  border-radius: 6px;
  border: 1px solid #555;
}
</style>
</head>
<body>
<!--StartFragment-->

<!--EndFragment-->
</body>
</html>`;

const AIChatTab = () => {
  const dispatch = useAppDispatch();
  const { history: chatHistory, defaultInput } = useAppSelector(selectChatHistory);
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
    if (defaultInput && defaultInput.length > 0) {
      setActiveInput(true);
      setChatInput(defaultInput);
      dispatch(updateDefaultInput(null));
    }
  }, []);

  useEffect(() => {
    handleResizeHeight();
  }, [chatInput]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResizeHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = textRef.current.scrollHeight + 'px';
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const checkInput = () => {
    const hasSubRec =
      recSubList.filter((sub) => selectedRecFunction && selectedRecFunction.id === sub.id).length >
      0;

    if (
      (chatHistory.length === 1 && chatInput.length === 0) ||
      (chatHistory.length >= 2 && chatInput.length === 0 && !selectedRecFunction) ||
      (chatHistory.length >= 2 && chatInput.length === 0 && hasSubRec) ||
      (hasSubRec && !selectedSubRecFunction)
    ) {
      dispatch(activeToast({ active: true, msg: '추천 기능 선택 및 내용을 입력해주세요' }));
      return false;
    }

    return true;
  };

  const makeQuestion = (input: string) => {
    const hasSubRec =
      recSubList.filter((sub) => selectedRecFunction && selectedRecFunction.id === sub.id).length >
      0;

    if (chatHistory.length === 1 && selectedRecFunction) {
      input += `\n 결과는 ${selectedRecFunction.title} 형식으로 알려줘`;
    } else if (hasSubRec && selectedRecFunction) {
      input += `\n 위의 문장을 ${selectedSubRecFunction?.title}으로 ${selectedRecFunction.title}`;
    } else if (!hasSubRec && selectedRecFunction) {
      input = `\n 위 내용에 대해서 ${selectedRecFunction.title}`;
    }

    return input;
  };

  const submitChat = async (chat?: Chat) => {
    let input = '';

    if (chat) {
      input = chat.input;
      setRetryRes(chat.id);
    } else {
      input = makeQuestion(chatInput ? chatInput : chatHistory[chatHistory.length - 1].content);
    }

    const assistantId = uuidv4();

    handleResizeHeight();
    if (textRef.current) textRef.current.style.height = 'auto';

    if (!chat)
      dispatch(appendChat({ id: uuidv4(), role: 'user', content: chatInput, input: input }));
    dispatch(appendChat({ id: assistantId, role: 'assistant', content: '', input: input }));

    setLoadingResId(assistantId);

    const res = await fetch('/api/v2/chat/chatStream', {
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

    if (chat) setRetryRes(null);
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

  const insertDoc = async (content: string) => {
    try {
      const tt = await marked(content);
      const $ = load(html);
      const body = $('body');

      body.html(tt);

      await window._Bridge.insertHtml($.html());
    } catch (error) {}
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
            loadingMsg={loadingResId === chat.id ? loadingMsg : undefined}
            key={chat.id}
            text={chat.content}
            isUser={chat.role === 'user'}
            outterChild={
              chat.id !== loadingResId &&
              chat.role === 'assistant' &&
              index > 1 && (
                <>
                  <ColumDivider />
                  <RowBox>
                    <LengthWrapper>공백 포함 {chat.content.length}자</LengthWrapper>
                    {chat.id !== loadingResId && <Icon iconSrc={icon_copy} onClick={() => {}} />}
                  </RowBox>
                  <RowBox
                    cssExt={css`
                      margin-top: 12px;
                      justify-content: space-around;
                    `}>
                    {retryRes !== chat.id && (
                      <Button
                        isCredit={true}
                        onClick={() => {
                          setLoadingMsg(selectLoadingMsg(true));
                          submitChat(chat);
                        }}>
                        다시 만들기
                      </Button>
                    )}
                    <Button
                      cssExt={purpleBtnCss}
                      onClick={() => {
                        insertDoc(chat.content);
                      }}>
                      문서에 삽입하기
                    </Button>
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
        <CenterBox>
          <Button
            cssExt={css`
              width: 73px;
              height: 28px;
              padding: 4px 12px 5px;
              border-radius: 4px;
              border: solid 1px var(--gray-gray-50);
              background-color: #fff;
              display: flex;
              width: fit-content;
              font-family: NotoSansCJKKR;
              font-size: 13px;
              color: #2f3133;
              flex: none;
            `}
            onClick={() => {
              stopRef.current = true;
            }}>
            <>
              <Icon
                iconSrc={icon_stop}
                cssExt={css`
                  width: 16px;
                  height: 16px;
                  margin: 4px;
                `}
              />
              Stop
            </>
          </Button>
        </CenterBox>
      )}
      <InputWrapper className="inputwrapper" activeInputWrap={activeInput && !loadingResId}>
        <ActiveInputBox>
          {activeInput && !loadingResId ? (
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
                대화 1회 당 N크레딧이 차감됩니다.
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
                  ::placeholder {
                    font-family: NotoSansCJKKR;
                    font-size: 13px;
                    color: var(--gray-gray-60-03);
                    /* padding: 8px; */
                  }
                  &:disabled {
                    background-color: #fff;
                  }
                `}
                value={chatInput}
                onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    if (checkInput()) {
                      setChatInput('');
                      setActiveInput(false);
                      setLoadingMsg(selectLoadingMsg(false));

                      submitChat();
                    }
                  }
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setChatInput(e.target.value.slice(0, inputMaxLength));
                }}
              />
              {!loadingResId && activeInput && (
                <Button
                  onClick={() => {
                    // TODO: 전송 가능 여부 체크
                    if (checkInput()) {
                      setChatInput('');
                      setActiveInput(false);
                      setLoadingMsg(selectLoadingMsg(false));

                      submitChat();
                    }
                  }}>
                  전송
                </Button>
              )}
            </RowBox>
            {!loadingResId && activeInput && (
              <RowWrapBox>
                <ColumDivider />
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
