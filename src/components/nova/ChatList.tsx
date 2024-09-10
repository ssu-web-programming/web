import { forwardRef, useEffect, useRef } from 'react';
import IconTextButton from 'components/buttons/IconTextButton';
import { useConfirm } from 'components/Confirm';
import useLangParameterNavigate from 'components/hooks/useLangParameterNavigate';
import Icon from 'components/Icon';
import Overlay from 'components/Overlay';
import PreMarkdown from 'components/PreMarkdown';
import Loading from 'img/agent_loading.gif';
import ico_ai from 'img/ico_ai.svg';
import { ReactComponent as CopyChatIcon } from 'img/ico_copy_chat.svg';
import { ReactComponent as CreditColorIcon } from 'img/ico_credit_color.svg';
import { ReactComponent as InsertDocsIcon } from 'img/ico_insert_docs.svg';
import ico_user from 'img/ico_user.svg';
import { ClientStatusType } from 'pages/Nova/Nova';
import { useTranslation } from 'react-i18next';
import { NovaChatType, NovaFileInfo } from 'store/slices/novaHistorySlice';
import { selectTabSlice } from 'store/slices/tabSlice';
import { useAppSelector } from 'store/store';
import styled, { css } from 'styled-components';
import Bridge, { ClientType, getPlatform } from 'util/bridge';
import { getFileExtension, sliceFileName } from 'util/common';

import useCopyText from '../hooks/copyText';
import { useInsertDocsHandler } from '../hooks/nova/useInsertDocsHandler';

import { flexCenter, getFileIcon, InputBarSubmitParam } from './InputBar';

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
  padding-top: 3px;
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

const FileItem = styled.div`
  width: fit-content;
  height: 40px;
  ${flexCenter};
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--gray-gray-40);
  border-radius: 8px;
  background: var(--gray-gray-20);

  font-size: 14px;
  line-height: 21px;
  text-align: left;
`;

const ButtonText = styled.div`
  font-size: 14px;
  line-height: 14px;
  font-weight: 500;
  text-align: left;
`;

interface ChatListProps {
  novaHistory: NovaChatType[];
  onSubmit: (submitParam: InputBarSubmitParam) => void;
  onSave: (history: NovaChatType) => void;
  scrollHandler: (e: React.UIEvent<HTMLDivElement>) => void;
  expiredNOVA: boolean;
  setImagePreview: React.Dispatch<React.SetStateAction<NovaFileInfo | null>>;
}

type ChatButtonType = {
  name: string;
  status: NovaChatType['status'][];
  text: string;
  iconSrc: React.ReactNode;
  clickHandler: (arg: NovaChatType | any) => void;
};

const ChatList = forwardRef<HTMLDivElement, ChatListProps>((props, ref) => {
  const { novaHistory, onSubmit, onSave, scrollHandler, expiredNOVA } = props;
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { insertDocsHandler } = useInsertDocsHandler();
  const { creating } = useAppSelector(selectTabSlice);
  const { from } = useLangParameterNavigate();
  const { onCopy } = useCopyText();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const CHAT_BUTTON_LIST: ChatButtonType[] = [
    {
      name: 'recreating',
      status: ['done', 'cancel'],
      iconSrc: <CreditColorIcon />,
      text: t(`Nova.Chat.Recreating`),
      clickHandler: (history: NovaChatType) => onSubmit({ input: history.input, type: '' })
    },
    {
      name: 'copy',
      status: ['done'],
      iconSrc: <CopyChatIcon />,
      text: t(`Nova.Chat.Copy`),
      clickHandler: (history: NovaChatType) => onCopy(history.output)
    },
    {
      name: 'insert',
      status: ['done'],
      iconSrc: <InsertDocsIcon />,
      text: t(`Nova.Chat.InsertDoc.Title`),
      clickHandler: (history: NovaChatType) => insertDocsHandler(history)
    }
  ];
  const chatButtonList =
    from === 'home' ? CHAT_BUTTON_LIST.filter((btn) => btn.name !== 'insert') : CHAT_BUTTON_LIST;

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
                <FileItem
                  key={file.name}
                  style={{ width: '100%' }}
                  onClick={async () => {
                    if (item.type === 'document') {
                      switch (getPlatform()) {
                        case ClientType.android:
                        case ClientType.ios: {
                          Bridge.callSyncBridgeApiWithCallback({
                            api: 'getClientStatus',
                            callback: async (status: ClientStatusType) => {
                              switch (status) {
                                case 'home':
                                  Bridge.callBridgeApi(
                                    'openPoDriveFile',
                                    JSON.stringify({
                                      fileId: file.fileId,
                                      fileRevision: file.fileRevision
                                    })
                                  );
                                  break;
                                default: {
                                  confirm({
                                    title: '',
                                    msg: t('Nova.Chat.FailOpenDoc'),
                                    onOk: {
                                      text: t('Confirm'),
                                      callback: () => {}
                                    }
                                  });
                                  break;
                                }
                              }
                            }
                          });
                          break;
                        }
                        case ClientType.windows: {
                          Bridge.callBridgeApi(
                            'pchome_mydoc',
                            JSON.stringify({
                              fileInfo: {
                                fileId: file.fileId,
                                fileRevision: file.fileRevision,
                                fileName: file.name
                              }
                            })
                          );
                          break;
                        }
                        case ClientType.mac:
                        case ClientType.unknown: {
                          Bridge.callBridgeApi(
                            'openPoDriveFile',
                            JSON.stringify({
                              fileId: file.fileId,
                              fileRevision: file.fileRevision,
                              fileName: file.name,
                              fileExtension: getFileExtension(file.name),
                              fileSize: file.file.size
                            })
                          );
                          break;
                        }
                      }
                    } else if (item.type === 'image') {
                      props.setImagePreview(file);
                    }
                  }}>
                  <Icon size={28} iconSrc={getFileIcon(file.name)}></Icon>
                  <span>{sliceFileName(file.name)}</span>
                </FileItem>
              ))}
            </QuestionContents>
          </Question>
          <Answer>
            <Icon size={32} iconSrc={ico_ai}></Icon>
            {item.status === 'request' ? (
              <img src={Loading} alt="loading" style={{ paddingTop: '4px' }} />
            ) : (
              <div style={{ paddingTop: '3px' }}>
                <PreMarkdown text={item.output}>
                  <Overlay onSave={() => onSave(item)} />
                </PreMarkdown>
                <ChatButtonWrapper>
                  {chatButtonList
                    .filter((btn) => btn.status.includes(item.status))
                    .map((btn) => (
                      <IconTextButton
                        disable={creating !== 'none' || expiredNOVA}
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

ChatList.displayName = 'ChatList';
