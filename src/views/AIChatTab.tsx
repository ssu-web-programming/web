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

const ActiveInput = styled.div`
  border-radius: 5px;
  border: solid 1px black;
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

const inputMaxLength = 1000;

const AIChatTab = () => {
  const dispatch = useAppDispatch();
  const chatHistory = useAppSelector(selectChatHistory);

  const [chatInput, setChatInput] = useState<string>('');
  const [activeInput, setActiveInput] = useState<boolean>(false);

  const [isEndResponse, setIsEndResponse] = useState<boolean>(true);

  const chatEndRef = useRef<any>();

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

  const submitChat = async () => {
    const assistantId = uuidv4();
    setChatInput('');
    setActiveInput(false);

    dispatch(appendChat({ id: uuidv4(), role: 'user', content: chatInput }));
    dispatch(appendChat({ id: assistantId, role: 'assistant', content: '' }));

    setIsEndResponse(false);
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
            content: chatInput,
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
      const { value, done } = await reader.read();
      if (done) {
        // setProcessState(PROCESS_STATE.COMPLETE_GENERATE);
        setIsEndResponse(true);
        break;
      }

      const decodeStr = enc.decode(value);
      dispatch(updateChat({ id: assistantId, role: 'assistant', content: decodeStr }));
    }
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
        {chatHistory.map((chat) => (
          <SpeechBubble key={chat.id} text={chat.content} isUser={chat.role === 'user'} />
        ))}
        <div ref={chatEndRef}></div>
      </ChatListWrapper>
      <InputWrapper activeInputWrap={activeInput}>
        {activeInput || chatInput.length !== 0 ? (
          <ActiveInput
            onBlur={() => {
              if (chatInput.length === 0) setActiveInput(false);
            }}>
            <TextArea
              textRef={textRef}
              disable={!isEndResponse}
              cssExt={css`
                width: 100%;
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
            <LengthWrapper>
              {chatInput.length}/{inputMaxLength}
            </LengthWrapper>
            <RowBox>
              <InfoWRapper>경고경고</InfoWRapper>
              <ButtonWrapper onClick={submitChat}>전송</ButtonWrapper>
            </RowBox>
          </ActiveInput>
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
