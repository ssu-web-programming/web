import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import SpeechBubble from '../components/SpeechBubble';
import TextArea from '../components/TextArea';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  appendChat,
  initChatHistory,
  selectChatHistory,
  updateChat
} from '../store/slices/chatHistorySlice';
import { v4 as uuidv4 } from 'uuid';
import Button from '../components/Button';
import OpenAILinkText from '../components/OpenAILinkText';
import { TextButton } from './AIWriteTab';
import FucRecBox from '../components/AIChat/FucRecBox';

const INPUT_HEIGHT = 120;
const TEXT_MAX_HEIGHT = 200;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  position: relative;
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

  height: ${({ activeInputWrap }: { activeInputWrap: boolean }) =>
    activeInputWrap ? INPUT_HEIGHT + 'px' : ''};
`;

const InactiveInput = styled.div`
  width: 95%;
  border-radius: 5px;
  border: solid 1px black;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-self: center;
  margin-bottom: 10px;

  &:hover {
    cursor: text;
  }
`;

const ActiveInputBox = styled.div`
  position: absolute;
  bottom: 10px;
  padding: 5px;
  width: 95%;
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
  border-radius: 5px;
  border: solid 1px black;
  box-sizing: border-box;
  padding: 5px;

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

const InfoWRapper = styled.div`
  display: flex;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin: 5px;
  background-color: blue;
  color: white;
  cursor: pointer;
`;

const FitButton = styled.button`
  width: fit-content;
  height: fit-content;
  padding: 10px;
`;

const inputMaxLength = 1000;

const AIChatTab = () => {
  const dispatch = useAppDispatch();
  const chatHistory = useAppSelector(selectChatHistory);

  const [chatInput, setChatInput] = useState<string>('');
  const [activeInput, setActiveInput] = useState<boolean>(false);
  const [isLoadingRes, setIsLoadingRes] = useState<boolean>(false);

  const chatEndRef = useRef<any>();
  const stopRef = useRef<boolean>(false);

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (chatHistory.length === 0) {
      // TODO : set content
      dispatch(initChatHistory({ id: uuidv4(), role: 'assistant', content: 'what do you want?' }));
    }
  }, []);

  const handleResizeHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = textRef.current.scrollHeight + 'px';
    }
  };

  const submitChat = async (inputParam?: string) => {
    const assistantId = uuidv4();
    const input = inputParam ? inputParam : chatInput;
    setChatInput('');
    setActiveInput(false);

    dispatch(appendChat({ id: uuidv4(), role: 'user', content: chatInput }));
    dispatch(appendChat({ id: assistantId, role: 'assistant', content: '' }));

    setIsLoadingRes(true);
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
      dispatch(updateChat({ id: assistantId, role: 'assistant', content: decodeStr }));
    }

    setIsLoadingRes(false);
    stopRef.current = false;
  };

  const textRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (activeInput && textRef?.current) {
      textRef.current.focus();
    }
  }, [activeInput]);

  return (
    <Wrapper>
      <ChatListWrapper>
        {chatHistory.map((chat, index) => (
          <SpeechBubble
            key={chat.id}
            text={chat.content}
            isUser={chat.role === 'user'}
            outterChild={
              !isLoadingRes &&
              chat.role === 'assistant' &&
              index > 1 && (
                <>
                  <RowBox>
                    <FitButton
                      onClick={() => {
                        submitChat(chatHistory[index - 1].content);
                      }}>
                      다시 만들기
                    </FitButton>
                    <FitButton
                      onClick={() => {
                        // TODO: 문서 삽입 로직
                      }}>
                      문서에 삽입하기
                    </FitButton>
                  </RowBox>
                  <OpenAILinkText />
                </>
              )
            }>
            {chat.role !== 'user' && (
              <RowBox>
                <div>공백 포함 {chat.content.length}/1000</div>
                {isLoadingRes ? <div>로딩중</div> : <div>복사</div>}
              </RowBox>
            )}
          </SpeechBubble>
        ))}
        <div ref={chatEndRef}></div>
      </ChatListWrapper>
      {isLoadingRes && (
        <Button
          onClick={() => {
            stopRef.current = true;
          }}>
          STOP
        </Button>
      )}
      <InputWrapper
        activeInputWrap={activeInput}
        onBlur={() => {
          if (chatInput.length === 0) setActiveInput(false);
        }}>
        {activeInput || chatInput.length !== 0 ? (
          <ActiveInputBox>
            <FucRecBox />

            <ActiveInput>
              <RowBox>
                <TextArea
                  textRef={textRef}
                  cssExt={css`
                    width: 100%;
                    border: 0;
                    width: 80%;
                    max-height: ${TEXT_MAX_HEIGHT}px;
                    justify-content: center;
                  `}
                  value={chatInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleResizeHeight();
                    setChatInput(e.target.value);
                  }}
                />
                <ButtonWrapper
                  onClick={() => {
                    submitChat();
                  }}>
                  전송
                </ButtonWrapper>
              </RowBox>
              <LengthWrapper>
                {chatInput.length}/{inputMaxLength}
              </LengthWrapper>
              <RowBox>
                <InfoWRapper>대화 1회 당 N크레딧이 차감됩니다.</InfoWRapper>
                <TextButton
                  onClick={() => {
                    // setSubject(exampleSubject[Math.floor(Math.random() * exampleSubject.length)]);
                  }}>
                  예시 문구보기
                </TextButton>
              </RowBox>
            </ActiveInput>
          </ActiveInputBox>
        ) : (
          <InactiveInput
            onClick={() => {
              setActiveInput(true);
            }}>
            <ButtonWrapper>전송</ButtonWrapper>
          </InactiveInput>
        )}
      </InputWrapper>
    </Wrapper>
  );
};

export default AIChatTab;
