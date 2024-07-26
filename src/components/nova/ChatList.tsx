import { useEffect, forwardRef, useRef } from 'react';
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
import { FileItem, InputBarSubmitParam, getFileIcon, getFileName } from './InputBar';
import { useAppSelector } from 'store/store';
import { selectTabSlice } from 'store/slices/tabSlice';
import Loading from 'img/agent_loading.gif';

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
  align-items: flex-start;

  p {
    font-weight: 500;
    line-height: 25.6px;
  }
`;

const QuestionContents = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  scrollHandler: (e: React.UIEvent<HTMLDivElement>) => void;
  expiredNOVA: boolean;
}

type ChatButtonType = {
  status: NovaChatType['status'][];
  text: string;
  iconSrc: React.ReactNode;
  clickHandler: (arg: NovaChatType | any) => void;
};

const ChatList = forwardRef<HTMLDivElement, ChatListProps>((props, ref) => {
  const { novaHistory, onSubmit, onCopy, handleInsertDocs, onSave, scrollHandler, expiredNOVA } =
    props;
  const { t } = useTranslation();
  const { creating } = useAppSelector(selectTabSlice);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [novaHistory]);

  return (
    <Wrapper
      ref={(node) => {
        scrollRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      onScroll={(ref) => scrollHandler(ref)}>
      {novaHistory.map((item) => (
        <ChatItem key={item.id}>
          <Question>
            <Icon size={32} iconSrc={ico_user}></Icon>
            <QuestionContents>
              <p>{item.input}</p>
              {item.files?.map((file) => (
                <FileItem key={file.name} style={{ width: '100%' }}>
                  <Icon size={28} iconSrc={getFileIcon(file.name)}></Icon>
                  <span>{getFileName(file.name)}</span>
                </FileItem>
              ))}
            </QuestionContents>
          </Question>
          <Answer>
            <Icon size={32} iconSrc={ico_ai}></Icon>
            {item.status === 'request' ? (
              <img src={Loading} alt="loading" />
            ) : (
              <div>
                <PreMarkdown text={item.output}>
                  <Overlay onSave={() => onSave(item)} />
                </PreMarkdown>
                <ChatButtonWrapper>
                  {CHAT_BUTTON_LIST.filter((btn) => btn.status.includes(item.status)).map((btn) => (
                    <IconTextButton
                      disable={creating !== 'none' || expiredNOVA === true}
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
});

export default ChatList;
