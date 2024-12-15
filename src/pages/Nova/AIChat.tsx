import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as IconArrowLeft } from 'img/light/ico_arrow_left.svg';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/store';
import styled, { css } from 'styled-components';

import { apiWrapper } from '../../api/apiWrapper';
import { NOVA_SHARE_CHAT } from '../../api/constant';
import IconButton from '../../components/buttons/IconButton';
import CheckBox from '../../components/CheckBox';
import { useConfirm } from '../../components/Confirm';
import useCopyText from '../../components/hooks/copyText';
import useSubmitHandler from '../../components/hooks/nova/useSubmitHandler';
import { useChatNova } from '../../components/hooks/useChatNova';
import Icon from '../../components/Icon';
import ChatList from '../../components/nova/ChatList';
import { FileUploading } from '../../components/nova/FileUploading';
import { Guide } from '../../components/nova/Guide';
import { ImagePreview } from '../../components/nova/ImagePreview';
import InputBar, { flexCenter } from '../../components/nova/InputBar';
import { FileUpladState } from '../../constants/fileTypes';
import ico_documents_dark from '../../img/dark/ico_documents.svg';
import ico_image_dark from '../../img/dark/ico_image.svg';
import ico_documents_light from '../../img/light/ico_documents.svg';
import ico_image_light from '../../img/light/ico_image.svg';
import Spinner from '../../img/light/spinner.json';
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
} from '../../store/slices/nova/novaHistorySlice';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { themeInfoSelector } from '../../store/slices/theme';
import { activeToast } from '../../store/slices/toastSlice';
import { downloadImage } from '../../util/downloadImage';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Wrap = styled(Container)`
  flex-direction: column;
`;

const GuideExample = styled.div`
  ${flexCenter};
  justify-content: flex-start;
  gap: 8px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.color.borderGray01};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.text.subGray03};
  background-color: ${({ theme }) => theme.color.subBgGray01};

  &:hover {
    cursor: pointer;
  }
`;

const ScrollDownButton = styled.div`
  width: 48px;
  height: 48px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 126px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px 0 #0000001a;
  z-index: 1;

  button {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const ShareButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 12px;
  border-radius: 8px;
  color: ${({ disabled }) => (disabled ? 'var(--gray-gray-60-03)' : 'white')};
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  background-color: ${({ disabled }) => (disabled ? 'f2f4f6' : 'var(--ai-purple-50-main)')};
  cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};
`;

const ShareGuide = styled.div<{ isActive: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: ${({ theme, isActive }) => (isActive ? theme.color.mainBg : theme.color.subBgGray01)};
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  text-align: center;
  color: ${({ theme, isActive }) =>
    isActive ? theme.color.text.highlightText : theme.color.text.subGray02};
  border: 1px solid ${({ theme }) => theme.color.borderGray02};

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme, isActive }) =>
      isActive ? theme.color.text.highlightText02 : theme.color.text.subGray03};
  }
