import React, { forwardRef, useEffect, useRef } from 'react';
import IconTextButton from 'components/buttons/IconTextButton';
import { useConfirm } from 'components/Confirm';
import useLangParameterNavigate from 'components/hooks/useLangParameterNavigate';
import Icon from 'components/Icon';
import Overlay from 'components/Overlay';
import PreMarkdown from 'components/PreMarkdown';
import ArrowCornerDarkIcon from 'img/dark/ico_arrow_corner.svg';
import { ReactComponent as CopyChatDarkIcon } from 'img/dark/ico_copy_chat.svg';
import { ReactComponent as InsertDocsDarkIcon } from 'img/dark/ico_insert_docs.svg';
import { ReactComponent as RetryChatDarkIcon } from 'img/dark/ico_retry_chat.svg';
import { ReactComponent as ShareChatDarkIcon } from 'img/dark/ico_share_chat.svg';
import SparkleDarkIcon from 'img/dark/ico_sparkle.svg';
import UserDarkIcon from 'img/dark/ico_user.svg';
import AIDarkIcon from 'img/dark/nova/ico_ai_nova.svg';
import SkeletonDarkIcon from 'img/dark/skeleton.json';
import ArrowCornerLightIcon from 'img/light/ico_arrow_corner.svg';
import { ReactComponent as CopyChatLightIcon } from 'img/light/ico_copy_chat.svg';
import { ReactComponent as InsertDocsLightIcon } from 'img/light/ico_insert_docs.svg';
import { ReactComponent as RetryChatLightIcon } from 'img/light/ico_retry_chat.svg';
import { ReactComponent as ShareChatLightIcon } from 'img/light/ico_share_chat.svg';
import SparkleLightIcon from 'img/light/ico_sparkle.svg';
import UserLightIcon from 'img/light/ico_user.svg';
import AILightIcon from 'img/light/nova/ico_ai_nova.svg';
import SkeletonLightIcon from 'img/light/skeleton.json';
import { ClientStatusType } from 'pages/Nova/Nova';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';
import {
  isShareModeSelector,
  NovaChatType,
  NovaFileInfo,
  selectAllItems,
  selectedItemsSelector,
  setIsShareMode,
  toggleItemSelection
} from 'store/slices/nova/novaHistorySlice';
import { NOVA_TAB_TYPE, selectNovaTab, selectTabSlice } from 'store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import styled, { css } from 'styled-components';
import Bridge, { ClientType, getPlatform } from 'util/bridge';
import { getFileExtension, sliceFileName } from 'util/common';

import { themeInfoSelector } from '../../store/slices/theme';
import { setDriveFiles, setLocalFiles } from '../../store/slices/uploadFiles';
import { blobToFile } from '../../util/files';
import CheckBox from '../CheckBox';
import useCopyText from '../hooks/copyText';
import { useInsertDocsHandler } from '../hooks/nova/useInsertDocsHandler';

import { getFileIcon, InputBarSubmitParam } from './inputBar';
import Tabs from './tabs';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1 1 0;
  gap: 12px;
  flex-direction: column;
  padding: 24px 16px;
  overflow-y: auto;
`;

const ChatItem = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: ${({ theme }) => theme.color.text.gray04};
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
  width: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 3px;
  word-wrap: break-word;
`;

const Answer = styled(Chat)`
  width: 100%;
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
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--gray-gray-40);
  border-radius: 8px;
  background: ${({ theme }) => theme.color.background.gray04};

  font-size: 14px;
  line-height: 21px;
  text-align: left;

  &:hover {
    background-color: #c9cdd2;
    cursor: pointer;
  }
`;

