import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as IconArrowLeft } from 'img/ico_arrow_left.svg';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/store';
import styled from 'styled-components';

import { apiWrapper } from '../../api/apiWrapper';
import IconButton from '../../components/buttons/IconButton';
import { useConfirm } from '../../components/Confirm';
import useSubmitHandler from '../../components/hooks/nova/useSubmitHandler';
import { useChatNova } from '../../components/hooks/useChatNova';
import ChatList from '../../components/nova/ChatList';
import { FileUploading } from '../../components/nova/FileUploading';
import { ImagePreview } from '../../components/nova/ImagePreview';
import InputBar from '../../components/nova/InputBar';
import { SearchGuide } from '../../components/nova/SearchGuide';
import { FileUpladState } from '../../constants/fileTypes';
import {
  NovaChatType,
  NovaFileInfo,
  novaHistorySelector
} from '../../store/slices/novaHistorySlice';
import { selectTabSlice } from '../../store/slices/tabSlice';
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

const GuideWrapper = styled(Container)`
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  background-color: #f4f6f8;
  overflow-y: auto;
`;

const ScrollDownButton = styled.div`
  width: 48px;
  height: 48px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0px 2px 8px 0px #0000001a;

  button {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

export default function AIChat() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const novaHistory = useAppSelector(novaHistorySelector);
  const [expiredNOVA, setExpiredNOVA] = useState<boolean>(false);
  const [inputContents, setInputContents] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<NovaFileInfo | null>(null);
  const [fileUploadState, setFileUploadState] = useState<FileUpladState>({
    type: '',
    state: 'ready',
    progress: 0
  });
  const requestor = useRef<ReturnType<typeof apiWrapper>>();
  const { creating } = useAppSelector(selectTabSlice);
  const chatListRef = useRef<HTMLDivElement>(null);
  const [showScrollDownBtn, setShowScrollDownBtn] = useState(false);

  const { createNovaSubmitHandler } = useSubmitHandler(setFileUploadState);

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
    if (location.state?.body) {
      setInputContents(location.state.body);
    }
  }, [location.state?.body]);

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
        dispatch(activeToast({ type: 'info', msg: 'Save Completed' }));
      }
    } catch {
      dispatch(activeToast({ type: 'error', msg: 'Save Failed' }));
    }
  };

  const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
    ShowScrollButton(e.currentTarget);
  };

  return (
    <Wrap>
      {novaHistory.length < 1 ? (
        <GuideWrapper>
          <SearchGuide setInputContents={setInputContents} />
        </GuideWrapper>
      ) : (
        <>
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
      <InputBar
        novaHistory={novaHistory}
        disabled={creating !== 'none'}
        expiredNOVA={expiredNOVA}
        onSubmit={createNovaSubmitHandler}
        contents={inputContents}
        setContents={setInputContents}></InputBar>
      <FileUploading
        {...fileUploadState}
        onClickBack={() => {
          requestor.current?.abort();
        }}></FileUploading>
      {imagePreview && (
        <ImagePreview {...imagePreview} onClose={() => setImagePreview(null)}></ImagePreview>
      )}
    </Wrap>
  );
}
