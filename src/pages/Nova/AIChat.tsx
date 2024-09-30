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
import Icon from '../../components/Icon';
import ChatList from '../../components/nova/ChatList';
import { FileUploading } from '../../components/nova/FileUploading';
import { Guide } from '../../components/nova/Guide';
import { ImagePreview } from '../../components/nova/ImagePreview';
import InputBar, { flexCenter } from '../../components/nova/InputBar';
import { FileUpladState } from '../../constants/fileTypes';
import ico_documents from '../../img/ico_documents.svg';
import ico_image from '../../img/ico_image.svg';
import {
  NovaChatType,
  NovaFileInfo,
  novaHistorySelector
} from '../../store/slices/nova/novaHistorySlice';
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

const GuideExample = styled.div`
  ${flexCenter};
  justify-content: flex-start;
  gap: 8px;
  padding: 12px;
  margin: 0 16px;
  border: 1px solid #c9cdd2;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  color: var(--gray-gray-80-02);

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
  background: white;
  box-shadow: 0 2px 8px 0 #0000001a;
  z-index: 1;

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
  const requestor = useRef<ReturnType<typeof apiWrapper>>();
  const confirm = useConfirm();
  const chatNova = useChatNova();
  const { creating } = useAppSelector(selectTabSlice);
  const novaHistory = useAppSelector(novaHistorySelector);
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
      console.log('location: ', location);
      console.log('location.state: ', location.state);
      console.log('location.state.body: ', location.state.body);
      console.log('location.state.body?.inputText: ', location.state.body?.inputText);
      setInputContents(location.state.body);
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
        dispatch(activeToast({ type: 'info', msg: 'Save Completed' }));
      }
    } catch {
      dispatch(activeToast({ type: 'error', msg: 'Save Failed' }));
    }
  };

  const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
    ShowScrollButton(e.currentTarget);
  };

  const PROMPT_EXAMPLE = [
    {
      src: ico_documents,
      txt: t(`Nova.aiChat.Guide.Example1`)
    },
    {
      src: ico_image,
      txt: t(`Nova.aiChat.Guide.Example2`)
    },
    {
      src: ico_documents,
      txt: t(`Nova.aiChat.Guide.Example3`)
    }
  ];

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
        disabled={creating == 'NOVA'}
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
