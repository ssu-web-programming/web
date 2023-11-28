import styled, { css } from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import TextArea from '../components/TextArea';
import { useAppDispatch, useAppSelector } from '../store/store';
import { v4 as uuidv4 } from 'uuid';
import { RowWrapBox } from '../components/chat/RecommendBox/ChatRecommend';
import { activeToast } from '../store/slices/toastSlice';
import icon_ai from '../img/ico_ai.svg';
import Icon from '../components/Icon';
import StopButton from '../components/buttons/StopButton';
import {
  TableCss,
  justiCenter,
  flexColumn,
  flexGrow,
  flexShrink,
  alignItemCenter,
  justiSpaceBetween,
  flex,
  justiStart
} from '../style/cssCommon';
import { setCreating } from '../store/slices/tabSlice';
import { ASKDOC_API, JSON_CONTENT_TYPE, VOICEDOC_MAKE_VOICE } from '../api/constant';
import { calLeftCredit, parseRefPages, removeRefPages } from '../util/common';
import useApiWrapper from '../api/useApiWrapper';
import { useTranslation } from 'react-i18next';
import { GPT_EXCEEDED_LIMIT } from '../error/error';
import SendCoinButton from '../components/buttons/SendCoinButton';
import Header from '../components/layout/Header';
import {
  AskDocChat,
  INPUT_MAX_LENGTH,
  appendChat,
  removeChat,
  selectAskDoc,
  updateChat
} from '../store/slices/askDoc';
import AskDocSpeechBubble from '../components/askDoc/AskDocSpeechBubble';
import Button from '../components/buttons/Button';
import icon_credit from '../img/ico_credit.svg';
import icon_retry from '../img/ico_reanalyze.svg';
import Bridge from '../util/bridge';
import useErrorHandle from '../components/hooks/useErrorHandle';
import useLoadInitQuestion from '../components/hooks/useLoadInitQuestion';

import AudioInit from '../audio/init.mpga';
import AudioCompleteAnalyze from '../audio/completeAnalyze.mpga';
import { useShowCreditToast } from '../components/hooks/useShowCreditToast';

const TEXT_MAX_HEIGHT = 268;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  ${flex}
  ${flexColumn}
`;

const Body = styled.div`
  flex: 1;
  overflow: auto;

  ${flex}
  ${flexColumn}

  background-color: var(--ai-purple-99-bg-light);

  padding-top: 5px;

  gap: 5px;
`;

const InputArea = styled.div<{ focus: boolean }>`
  height: 80px;
  position: relative;

  padding: 0px 5px;

  ${({ focus }) =>
    focus &&
    css`
      z-index: 10;
    `}
`;

const InputBox = styled.div`
  ${flex}
  ${alignItemCenter}
  ${flexColumn}
  ${flexShrink}
  
  border-radius: 8px;

  height: fit-content;
  width: 100%;
  background-color: white;
  box-shadow: 0 -2px 8px 0 rgba(111, 58, 208, 0.11);
`;

const ChatArea = styled.div`
  flex: 1;

  ${flex}
  ${flexColumn}

  
  overflow: auto;
`;

const ChatWrapper = styled.div`
  ${flex}
  ${flexColumn}
  ${justiSpaceBetween}
  
  width: 100%;
  height: 100%;

  ${TableCss}
`;

const ChatListWrapper = styled.div<{ isLoading: boolean }>`
  ${flex}
  ${flexColumn}
  ${flexGrow}

  gap: 5px;

  position: relative;

  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 5px 0px;
`;

const LengthWrapper = styled.div<{ isError?: boolean }>`
  ${flex}
  ${alignItemCenter}

  font-size: 12px;
  color: var(--gray-gray-70);

  ${({ isError }) =>
    isError !== undefined &&
    css`
      color: ${isError ? 'var(--sale)' : 'var(--gray-gray-70)'};
    `}
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

const CenterBox = styled.div`
  ${flex}
  ${justiCenter};

  width: 100%;
  margin: 16px 0px 16px 0px;
`;

const TextBox = styled.div`
  ${flex}
  ${justiSpaceBetween}
  ${alignItemCenter}
  width: 100%;
  gap: 6px;

  textarea {
    ${flex}
    ${justiCenter}
    ${flexGrow}

    width: fit-content;
    border: 0;
    max-height: ${TEXT_MAX_HEIGHT}px;
    height: 48px;
    padding: 14px 16px 14px 16px;

    border-radius: 8px;

    &:disabled {
      background-color: #fff;
      font-size: 13px;
    }
  }
`;

const InputBottomArea = styled(RowWrapBox)`
  height: 34px;
  padding: 0px 3px 0px 9px;
  border-top: 1px solid var(--ai-purple-99-bg-light);
`;

