import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { apiWrapper } from '../../api/apiWrapper';
import { VOICEDOC_MAKE_VOICE } from '../../api/constant';
import { ChatBottom } from '../../components/askDoc/ChatBottom';
import { ChatList } from '../../components/askDoc/ChatList';
import Button from '../../components/buttons/Button';
import { useChatAskdoc } from '../../components/hooks/useChatAskdoc';
import useLangParameterNavigate from '../../components/hooks/useLangParameterNavigate';
import Icon from '../../components/Icon';
import IconMic from '../../img/light/aiChat/mic.png';
import icon_ai from '../../img/light/ico_ai.svg';
import { AskDocChat } from '../../store/slices/askDoc';
import { filesSelector } from '../../store/slices/askDocAnalyzeFiesSlice';
import { summarySelector } from '../../store/slices/askDocSummary';
import { recognizedVoiceSelector } from '../../store/slices/recognizedVoice';
import { useAppSelector } from '../../store/store';
import Bridge from '../../util/bridge';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  height: 100%;
  background-color: var(--ai-purple-99-bg-light);
`;

const WrapperPage = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;

  position: relative;
`;

const InfoArea = styled.div`
  display: flex;
  align-items: center;

  color: var(--ai-purple-50-main);
  padding: 0px 16px;
  line-height: 100%;
  font-size: 12px;
  height: 48px;
  gap: 8px;
`;

const RecognitionArea = styled.div`
  width: 100%;
  height: 80px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const RecognitionButton = styled.div`
  width: 64px;
  height: 64px;

  background-color: white;
  border-radius: 50%;
`;

const RecognizeCover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  left: 0;
  top: 0;

  background-color: rgb(255, 255, 255, 0.8);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 25px;

  gap: 20px;
`;

const AskDoc = () => {
  const { t } = useTranslation();
  const submitAskDoc = useChatAskdoc();
  const { isTesla, isObigo } = useLangParameterNavigate();
  const { fileStatus } = useAppSelector(filesSelector);
  const { questions, summary } = useAppSelector(summarySelector);
  const recogVoiceSelector = useAppSelector(recognizedVoiceSelector);
  const [userChatText, setUserChatText] = useState('');
  const [onPlayAudio, setOnPlayAudio] = useState<HTMLAudioElement | null>(null);

  const [isActiveInput, setIsActiveInput] = useState<boolean>(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeRetry, setActiveRetry] = useState<boolean>(false);
  const [recognitionMode, setRecognitionMode] = useState<boolean>(false);
  const stopRef = useRef<AskDocChat['id'][]>([]);

  const [obigoGreeting, setObigoGreeting] = useState<boolean>(false);

  useEffect(() => {
    if (fileStatus != 'AVAILABLE') return;
    if (questions.length > 0) return;

    setLoadingId(null);
    setIsActiveInput(true);
    setActiveRetry(false);
  }, []);

  useEffect(() => {
    if (recogVoiceSelector.recognizedVoice === '') return;

    onSubmitAskdocChat('askDoc', recogVoiceSelector.recognizedVoice);
    setRecognitionMode(false);
  }, [recogVoiceSelector]);

  useEffect(() => {
    if (isObigo) {
      const greeting = t('AskDoc.Greeting');
      Bridge.callBridgeApi('textToSpeech', greeting);
      setObigoGreeting(true);
    }
  }, [isObigo]);

  useEffect(() => {
    if (obigoGreeting && summary) {
      const initComplete = t('AskDoc.InitLoadInfoContent');
      const s = t('AskDoc.Summary');
      Bridge.callBridgeApi('textToSpeech', `${initComplete} ${s} ${summary}`);
    }
  }, [obigoGreeting, summary]);

  const reqVoiceRes = async (text: string) => {
    try {
      const { res } = await apiWrapper().request(VOICEDOC_MAKE_VOICE, {
        headers: {
          'Content-Type': 'application/json'
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

  const playVoice = async (text: string) => {
    if (isTesla) {
      const resAudio = await reqVoiceRes(text);
      const audioBlob = await resAudio.blob();
      playVoiceRes(audioBlob);
    } else if (isObigo) {
      Bridge.callBridgeApi('textToSpeech', text);
    }
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
        isTesla || isObigo ? playVoice : null,
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

  const setVoiceRecognitionMode = (set: boolean) => {
    setRecognitionMode(set);
    Bridge.callBridgeApi('setVoiceRecognizeMode', JSON.stringify(set));
  };

  return (
    <WrapperPage>
      <Helmet>
        <title>Chat</title>
      </Helmet>
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
          {isObigo && (
            <RecognitionArea>
              <RecognitionButton onClick={() => setVoiceRecognitionMode(true)}>
                <img src={IconMic} alt="mic"></img>
              </RecognitionButton>
            </RecognitionArea>
          )}
          <ChatList
            loadingId={loadingId}
            setLoadingId={setLoadingId}
            isActiveRetry={activeRetry}
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
        {recognitionMode && (
          <RecognizeCover>
            <div>Recognizing...</div>
            <div>
              <Button variant="purpleGradient" onClick={() => setRecognitionMode(false)}>
                Cancel
              </Button>
            </div>
          </RecognizeCover>
        )}
      </Body>
    </WrapperPage>
  );
};

export default AskDoc;
