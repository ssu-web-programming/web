import { Dispatch, MutableRefObject, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import icon_retry from '../../img/light/ico_reanalyze.svg';
import { AskDocChat, selectAskDoc } from '../../store/slices/askDoc';
import { setCreating } from '../../store/slices/tabSlice';
import { activeToast } from '../../store/slices/toastSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Bridge from '../../util/bridge';
import Button from '../buttons/Button';
import StopButton from '../buttons/StopButton';
import useLangParameterNavigate from '../hooks/useLangParameterNavigate';
import Icon from '../Icon';

import AskDocSpeechBubble from './AskDocSpeechBubble';
import { QuestionList } from './QuestionList';

const ChatListWrapper = styled.div<{ isLoading: boolean }>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;

  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 15px;
  padding-bottom: ${({ isLoading }: { isLoading: boolean }) => (isLoading ? '0px' : '50px')};
  /* gap: 16px; */
`;

const CenterBox = styled.div`
  display: flex
  justify-content: center;

  width: 100%;
  margin: 16px 0px 50px 0px;
`;

export const ChatList = ({
  loadingId,
  setLoadingId,
  isActiveRetry,
  setIsActiveInput,
  handleClickQuestion,
  stopRef,
  onPlayAudio,
  setOnPlayAudio
}: {
  loadingId: string | null;
  setLoadingId: Dispatch<SetStateAction<string | null>>;
  isActiveRetry: boolean;
  setIsActiveInput: Dispatch<SetStateAction<boolean>>;
  handleClickQuestion: (api: 'gpt' | 'askDoc', chatText?: string) => void;
  stopRef: MutableRefObject<string[]>;
  onPlayAudio: HTMLAudioElement | null;
  setOnPlayAudio: (audio: HTMLAudioElement | null) => void;
}) => {
  const { t } = useTranslation();
  const { isTesla } = useLangParameterNavigate();
  const dispatch = useAppDispatch();

  const { askDocHistory: chatHistory, sourceId, status } = useAppSelector(selectAskDoc);

  const [cancleList, setCancleList] = useState<AskDocChat['id'][]>([]);

  const onStop = () => {
    if (stopRef.current && loadingId) {
      stopRef.current = [...stopRef.current, loadingId];
      setCancleList((prev) => [...prev, loadingId]);
      dispatch(setCreating('none'));
      setIsActiveInput(true);
      setLoadingId(null);

      dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.StopMsg`) }));
    }

    if (isTesla && onPlayAudio) {
      onPlayAudio.pause();
      setOnPlayAudio(null);
    }
  };

  return (
    <>
      <ChatListWrapper
        style={{ position: 'relative' }}
        isLoading={!!loadingId}
        onClick={() => {
          setIsActiveInput(false);
        }}
        ref={(el) => {
          if (el) {
            el.scrollTo(0, el.scrollHeight);
          }
        }}>
        <AskDocSpeechBubble
          loadingId={loadingId}
          chat={{
            id: 'greeting',
            result: t(`AskDoc.Greeting`),
            role: 'info',
            input: t(`AskDoc.Greeting`)
          }}
        />
        {!isActiveRetry && (status === 'ready' || status === 'completeAnalyze') && (
          <AskDocSpeechBubble
            loadingId={loadingId}
            chat={{
              id: 'init',
              result: '',
              role: 'info',
              input: ''
            }}>
            <QuestionList
              isLoading={!!loadingId}
              isIncludeSummary={true}
              onClick={handleClickQuestion}
            />
          </AskDocSpeechBubble>
        )}
        {chatHistory
          .filter(
            (chat) =>
              chat.role !== 'assistant' ||
              (chat.role === 'assistant' && cancleList.indexOf(chat.id) === -1)
          )
          .map((chat) => (
            <AskDocSpeechBubble
              key={chat.id}
              loadingId={loadingId}
              chat={chat}
              onMore={() => {
                handleClickQuestion('gpt', chat.input);
              }}></AskDocSpeechBubble>
          ))}
      </ChatListWrapper>
      {loadingId && loadingId !== 'init' && (
        <CenterBox>
          <StopButton onClick={onStop} />
        </CenterBox>
      )}
      {isTesla && onPlayAudio && (
        <CenterBox>
          <StopButton onClick={onStop} />
        </CenterBox>
      )}
      {isActiveRetry && (
        <CenterBox>
          <Button
            variant="white"
            width={'fit'}
            height={'fit'}
            borderType="gray"
            onClick={() => {
              if (status === 'completeAnalyze' && sourceId) {
                /* empty */
              } else if (status === 'failedConvert' || status === 'failedAnalyze') {
                setLoadingId('init');
                Bridge.callBridgeApi('reInitAskDoc', '');
              }
            }}>
            <Icon iconSrc={icon_retry} size={'sm'} />
            <div style={{ marginLeft: '4px' }}>{t('AskDoc.RetryAnalyze')}</div>
          </Button>
        </CenterBox>
      )}
    </>
  );
};
