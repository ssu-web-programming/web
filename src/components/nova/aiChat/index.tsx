import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as IconArrowLeft } from 'img/light/ico_arrow_left.svg';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/store';
import { css } from 'styled-components';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_SHARE_CHAT } from '../../../api/constant';
import { FileUploadState } from '../../../constants/fileTypes';
import ico_reading_glasses_dark from '../../../img/dark/duotone_magnifying_glass_dark.svg';
import ico_documents_dark from '../../../img/dark/ico_documents.svg';
import ico_image_dark from '../../../img/dark/ico_image.svg';
import ico_reading_glasses_light from '../../../img/light/duotone_magnifying_glass.svg';
import ico_documents_light from '../../../img/light/ico_documents.svg';
import ico_image_light from '../../../img/light/ico_image.svg';
import Spinner from '../../../img/light/spinner.json';
import { lang } from '../../../locale';
import {
  deselectAllItems,
  isExportingSelector,
  isShareModeSelector,
  NovaChatType,
  NovaFileInfo,
  novaHistorySelector,
  selectAllItems,
  selectedItemsSelector,
  setIsExporting,
  setIsShareMode
} from '../../../store/slices/nova/novaHistorySlice';
import { selectPageStatus } from '../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../store/slices/tabSlice';
import { themeInfoSelector } from '../../../store/slices/theme';
import { activeToast } from '../../../store/slices/toastSlice';
import Bridge from '../../../util/bridge';
import { downloadImage } from '../../../util/downloadImage';
import IconButton from '../../buttons/IconButton';
import CheckBox from '../../CheckBox';
import { useConfirm } from '../../Confirm';
import useCopyText from '../../hooks/copyText';
import Icon from '../../Icon';
import ChatList from '../ChatList';
import { FileUploading } from '../FileUploading';
import { Guide } from '../Guide';
import { ImagePreview } from '../ImagePreview';
import InputBar, { InputBarSubmitParam } from '../inputBar';

import * as S from './style';

interface AIChatProps {
  expiredNOVA: boolean;
  setExpiredNOVA: (isExpired: boolean) => void;
  createNovaSubmitHandler: (param: InputBarSubmitParam) => Promise<void>;
  fileUploadState: FileUploadState;
}

