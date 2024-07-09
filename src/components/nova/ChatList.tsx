import PreMarkdown from 'components/PreMarkdown';
import { NovaChatType } from 'store/slices/novaHistorySlice';
import styled from 'styled-components';
import { InputBarSubmitParam } from './InputBar';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  flex-direction: column;
  padding: 24px 16px;

  background-color: var(--gray-gray-10);
  overflow-y: auto;
`;

const ChatItem = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: flex-start;
    align-items: flex-start;
  }

  & + & {
    margin-top: 8px;
  }
`;

interface ChatListProps {
  novaHistory: NovaChatType[];
  onSubmit: (submitParam: InputBarSubmitParam) => void;
}

export default function ChatList(props: ChatListProps) {
  const { novaHistory, onSubmit } = props;

  return (
    <Wrapper
      ref={(el) => {
        if (el) el.scrollTo(0, el.scrollHeight);
      }}>
      {novaHistory.map((item) => (
        <ChatItem key={item.id}>
          <div>
            <div>User</div>
            {item.input}
          </div>
          <div>
            <div>AI</div>
            {item.status === 'request' ? (
              <div>Loading...</div>
            ) : (
              <div>
                <PreMarkdown text={item.output}></PreMarkdown>
                {item.status === 'done' && (
                  <>
                    <button onClick={() => onSubmit({ input: item.input, type: '' })}>
                      다시생성
                    </button>
                    <button>복사</button>
                    <button>문서로 만들기</button>
                  </>
                )}
                {item.status === 'cancel' && (
                  <>
                    <button>다시생성</button>
                  </>
                )}
              </div>
            )}
          </div>
        </ChatItem>
      ))}
    </Wrapper>
  );
}