const MakeNewImageGuide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  overflow: hidden;
`;

const MakeNewImageMessage = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.color.text.main};
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
  iconSrc: React.ReactNode;
  clickHandler: (arg: NovaChatType | any) => void;
};

const ChatList = forwardRef<HTMLDivElement, ChatListProps>((props, ref) => {
  const { novaHistory, onSubmit, onSave, scrollHandler, expiredNOVA } = props;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { insertDocsHandler } = useInsertDocsHandler();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const { creating } = useAppSelector(selectTabSlice);
  const selectedItems = useAppSelector(selectedItemsSelector);
  const isShareMode = useAppSelector(isShareModeSelector);
  const { from } = useLangParameterNavigate();
  const { onCopy } = useCopyText();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const tabValues: NOVA_TAB_TYPE[] = Object.values(NOVA_TAB_TYPE);
  const filteredTabValues = tabValues.filter((tab) => tab !== NOVA_TAB_TYPE.aiChat);

  const handleToggleItemSelection = (id: string) => {
    dispatch(toggleItemSelection(id));
  };

  const handleChangeTab = async (selectTab: NOVA_TAB_TYPE, image: string) => {
    dispatch(selectNovaTab(selectTab));
    dispatch(setDriveFiles([]));

    const res = await fetch(image);
    const blob = await res.blob();
    dispatch(setLocalFiles([blobToFile(blob)]));

    Bridge.callBridgeApi('curNovaTab', selectTab);
  };

  const CHAT_BUTTON_LIST: ChatButtonType[] = [
    {
      name: t('Index.Result.Remake'),
      status: ['done', 'cancel'],
      iconSrc: isLightMode ? <RetryChatLightIcon /> : <RetryChatDarkIcon />,
      clickHandler: (history: NovaChatType) => onSubmit({ input: history.input, type: '' })
    },
    {
      name: t('Index.Chat.Copy'),
      status: ['done'],
      iconSrc: isLightMode ? <CopyChatLightIcon /> : <CopyChatDarkIcon />,
      clickHandler: (history: NovaChatType) => onCopy(history.output)
    },
    {
      name: t('Index.Result.InsertDoc'),
      status: ['done'],
      iconSrc: isLightMode ? <InsertDocsLightIcon /> : <InsertDocsDarkIcon />,
      clickHandler: (history: NovaChatType) => insertDocsHandler(history)
    },
    {
      name: t('Index.Result.Share'),
      status: ['done'],
      iconSrc: isLightMode ? <ShareChatLightIcon /> : <ShareChatDarkIcon />,
      clickHandler: () => {
        dispatch(selectAllItems());
        dispatch(setIsShareMode(true));
      }
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
            {isShareMode && (
              <CheckBox
                isChecked={selectedItems.includes('q:' + item.id)}
                setIsChecked={() => {}}
                onClick={() => handleToggleItemSelection('q:' + item.id)}
                cssExt={css`
                  margin: 6px;
                `}
              />
            )}
            <Icon size={32} iconSrc={isLightMode ? UserLightIcon : UserDarkIcon}></Icon>
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
                                    msg: t('Index.Chat.FailOpenDoc'),
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
            {isShareMode && (
              <CheckBox
                isChecked={selectedItems.includes('a:' + item.id)}
                setIsChecked={() => {}}
                onClick={() => handleToggleItemSelection('a:' + item.id)}
                cssExt={css`
                  margin: 6px;
                `}
              />
            )}
            <Icon size={32} iconSrc={isLightMode ? AILightIcon : AIDarkIcon}></Icon>
            {item.status === 'request' ? (
              <Lottie
                animationData={isLightMode ? SkeletonLightIcon : SkeletonDarkIcon}
                loop
                play
              />
            ) : (
              <div style={{ width: '100%', maxWidth: 'calc(100% - 40px)', paddingTop: '3px' }}>
                <PreMarkdown text={item.output}>
                  <Overlay onSave={() => onSave(item)} />
                </PreMarkdown>
                {!isShareMode && (
                  <>
                    {item.res && (
                      <MakeNewImageGuide>
                        <MakeNewImageMessage>
                          <img
                            src={isLightMode ? ArrowCornerLightIcon : ArrowCornerDarkIcon}
                            alt="arrow"
                          />
                          <span>{t('Index.aiChat.ChangeImage')}</span>
                          <img src={isLightMode ? SparkleLightIcon : SparkleDarkIcon} alt="arrow" />
                        </MakeNewImageMessage>
                        <Tabs
                          tabs={filteredTabValues}
                          activeTab={selectedNovaTab}
                          showArrowBtn={false}
                          cssExt={css`
                            height: auto;
                            min-height: auto;
                            padding: 0;
                          `}
                          onChangeTab={(tab) => {
                            handleChangeTab(tab, item.res || '');
                          }}
                        />
                      </MakeNewImageGuide>
                    )}
                    <ChatButtonWrapper>
                      {chatButtonList
                        .filter((btn) => btn.status.includes(item.status))
                        .map((btn) => (
                          <IconTextButton
                            disable={creating == 'NOVA' || expiredNOVA}
                            key={btn.name}
                            width={'fit'}
                            iconSize={24}
                            iconSrc={btn.iconSrc}
                            iconPos="left"
                            onClick={() => btn.clickHandler(item)}
                            cssExt={css`
                              background: transparent;
                              padding: 0;
                            `}
                            tooltip={btn.name}
                          />
                        ))}
                    </ChatButtonWrapper>
                  </>
                )}
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