const VoiceDoc = () => {
  const dispatch = useAppDispatch();
  const apiWrapper = useApiWrapper();
  const errorHandle = useErrorHandle();
  const showCreditToast = useShowCreditToast();
  const loadInitQuestion = useLoadInitQuestion();
  const { askDocHistory, questionList, sourceId, status } = useAppSelector(selectAskDoc);
  const { t } = useTranslation();
  const [chatInput, setChatInput] = useState<string>('');

  const [isActiveInput, setIsActiveInput] = useState<boolean>(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [onPlayAudio, setOnPlayAudio] = useState<HTMLAudioElement | null>(null);
  const [activeRetry, setActiveRetry] = useState<boolean>(false);
  const [cancleList, setCancleList] = useState<AskDocChat['id'][]>([]);
  const stopRef = useRef<AskDocChat['id'][]>([]);

  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isActiveInput && textRef?.current && loadingId === null) {
      textRef.current.focus();
    }
  }, [isActiveInput, loadingId]);

  useEffect(() => {
    new Audio(AudioInit).play();
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

  const onLoadInitQuestion = async () => {
    setLoadingId('init');
    setIsActiveInput(false);
    setActiveRetry(false);

    try {
      await loadInitQuestion(sourceId);

      setLoadingId(null);
      setIsActiveInput(true);
      setActiveRetry(false);

      new Audio(AudioCompleteAnalyze).play();
    } catch (error: any) {
      setIsActiveInput(false);
      setActiveRetry(true);
    }
  };

  useEffect(() => {
    if (questionList.length > 0) return;

    setLoadingId('init');
    setIsActiveInput(false);

    switch (status) {
      case 'failedConvert':
        dispatch(activeToast({ type: 'error', msg: t('AskDoc.FailedConvert') }));
        setIsActiveInput(false);
        setActiveRetry(false);
        break;
      case 'failedAnalyze':
        dispatch(
          activeToast({
            type: 'error',
            msg: t('AskDoc.FailedAnalyze')
          })
        );
        setIsActiveInput(false);
        setActiveRetry(true);
        break;
      case 'ready':
        setLoadingId('init');
        break;
      case 'completeAnalyze':
        if (sourceId && questionList.length <= 0) onLoadInitQuestion();
        break;
    }
  }, [status]);

  const validCheckSubmit = () => {
    if (chatInput.length > 0) return true;
    return false;
  };

  const submitPreprocessing = async (api: 'gpt' | 'askDoc', chatText?: string) => {
    const assistantId = uuidv4();
    const userId = uuidv4();

    dispatch(setCreating('ASKDoc'));

    setChatInput('');
    setLoadingId(assistantId);
    setActiveRetry(false);

    dispatch(
      appendChat({
        id: userId,
        role: 'user',
        result: chatText ? chatText : chatInput,
        input: chatText ? chatText : chatInput,
        info: {
          request: api
        }
      })
    );
    dispatch(
      appendChat({
        id: assistantId,
        role: 'assistant',
        result: '',
        input: chatText ? chatText : chatInput,
        info: {
          request: api,
          page: []
        }
      })
    );

    let splunk = null;

    try {
      let { res, logger } = await apiWrapper(ASKDOC_API, {
        headers: {
          ...JSON_CONTENT_TYPE,
          'User-Agent': navigator.userAgent
        },
        body: JSON.stringify({
          sourceId: sourceId,
          history: [
            {
              content: chatText ? chatText : chatInput,
              role: 'user',
              preProcessing: {
                type: api === 'askDoc' ? 'document_chat' : 'document_chat_gpt'
              }
            }
          ]
        }),
        method: 'POST'
      });
      splunk = logger;

      if (stopRef.current?.indexOf(assistantId) !== -1) {
        dispatch(removeChat(assistantId));
        stopRef.current = stopRef.current?.filter((id) => id !== assistantId);
        return;
      }

      const resultJson = await res.json();

      if (res.status !== 200) {
        if (res.status === 400) throw new Error(GPT_EXCEEDED_LIMIT);
        else throw res;
      }

      const {
        data: {
          data: { contents, refs }
        }
      } = resultJson;

      const parsedRefPages = parseRefPages(contents);
      const result = removeRefPages(contents);
      let mergedRefPages = refs;
      if (parsedRefPages && refs) {
        mergedRefPages = Array.from(new Set([...parsedRefPages, ...refs]));
      }

      const resAudio = await reqVoiceRes(result);
      const audioBlob = await resAudio.blob();
      playVoiceRes(audioBlob);

      dispatch(
        updateChat({
          id: assistantId,
          role: 'assistant',
          result,
          input: chatText ? chatText : chatInput,
          info: {
            request: api,
            page: mergedRefPages
          }
        })
      );

      const { deductionCredit: answerDeductionCredit } = calLeftCredit(res.headers);
      const { deductionCredit: audioDeductionCredit, leftCredit } = calLeftCredit(resAudio.headers);
      showCreditToast(
        `${parseInt(answerDeductionCredit) + parseInt(audioDeductionCredit)}`,
        leftCredit
      );

      setLoadingId(null);
    } catch (error: any) {
      errorHandle(error);

      const assistantResult = askDocHistory?.filter((history) => history.id === assistantId)[0]
        ?.result;
      if (!assistantResult || assistantResult?.length === 0) {
        dispatch(removeChat(userId));
        dispatch(removeChat(assistantId));
      }
      setLoadingId(null);
    } finally {
      setIsActiveInput(true);
      dispatch(setCreating('none'));
      if (splunk) {
        splunk({
          dp: 'ai.askdoc',
          el: 'chat_askdoc'
        });
      }
    }
  };

  const placeholder = useMemo(() => t(`ChatingTab.InputPlaceholder`), [t]);

  return (
    <Wrapper>
      <Header title={t('AITools')} subTitle={'ASK Doc'}></Header>
      <Body>
        <InputArea focus={isActiveInput}>
          <InputBox>
            <TextBox onClick={() => setIsActiveInput(true)}>
              <TextArea
                disable={loadingId !== null}
                placeholder={!loadingId ? placeholder : ''}
                textRef={textRef}
                resize={true}
                rows={1}
                value={loadingId !== null ? '' : chatInput}
                onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    if (validCheckSubmit()) {
                      setIsActiveInput(false);
                      submitPreprocessing('askDoc');
                    } else {
                      e.preventDefault();
                    }
                  }
                }}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setChatInput(e.target.value.slice(0, INPUT_MAX_LENGTH));
                }}
              />
              <SendCoinButton
                disabled={!validCheckSubmit()}
                onClick={() => {
                  if (validCheckSubmit()) {
                    setIsActiveInput(false);
                    submitPreprocessing('askDoc');
                  }
                }}
              />
            </TextBox>
            <InputBottomArea>
              <LengthWrapper isError={chatInput.length >= INPUT_MAX_LENGTH}>
                {chatInput.length}/{INPUT_MAX_LENGTH}
              </LengthWrapper>
              <Button
                variant="white"
                width={'fit'}
                height={'fit'}
                borderType="none"
                disable={!activeRetry}
                onClick={() => {
                  if (status === 'completeAnalyze' && sourceId) {
                    onLoadInitQuestion();
                  } else if (status === 'failedConvert' || status === 'failedAnalyze') {
                    setLoadingId('init');
                    Bridge.callBridgeApi('reInitAskDoc', '');
                  }
                }}>
                <Icon iconSrc={icon_retry} size={'sm'} />
                <div style={{ marginLeft: '4px' }}>{t('AskDoc.RetryAnalyze')}</div>
              </Button>
            </InputBottomArea>
          </InputBox>
        </InputArea>
        <ChatArea>
          <ChatWrapper>
            <ChatListWrapper
              ref={(el) => {
                if (el) el.scrollTo(0, el.scrollHeight);
              }}
              isLoading={loadingId ? true : false}
              onClick={() => setIsActiveInput(false)}>
              <AskDocSpeechBubble
                loadingId={loadingId}
                chat={{
                  id: 'greeting',
                  result: t(`AskDoc.Greeting`),
                  role: 'info',
                  input: t(`AskDoc.Greeting`)
                }}
              />
              {!activeRetry && (status === 'ready' || status === 'completeAnalyze') && (
                <AskDocSpeechBubble
                  loadingId={loadingId}
                  chat={{
                    id: 'init',
                    result: '',
                    role: 'info',
                    input: ''
                  }}>
                  {questionList?.length > 0 && (
                    <>
                      <div
                        style={{
                          color: 'var(--ai-purple-50-main)',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}>
                        {t('AskDoc.InitLoadInfoMention')}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          height: '100%',
                          width: '100%'
                        }}>
                        {questionList?.map((q) => (
                          <Button
                            disable={loadingId !== null}
                            key={q}
                            width={'full'}
                            height={'full'}
                            variant="gray"
                            cssExt={css`
                              ${justiStart}
                            `}
                            onClick={() => {
                              submitPreprocessing('askDoc', q);
                            }}>
                            <div style={{ display: 'flex' }}>
                              <div style={{ margin: '0px 6px', height: '100%' }}>
                                <Icon size={'sm'} iconSrc={icon_credit} />
                              </div>
                              <div style={{ textAlign: 'left' }}>{q}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </AskDocSpeechBubble>
              )}
              {askDocHistory
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
                      submitPreprocessing('gpt', chat.input);
                    }}></AskDocSpeechBubble>
                ))}
            </ChatListWrapper>
            {((loadingId && loadingId !== 'init') || onPlayAudio) && (
              <CenterBox>
                <StopButton
                  onClick={() => {
                    if (loadingId && loadingId !== 'init') {
                      stopRef.current = [...stopRef.current, loadingId];
                      setCancleList((prev) => [...prev, loadingId]);
                      dispatch(setCreating('none'));
                      setIsActiveInput(true);
                      setLoadingId(null);

                      dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.StopMsg`) }));
                    } else if (onPlayAudio) {
                      onPlayAudio.pause();
                      setOnPlayAudio(null);
                    }
                  }}
                />
              </CenterBox>
            )}
          </ChatWrapper>
        </ChatArea>
        <InfoArea>
          <Icon iconSrc={icon_ai} />
          {t(`AskDoc.TipList.1VoiceCredit`)}
        </InfoArea>
      </Body>
    </Wrapper>
  );
};

export default VoiceDoc;
