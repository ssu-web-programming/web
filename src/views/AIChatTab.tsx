import styled, { css } from 'styled-components';
import { ReactElement, useEffect, useRef, useState } from 'react';
import SpeechBubble from '../components/SpeechBubble';
import TextArea from '../components/TextArea';

const Wrapper = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  position: relative;
`;

const ChatListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 20px;
`;

const InputWrapper = styled.div`
  /* height: 20%; */
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  box-sizing: border-box;
`;

const InactiveInput = styled.div`
  width: 95%;
  border-radius: 5px;
  border: solid 1px black;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  align-self: center;

  &:hover {
    cursor: text;
  }
`;

const ActiveInput = styled.div`
  border-radius: 5px;
  border: solid 1px black;
  position: absolute;
  bottom: 0px;
  padding: 10px;
  /* margin: 10px; */
  width: 95%;
  box-sizing: border-box;

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

interface Chat {
  content: string;
  role: string;
}

const INITIAL_CHAT: Chat = {
  role: 'assistant',
  content: 'what do you want?'
};

const inputMaxLength = 1000;

const AIChatTab = () => {
  const [chatList, setChatList] = useState<Chat[]>([INITIAL_CHAT]);

  const [chatInput, setChatInput] = useState<string>('');
  const [activeInput, setActiveInput] = useState<boolean>(false);
  const [, render] = useState<any>({});

  const isEndResponse = useRef<boolean>(true);

  const chatEndRef = useRef<any>();

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatList]);

  useEffect(() => {}, [activeInput]);

  const submitChat = async () => {
    setChatInput('');
    setActiveInput(false);

    setChatList((prev) => [...prev, { content: chatInput, role: 'user' }]);

    isEndResponse.current = false;
    const res = await fetch('https://kittyhawk.polarisoffice.com/api/v2/chat/chatStream', {
      headers: { 'content-type': 'application/json' },
      //   responseType: 'stream',
      body: JSON.stringify({
        history: [
          {
            content: 'hello',
            role: 'system'
          },
          ...chatList,
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

    while (reader && !isEndResponse.current) {
      // if (isFull) break;
      const { value, done } = await reader.read();
      if (done) {
        // setProcessState(PROCESS_STATE.COMPLETE_GENERATE);
        break;
      }

      const decodeStr = enc.decode(value);

      setChatList((prev) => {
        if (prev[prev.length - 1].role === 'assistant') {
          const last = prev[prev.length - 1];
          //last.content += decodeStr;
          return [...prev.slice(0, -1), { ...last, content: last.content + decodeStr }]; //.concat(last);
        } else {
          return [...prev, { role: 'assistant', content: decodeStr }];
        }
      });
    }
    isEndResponse.current = true;
    render({});
  };

  return (
    <Wrapper>
      <ChatListWrapper>
        {chatList.map((chat) => (
          <SpeechBubble text={chat.content} isUser={chat.role === 'user'} />
        ))}
        <div ref={chatEndRef}></div>
      </ChatListWrapper>
      <InputWrapper>
        {activeInput || chatInput.length !== 0 ? (
          <ActiveInput
            onBlur={() => {
              if (chatInput.length === 0) setActiveInput(false);
            }}>
            <TextArea
              disable={!isEndResponse.current}
              cssExt={css`
                width: 100%;
                border: 0;
                height: 100px;
                justify-content: center;
              `}
              value={chatInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