const AIChat = (props: AIChatProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const { onCopy } = useCopyText();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const confirm = useConfirm();
  const { usingAI, creating, selectedNovaTab } = useAppSelector(selectTabSlice);
  const status = useAppSelector(selectPageStatus(selectedNovaTab));
  const novaHistory = useAppSelector(novaHistorySelector);
  const selectedItems = useAppSelector(selectedItemsSelector);
  const isShareMode = useAppSelector(isShareModeSelector);
  const isExporting = useAppSelector(isExportingSelector);
  const [inputContents, setInputContents] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<NovaFileInfo | null>(null);

  const chatListRef = useRef<HTMLDivElement>(null);
  const [showScrollDownBtn, setShowScrollDownBtn] = useState(false);

  useEffect(() => {
    if (location.state) {
      const { inputText } = location.state.body;
      setInputContents(inputText);
    }
  }, [location.state]);

  useEffect(() => {
    const handleOrientationChange = () => {
      if (chatListRef.current) {
        ShowScrollButton(chatListRef.current);
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  });

  useEffect(() => {
    if (!usingAI) {
      setImagePreview(null);
    }
  }, [usingAI]);

  const ShowScrollButton = (el: HTMLDivElement | null) => {
    if (!el) return;

    const scrollPosition = el.scrollTop;
    const totalScrollHeight = el.scrollHeight;
    const visibleHeight = el.clientHeight;
    const scrollPercentage = (scrollPosition / (totalScrollHeight - visibleHeight)) * 100;

    if (scrollPercentage <= 30) {
      setShowScrollDownBtn(true);
    } else {
      setShowScrollDownBtn(false);
    }
  };

  const onSave = async (currentChat?: NovaChatType) => {
    const imageURL = currentChat?.res;
    try {
      if (imageURL) {
        await downloadImage(imageURL);
      }
    } catch {
      dispatch(activeToast({ type: 'error', msg: 'ToastMsg.SaveFailed' }));
    }
  };

  const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
    ShowScrollButton(e.currentTarget);
  };

  const handleShareChat = async () => {
    if (isExporting) return;

    dispatch(setIsExporting(true));
    const jsonResult = novaHistory.flatMap((historyItem) => {
      const matchingItems = selectedItems.filter((item) => {
        const [, id] = item.split(':');
        return historyItem.id === id;
      });

      if (matchingItems.length === 0) return [];

      return matchingItems.map((item) => {
        const [type, id] = item.split(':');

        const resultType = type === 'q' ? 'question' : 'answer';
        const content = type === 'q' ? historyItem.input : historyItem.output;

        const files =
          resultType === 'question' ? historyItem.files?.map((file) => file.name) || [] : [];

        return {
          id,
          type: resultType,
          content: content,
          files: files
        };
      });
    });

    const groupedResult = Object.values(
      jsonResult.reduce(
        (acc, curr) => {
          const { id } = curr;
          if (!acc[id]) acc[id] = [];
          acc[id].push(curr);
          return acc;
        },
        {} as Record<string, (typeof jsonResult)[0][]>
      )
    ).flatMap((group) =>
      group.sort((a, b) => (a.type === 'question' ? -1 : 1)).map(({ id, ...rest }) => rest)
    );

    try {
      const { res } = await apiWrapper().request(NOVA_SHARE_CHAT, {
        body: JSON.stringify({
          threadId: novaHistory[novaHistory.length - 1].threadId,
          list: groupedResult
        }),
        method: 'POST'
      });
      const response = await res.json();
      const url = {
        text: `${window.location.origin}/Nova/share/${response.data.shareId}?lang=${lang}`
      };
      await Bridge.callBridgeApi('copyClipboard', JSON.stringify(url));
      dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CopyLinkCompleted`) }));
    } catch (err) {
      dispatch(activeToast({ type: 'error', msg: t(`ToastMsg.CopyFailed`) }));
    }

    dispatch(setIsExporting(false));
    dispatch(setIsShareMode(false));
    dispatch(deselectAllItems());
  };

  const PROMPT_EXAMPLE = [
    {
      src: isLightMode ? ico_reading_glasses_light : ico_reading_glasses_dark,
      txt: t(`Nova.aiChat.Guide.Example1`)
    },
    {
      src: isLightMode ? ico_image_light : ico_image_dark,
      txt: t(`Nova.aiChat.Guide.Example2`)
    },
    {
      src: isLightMode ? ico_documents_light : ico_documents_dark,
      txt: t(`Nova.aiChat.Guide.Example3`)
    }
  ];

  const handleChangeSelection = () => {
    if (selectedItems.length === novaHistory.length * 2) {
      dispatch(deselectAllItems());
    } else {
      dispatch(selectAllItems());
    }
  };

  return (
    <S.Wrap>
      <>
        {novaHistory.length < 1 ? (
          <>
            <Guide>
              {PROMPT_EXAMPLE.map((item) => (
                <S.GuideExample key={item.txt} onClick={() => setInputContents?.(item.txt)}>
                  <Icon iconSrc={item.src} size="md" />
                  <span>{item.txt}</span>
                </S.GuideExample>
              ))}
            </Guide>
          </>
        ) : (
          <>
            {isShareMode && (
              <S.ShareGuide isActive={selectedItems.length > 0}>
                <div>
                  <CheckBox
                    isChecked={selectedItems.length === novaHistory.length * 2}
                    setIsChecked={() => {}}
                    onClick={handleChangeSelection}
                    cssExt={css`
                      margin: 6px;
                    `}
                  />
                  <span>
                    {selectedItems.length === novaHistory.length * 2
                      ? t(`Nova.aiChat.SelectCancel`)
                      : t(`Nova.aiChat.SelectAll`)}
                  </span>
                </div>
                <span>{t('Index.aiChat.SelectChat', { count: selectedItems.length })!}</span>
              </S.ShareGuide>
            )}
            <ChatList
              expiredNOVA={props.expiredNOVA}
              novaHistory={novaHistory}
              onSubmit={props.createNovaSubmitHandler}
              onSave={onSave}
              scrollHandler={handleOnScroll}
              setImagePreview={setImagePreview}
              ref={chatListRef}
            />
            {showScrollDownBtn && (
              <S.ScrollDownButton>
                <IconButton
                  iconComponent={IconArrowLeft}
                  iconSize="md"
                  onClick={() => {
                    chatListRef.current?.scrollTo({
                      top: chatListRef.current?.scrollHeight,
                      behavior: 'smooth'
                    });
                  }}
                />
              </S.ScrollDownButton>
            )}
          </>
        )}
        {isShareMode ? (
          <div style={{ padding: '16px' }}>
            <S.ShareButton disabled={selectedItems.length <= 0} onClick={handleShareChat}>
              {isExporting ? (
                <Lottie animationData={Spinner} loop play style={{ width: 27, height: 27 }} />
              ) : (
                <span>{t(`Nova.aiChat.CreateLink`)}</span>
              )}
            </S.ShareButton>
          </div>
        ) : (
          <>
            <InputBar
              novaHistory={novaHistory}
              disabled={creating === 'NOVA'}
              expiredNOVA={props.expiredNOVA}
              onSubmit={props.createNovaSubmitHandler}
              contents={inputContents}
              setContents={setInputContents}
            />
            <FileUploading {...props.fileUploadState} />
          </>
        )}

        {imagePreview && novaHistory.length > 0 && (
          <ImagePreview {...imagePreview} onClose={() => setImagePreview(null)} />
        )}
      </>
    </S.Wrap>
  );
};

export default AIChat;
