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
  findTabByService,
  getChatGroupKey,
  getMenuItemsFromServiceGroup,
  getServiceGroupInfo,
  SERVICE_CATEGORY,
  SERVICE_GROUP_MAP,
  SERVICE_TYPE
} from '../../../constants/serviceType';
import {
  selectAllServiceCredits,
  selectPageCreditReceived,
  selectPageService
} from '../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../store/slices/theme';
import { getCurrentFile, setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { blobToFile } from '../../../util/files';
import CheckBox from '../../checkbox';
import useCopyText from '../../hooks/copyText';
import { useInsertDocsHandler } from '../../hooks/nova/useInsertDocsHandler';
import UseShowSurveyModal from '../../hooks/use-survey-modal';
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
    isAnswer: boolean,
    chatType: SERVICE_TYPE
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
  const { selectedNovaTab, creating } = useAppSelector(selectTabSlice);
  const currentFile = useAppSelector(getCurrentFile);
  const isCreditRecieved = useAppSelector(selectPageCreditReceived(selectedNovaTab));
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const selectedItems = useAppSelector(selectedItemsSelector);
  const isShareMode = useAppSelector(isShareModeSelector);
  const chatMode = useAppSelector(novaChatModeSelector);
  const serviceCredits = useAppSelector(selectAllServiceCredits);
  const showSurveyModal = UseShowSurveyModal();
  const { from } = useLangParameterNavigate();
  const { onCopy } = useCopyText();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const filteredTabValues = Object.values(SERVICE_GROUP_MAP[SERVICE_CATEGORY.IMAGE])
    .flat()
    .map(findTabByService)
    .filter((tab, index, self) => self.indexOf(tab) === index);

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
      name: t('Nova.Result.Remake'),
      status: ['done', 'cancel'],
      iconSrc: isLightMode ? <RetryChatLightIcon /> : <RetryChatDarkIcon />,
      clickHandler: async (history: NovaChatType) => {
        const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
        if (isShowModal) return;

        createChatSubmitHandler(
          { input: history.input, type: '' },
          history.isAnswer ?? false,
          history.chatType
        );
      }
    },
    {
      name: t('Nova.Chat.Copy'),
      status: ['done'],
      iconSrc: isLightMode ? <CopyChatLightIcon /> : <CopyChatDarkIcon />,
      clickHandler: async (history: NovaChatType) => {
        const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
        if (isShowModal) return;

        onCopy(history.output);
        await Bridge.callBridgeApi('amplitudeData', {
          type: 'copy_nova_chating',
          props: {
            file_id: currentFile.id,
            document_format: currentFile.ext
          }
        });
      }
    },
    {
      name: t('Nova.Result.InsertDoc'),
      status: ['done'],
      iconSrc: isLightMode ? <InsertDocsLightIcon /> : <InsertDocsDarkIcon />,
      clickHandler: async (history: NovaChatType) => {
        const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
        if (isShowModal) return;

        insertDocsHandler(history);
        await Bridge.callBridgeApi('amplitudeData', {
          type: 'insert_nova_chating',
          props: {
            file_id: currentFile.id,
            document_format: currentFile.ext
          }
        });
      }
    },
    {
      name: t('Nova.Result.Share'),
      status: ['done'],
      iconSrc: isLightMode ? <ShareChatLightIcon /> : <ShareChatDarkIcon />,
      clickHandler: async () => {
        const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
        if (isShowModal) return;

        dispatch(selectAllItems());
        dispatch(setIsShareMode(true));
        await Bridge.callBridgeApi('amplitudeData', {
          type: 'share_nova_chating',
          props: {
            file_id: currentFile.id,
            document_format: currentFile.ext
          }
        });
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
      onScroll={(ref) => scrollHandler(ref)}>
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
                      {creating != 'NOVA' && !expiredNOVA && chatMode != item.chatType && (
                        <S.ChatMode>
                          <span>
                            {item.chatType === SERVICE_TYPE.NOVA_WEBSEARCH_SONAR_REASONING_PRO
                              ? 'Perplexity R-Pro'
                              : getServiceGroupInfo(
                                  getChatGroupKey(item.chatType) || '',
                                  isLightMode
                                ).label}
                          </span>
                        </S.ChatMode>
                      )}
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
                        novaHistory[novaHistory.length - 1].vsId === '' && (
                          <SelectBox
                            placeHolder={t('Nova.perplexity.button.anotherAnswer') || ''}
                            minWidth={330}
                            paddingX={4}
                            paddingY={4}
                            menuItem={getMenuItemsFromServiceGroup(
                              serviceCredits,
                              isLightMode,
                              t
                            ).filter((item) => item.key !== chatMode)}
                            setSelectedItem={async (selectedItem) => {
                              if (
                                Object.values(SERVICE_TYPE).includes(selectedItem as SERVICE_TYPE)
                              ) {
                                createChatSubmitHandler(
                                  {
                                    input: item.input,
                                    type: ''
                                  },
                                  true,
                                  selectedItem as SERVICE_TYPE
                                );
                              }
                            }}
                            selectBoxCssExt={css`
                              background: ${isLightMode ? 'var(--white)' : 'var(--gray-gray-90)'};
                              border: 1px solid
                                ${isLightMode ? 'var(--gray-gray-30)' : 'var(--gray-gray-87)'};
                            `}
                            innerBoxCssExt={css`
                              min-height: 58px;
                              padding: 8px 16px 8px 8px;
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
