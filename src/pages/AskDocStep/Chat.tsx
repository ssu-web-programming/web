import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../store/store';
import { v4 as uuidv4 } from 'uuid';
import { ChatList } from '../../components/askDoc/ChatList';
import { ChatBottom } from '../../components/askDoc/ChatBottom';

import {
  TableCss,
  flexColumn,
  justiSpaceBetween,
  flex,
  alignItemCenter
} from '../../style/cssCommon';
import { AskDocChat, removeChat, selectAskDoc } from '../../store/slices/askDoc';
import { summarySelector } from '../../store/slices/askDocSummary';
import { filesSelector } from '../../store/slices/askDocAnalyzeFiesSlice';
import { useChatAskdoc } from '../../components/hooks/useChatAskdoc';
import useLangParameterNavigate from '../../components/hooks/useLangParameterNavigate';
import Icon from '../../components/Icon';
import icon_ai from '../../img/ico_ai.svg';
import { useTranslation } from 'react-i18next';
import { JSON_CONTENT_TYPE, VOICEDOC_MAKE_VOICE } from '../../api/constant';
import useApiWrapper from '../../api/useApiWrapper';

const Wrapper = styled.div`
  ${flex}
  ${flexColumn}
  ${justiSpaceBetween}
  
  width: 100%;
  height: 100%;
  background-color: var(--ai-purple-99-bg-light);

  ${TableCss}
`;

const WrapperPage = styled.div`
  ${flex}
  ${flexColumn}
  
  width: 100%;
  height: 100%;
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;
`;

const InfoArea = styled.div`
  ${flex}
  ${alignItemCenter}

  color: var(--ai-purple-50-main);
  padding: 0px 16px;
  line-height: 100%;
  font-size: 12px;
  height: 48px;
  gap: 8px;
`;

const AskDoc = () => {
  const { t } = useTranslation();
  const apiWrapper = useApiWrapper();
  const submitAskDoc = useChatAskdoc();
  const { isTesla } = useLangParameterNavigate();
  const { askDocHistory: chatHistory } = useAppSelector(selectAskDoc);
  const { fileStatus } = useAppSelector(filesSelector);
  const { questions } = useAppSelector(summarySelector);
  const [userChatText, setUserChatText] = useState('');
  const [onPlayAudio, setOnPlayAudio] = useState<HTMLAudioElement | null>(null);

  const [isActiveInput, setIsActiveInput] = useState<boolean>(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeRetry, setActiveRetry] = useState<boolean>(false);
  const stopRef = useRef<AskDocChat['id'][]>([]);

  useEffect(() => {
    if (fileStatus != 'AVAILABLE') return;
    if (questions.length > 0) return;

    setLoadingId(null);
    setIsActiveInput(true);
    setActiveRetry(false);
  }, []);

  const reqVoiceRes = async (text: string) => {
    try {
      const { res } = await apiWrapper(VOICEDOC_MAKE_VOICE, {
        headers: {
          ...JSON_CONTENT_TYPE,
          'User-Agent': navigator.userAgent
        },
        body: JSON.stringify({
          speaker: 'vara',
          text: text
        }),
        method: 'POST'
      });

      return res;
    } catch (err) {
      throw new Error('Error in Make Voice');
    }
  };

  const playVoiceRes = (res: Blob) => {
    const url = window.URL.createObjectURL(res);
    const audioBlob = new Audio(url);
    audioBlob.addEventListener('ended', () => setOnPlayAudio(null));
    setOnPlayAudio(audioBlob);
    audioBlob.play();
  };

  const onSubmitAskdocChat = async (api: 'gpt' | 'askDoc', chatText?: string) => {
    const assistantId = uuidv4();
    const userId = uuidv4();

    setLoadingId(assistantId);
    setActiveRetry(false);

    try {
      await submitAskDoc.submitChat(
        api,
        assistantId,
        userId,
        userChatText,
        stopRef,
        reqVoiceRes,
        playVoiceRes,
        chatText
      );

      setUserChatText('');
      setLoadingId(null);
      setIsActiveInput(isTesla);
    } catch (error: any) {
      setIsActiveInput(true);
      setLoadingId(null);
    }
  };

  return (
    <WrapperPage>
      <Body>
        <Wrapper>
          {isTesla && (
            <ChatBottom
              loadingId={loadingId}
              isActiveInput={isActiveInput}
              setIsActiveInput={setIsActiveInput}
              chatInput={userChatText}
              onSubmitAskdocChat={onSubmitAskdocChat}
              setChatInput={setUserChatText}
            />
          )}
          <ChatList
            loadingId={loadingId}
            setLoadingId={setLoadingId}
            isActiveRetry={activeRetry}
            isIncludeSummary={true}
            setIsActiveInput={setIsActiveInput}
            handleClickQuestion={onSubmitAskdocChat}
            stopRef={stopRef}
            onPlayAudio={onPlayAudio}
            setOnPlayAudio={setOnPlayAudio}
          />
          {!isTesla && (
            <ChatBottom
              loadingId={loadingId}
              isActiveInput={isActiveInput}
              setIsActiveInput={setIsActiveInput}
              chatInput={userChatText}
              onSubmitAskdocChat={onSubmitAskdocChat}
              setChatInput={setUserChatText}
            />
          )}
          {isTesla && (
            <InfoArea>
              <Icon iconSrc={icon_ai} />
              {t(`AskDoc.TipList.1VoiceCredit`)}
            </InfoArea>
          )}
        </Wrapper>
      </Body>
    </WrapperPage>
  );
};

export default AskDoc;
