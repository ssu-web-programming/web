import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { NovaChatType } from 'store/slices/novaHistorySlice';
import IconTextButton from 'components/buttons/IconTextButton';
import PreMarkdown from 'components/PreMarkdown';
import Icon from 'components/Icon';
import Overlay from 'components/Overlay';
import { ReactComponent as CreditColorIcon } from 'img/ico_credit_color.svg';
import { ReactComponent as CopyChatIcon } from 'img/ico_copy_chat.svg';
import { ReactComponent as InsertDocsIcon } from 'img/ico_insert_docs.svg';
import ico_user from 'img/ico_user.svg';
import ico_ai from 'img/ico_ai.svg';
import { InputBarSubmitParam } from './InputBar';
import { useAppSelector } from 'store/store';
import { selectTabSlice } from 'store/slices/tabSlice';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 12px;

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
  gap: 12px;
`;

const Chat = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;

  p {
    font-size: 16px;
  }
`;

const Question = styled(Chat)`
  align-items: center;

  p {
    font-weight: 500;
    line-height: 25.6px;
  }
`;

const Answer = styled(Chat)`
  align-items: flex-start;

  p {
    font-weight: 400;
    line-height: 24px;
  }
`;

const ChatButtonWrapper = styled.div`
  width: 100%;
  height: 34px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-top: 12px;

  button > div {
    gap: 4px;
  }
`;

const ButtonText = styled.div`
  font-size: 14px;
  line-height: 14px;
  font-weight: 500;
`;

interface ChatListProps {
  novaHistory: NovaChatType[];
  onSubmit: (submitParam: InputBarSubmitParam) => void;
  onCopy: (text: string) => void;
  handleInsertDocs: (history: NovaChatType) => void;
  onSave: (history: NovaChatType) => void;
}

type ChatButtonType = {
  status: NovaChatType['status'][];
  text: string;
  iconSrc: React.ReactNode;
  clickHandler: (arg: NovaChatType | any) => void;
};

export default function ChatList(props: ChatListProps) {
  const { novaHistory, onSubmit, onCopy, handleInsertDocs, onSave } = props;
  const { t } = useTranslation();
  const { creating } = useAppSelector(selectTabSlice);

  const CHAT_BUTTON_LIST: ChatButtonType[] = [
    {
      status: ['done', 'cancel'],
      iconSrc: <CreditColorIcon />,
      text: t(`Nova.Chat.Recreating`),
      clickHandler: (history: NovaChatType) => onSubmit({ input: history.input, type: '' })
    },
    {
      status: ['done'],
      iconSrc: <CopyChatIcon />,
      text: t(`Nova.Chat.Copy`),
      clickHandler: (history: NovaChatType) => onCopy(history.output)
    },
    {
      status: ['done'],
      iconSrc: <InsertDocsIcon />,
      text: t(`Nova.Chat.InsertDoc.Title`),
      clickHandler: (history: NovaChatType) => handleInsertDocs(history)
    }
  ];

  return (
    <Wrapper
      ref={(el) => {
        if (el) el.scrollTo(0, el.scrollHeight);
      }}>
      {novaHistory.map((item) => (
        <ChatItem key={item.id}>
          <Question>
            <Icon size={32} iconSrc={ico_user}></Icon>
            <p>{item.input}</p>
          </Question>
          <Answer>
            <Icon size={32} iconSrc={ico_ai}></Icon>
            {item.status === 'request' ? (
              <p>Loading...</p>
            ) : (
              <div>
                <PreMarkdown text={item.output}>
                  <Overlay onSave={() => onSave(item)} />
                </PreMarkdown>
                <ChatButtonWrapper>
                  {CHAT_BUTTON_LIST.filter((btn) => btn.status.includes(item.status)).map((btn) => (
                    <IconTextButton
                      disable={creating !== 'none'}
                      key={btn.text}
                      width={'fit'}
                      iconSize={24}
                      iconSrc={btn.iconSrc}
                      iconPos="left"
                      onClick={() => btn.clickHandler(item)}
                      cssExt={css`
                        background: transparent;
                        padding: 0;
                      `}>
                      <ButtonText>{btn.text}</ButtonText>
                    </IconTextButton>
                  ))}
                </ChatButtonWrapper>
              </div>
            )}
          </Answer>
        </ChatItem>
      ))}
    </Wrapper>
  );
}
