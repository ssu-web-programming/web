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
  novaChatModeSelector,
  NovaChatType,
  NovaFileInfo,
  selectAllItems,
  selectedItemsSelector,
  setIsShareMode,
  toggleItemSelection
} from 'store/slices/nova/novaHistorySlice';
import { selectNovaTab, selectTabSlice } from 'store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from 'store/store';
import { css } from 'styled-components';
import Bridge, { ClientType, getPlatform } from 'util/bridge';
import { getFileExtension, sliceFileName } from 'util/common';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import {
  getMenuItemsFromServiceGroup,
  getServiceGroupInfo,
  SERVICE_TYPE
} from '../../../constants/serviceType';
import { themeInfoSelector } from '../../../store/slices/theme';
import { setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { blobToFile } from '../../../util/files';
import CheckBox from '../../CheckBox';
import useCopyText from '../../hooks/copyText';
import { useInsertDocsHandler } from '../../hooks/nova/useInsertDocsHandler';
import SelectBox from '../../selectBox';
import { getFileIcon, InputBarSubmitParam } from '../inputBar';
import RecommendedQuestions from '../recommendedQuestions';
import Reference from '../reference';
import Tabs from '../tabs';

import * as S from './style';

interface ChatListProps {
  novaHistory: NovaChatType[];
  createChatSubmitHandler: (
    submitParam: InputBarSubmitParam,
    chatMode: SERVICE_TYPE,
    isAnswer: boolean
  ) => void;
  onSave: (history: NovaChatType) => void;
  scrollHandler: (e: React.UIEvent<HTMLDivElement>) => void;
  expiredNOVA: boolean;
  setImagePreview: React.Dispatch<React.SetStateAction<NovaFileInfo | null>>;
  setInputContents: React.Dispatch<React.SetStateAction<string>>;
}

type ChatButtonType = {
  name: string;
  status: NovaChatType['status'][];
  iconSrc: React.ReactNode;
  clickHandler: (arg: NovaChatType | any) => void;
};

const ChatList = forwardRef<HTMLDivElement, ChatListProps>((props, ref) => {
  const {
    novaHistory,
    createChatSubmitHandler,
    onSave,
    scrollHandler,
    expiredNOVA,
    setInputContents
  } = props;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { insertDocsHandler } = useInsertDocsHandler();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const { creating } = useAppSelector(selectTabSlice);
  const selectedItems = useAppSelector(selectedItemsSelector);
  const isShareMode = useAppSelector(isShareModeSelector);
  const chatMode = useAppSelector(novaChatModeSelector);
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
      name: t('Index.Index.Remake'),
      status: ['done', 'cancel'],
      iconSrc: isLightMode ? <RetryChatLightIcon /> : <RetryChatDarkIcon />,
      clickHandler: (history: NovaChatType) => {
        createChatSubmitHandler({ input: history.input, type: '' }, chatMode, false);
      }
    },
    {
      name: t('Index.Chat.Copy'),
      status: ['done'],
      iconSrc: isLightMode ? <CopyChatLightIcon /> : <CopyChatDarkIcon />,
      clickHandler: (history: NovaChatType) => onCopy(history.output)
    },
    {
      name: t('Index.Index.InsertDoc'),
      status: ['done'],
      iconSrc: isLightMode ? <InsertDocsLightIcon /> : <InsertDocsDarkIcon />,
      clickHandler: (history: NovaChatType) => insertDocsHandler(history)
    },
    {
      name: t('Index.Index.Share'),
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
    <S.Wrapper
      ref={(node) => {
        scrollRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      onScroll={(ref) => scrollHandler(ref)}
      isPerplexity={chatMode === SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO}>
      {novaHistory.map((item) => (
        <S.ChatItem key={item.id}>
          <S.Question>
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
            <S.QuestionContents>
              <p>{item.input}</p>
              {item.files?.map((file) => (
                <S.FileItem
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
                </S.FileItem>
              ))}
            </S.QuestionContents>
          </S.Question>
          <S.Answer>
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
                {item.chatType === SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO && (
                  <Reference references={item.references || []} />
                )}
                <PreMarkdown text={item.output}>
                  <Overlay onSave={() => onSave(item)} />
                </PreMarkdown>
                {!isShareMode && (
                  <>
                    {item.res && (
                      <S.MakeNewImageGuide>
                        <S.MakeNewImageMessage>
                          <img
                            src={isLightMode ? ArrowCornerLightIcon : ArrowCornerDarkIcon}
                            alt="arrow"
                          />
                          <span>{t('Nova.aiChat.ChangeImage')}</span>
                          <img src={isLightMode ? SparkleLightIcon : SparkleDarkIcon} alt="arrow" />
                        </S.MakeNewImageMessage>
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
                      </S.MakeNewImageGuide>
                    )}
                    <S.ChatButtonWrapper>
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
                      {creating != 'NOVA' &&
                        !expiredNOVA &&
                        [...novaHistory].reverse().find((item) => item.isAnswer === false)?.id ===
                          item.id &&
                        item.chatType !== SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO && (
                          <SelectBox
                            placeHolder={'다른 답변 보기'}
                            minWidth={290}
                            menuItem={getMenuItemsFromServiceGroup(isLightMode).filter(
                              (item) => item.key === chatMode
                            )}
                            setSelectedItem={(selectedItem: string) => {
                              createChatSubmitHandler(
                                {
                                  input: item.input,
                                  type: ''
                                },
                                selectedItem as SERVICE_TYPE,
                                true
                              );
                            }}
                            selectBoxCssExt={css`
                              min-height: 48px;
                            `}
                          />
                        )}
                    </S.ChatButtonWrapper>
                  </>
                )}
              </div>
            )}
          </S.Answer>
          {item.recommendedQuestions?.length ? (
            <RecommendedQuestions
              questions={item.recommendedQuestions ?? []}
              setInputContents={setInputContents}
            />
          ) : null}
        </S.ChatItem>
      ))}
    </S.Wrapper>
  );
});

export default ChatList;

ChatList.displayName = 'ChatList';