`;

export default function AIChat() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const { onCopy } = useCopyText();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const { creating } = useAppSelector(selectTabSlice);
  const novaHistory = useAppSelector(novaHistorySelector);
  const selectedItems = useAppSelector(selectedItemsSelector);
  const isShareMode = useAppSelector(isShareModeSelector);
  const isExporting = useAppSelector(isExportingSelector);
  const [expiredNOVA, setExpiredNOVA] = useState<boolean>(false);
  const [inputContents, setInputContents] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<NovaFileInfo | null>(null);
  const [fileUploadState, setFileUploadState] = useState<FileUpladState>({
    type: '',
    state: 'ready',
    progress: 0
  });
  const { createNovaSubmitHandler } = useSubmitHandler({ setFileUploadState, setExpiredNOVA });
  const chatListRef = useRef<HTMLDivElement>(null);
  const [showScrollDownBtn, setShowScrollDownBtn] = useState(false);

  useEffect(() => {
    if (expiredNOVA) {
      confirm({
        title: '',
        msg: t('Nova.Alert.ExpiredNOVA'),
        onOk: {
          text: t(`Confirm`),
          callback: () => {
            setExpiredNOVA(false);
            chatNova.newChat();
          }
        }
      });
    }
  }, [expiredNOVA, t, confirm, chatNova]);

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
    dispatch(setIsExporting(true));
    const jsonResult = selectedItems.map((item) => {
      const threadItems = item.split(':');
      const type = threadItems[0];
      const id = threadItems[1];

      const matchedItem = novaHistory.find((historyItem) => historyItem.id === id);
      if (!matchedItem) {
        console.error(`No matching item found for id: ${id}`);
        return null;
      }

      const resultType = type === 'q' ? 'question' : 'answer';
      const content = type === 'q' ? matchedItem.input : matchedItem.output;
      const files = matchedItem.files ? matchedItem.files.map((file) => file.name) : [];

      return {
        type: resultType,
        content: content,
        files: resultType === 'question' ? files : []
      };
    });

    const { res } = await apiWrapper().request(NOVA_SHARE_CHAT, {
      body: JSON.stringify({
        threadId: novaHistory[novaHistory.length - 1].threadId,
        list: jsonResult
      }),
      method: 'POST'
    });
    const response = await res.json();
    const searchParams = new URLSearchParams(location.search);
    const fullUrl = `${window.location.origin}/Nova/share/${response.data.shareId}?${searchParams.toString()}`;
    onCopy(fullUrl).then(() => {
      dispatch(setIsExporting(false));
      dispatch(setIsShareMode(false));
      dispatch(deselectAllItems());
      dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CopyLinkCompleted`) }));
    });
  };

  const PROMPT_EXAMPLE = [
    {
      src: isLightMode ? ico_documents_light : ico_documents_dark,
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
    <Wrap>
      {novaHistory.length < 1 ? (
        <>
          <Guide>
            {PROMPT_EXAMPLE.map((item) => (
              <GuideExample key={item.txt} onClick={() => setInputContents?.(item.txt)}>
                <Icon iconSrc={item.src} size="md" />
                <span>{item.txt}</span>
              </GuideExample>
            ))}
          </Guide>
        </>
      ) : (
        <>
          {isShareMode && (
            <ShareGuide isActive={selectedItems.length > 0}>
              <div>
                <CheckBox
                  isChecked={selectedItems.length === novaHistory.length * 2}
                  setIsChecked={() => {}}
                  onClick={handleChangeSelection}
                  cssExt={css`
                    margin: 6px;
                  `}
                />
                <span>{t(`Nova.aiChat.SelectAll`)}</span>
              </div>
              <span>{t('Nova.aiChat.SelectChat', { count: selectedItems.length })!}</span>
            </ShareGuide>
          )}
          <ChatList
            expiredNOVA={expiredNOVA}
            novaHistory={novaHistory}
            onSubmit={createNovaSubmitHandler}
            onSave={onSave}
            scrollHandler={handleOnScroll}
            setImagePreview={setImagePreview}
            ref={chatListRef}
          />
          {creating === 'none' && showScrollDownBtn && (
            <ScrollDownButton>
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
            </ScrollDownButton>
          )}
        </>
      )}
      {isShareMode ? (
        <div style={{ padding: '16px' }}>
          <ShareButton disabled={selectedItems.length <= 0} onClick={handleShareChat}>
            {isExporting ? (
              <Lottie animationData={Spinner} loop play style={{ width: 27, height: 27 }} />
            ) : (
              <span>{t(`Nova.aiChat.CreateLink`)}</span>
            )}
          </ShareButton>
        </div>
      ) : (
        <>
          <InputBar
            novaHistory={novaHistory}
            disabled={creating == 'NOVA'}
            expiredNOVA={expiredNOVA}
            onSubmit={createNovaSubmitHandler}
            contents={inputContents}
            setContents={setInputContents}></InputBar>
          <FileUploading {...fileUploadState}></FileUploading>
        </>
      )}

      {imagePreview && novaHistory.length > 0 && (
        <ImagePreview {...imagePreview} onClose={() => setImagePreview(null)}></ImagePreview>
      )}
    </Wrap>
  );
}
