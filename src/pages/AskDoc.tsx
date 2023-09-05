import styled, { FlattenSimpleInterpolation, css } from 'styled-components';
import { useEffect, useCallback, useMemo, useRef, useState } from 'react';
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
import { ASKDOC_API, ASKDOC_INIT_QUESTION_API, JSON_CONTENT_TYPE } from '../api/constant';
import { calLeftCredit } from '../util/common';
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
  setQuestionList,
  updateChat
} from '../store/slices/askDoc';
import AskDocSpeechBubble from '../components/askDoc/AskDocSpeechBubble';
import Button from '../components/buttons/Button';
import icon_credit from '../img/ico_credit.svg';
import icon_retry from '../img/ico_reanalyze.svg';
import Bridge from '../util/bridge';
import useErrorHandle from '../components/hooks/useErrorHandle';

const TEXT_MAX_HEIGHT = 268;

const Wrapper = styled.div`
  ${flex}
  ${flexColumn}
  ${justiSpaceBetween}
  
  width: 100%;
  height: 100%;
  background-color: var(--ai-purple-99-bg-light);

  ${TableCss}
`;

const ChatListWrapper = styled.div<{ isLoading: boolean }>`
  ${flex}
  ${flexColumn}
  ${flexGrow}
  position: relative;

  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: ${({ isLoading }: { isLoading: boolean }) => (isLoading ? '0px' : '36px')};
  gap: 16px;
  padding-top: 16px;
`;

const FloatingBox = styled.div`
  ${flex}
  ${flexGrow}
  ${flexShrink}
  
  position: absolute;
  top: 0px;
  width: 100%;
  transform: translate(0, -100%);
  background-color: transparent;
`;

const InputBox = styled.div<{ activeInputWrap: boolean }>`
  ${flex}
  ${alignItemCenter}
  ${flexColumn}
  ${flexShrink}
  
  height: fit-content;
  width: 100%;
  background-color: white;
  box-shadow: 0 -2px 8px 0 rgba(111, 58, 208, 0.11);
`;

export const RowBox = styled.div<{ cssExt?: FlattenSimpleInterpolation }>`
  ${flex}
  ${justiSpaceBetween}
  ${alignItemCenter}
  width: 100%;
  gap: 6px;

  ${({ cssExt }) => cssExt && cssExt}
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

const Info = styled.div`
  ${flex}
  ${alignItemCenter}

  background-color: var(--ai-purple-99-bg-light);
  color: var(--ai-purple-50-main);
  padding: 0px 16px;
  line-height: 100%;
  font-size: 12px;
  height: 48px;
  width: 100%;
  gap: 8px;
`;

const CenterBox = styled.div`
  ${flex}
  ${justiCenter};

  width: 100%;
  margin: 16px 0px 16px 0px;
`;

const TextBox = styled(RowBox)`
  textarea {
    ${flex}
    ${justiCenter}
    ${flexGrow}

    width: fit-content;
    border: 0;
    max-height: ${TEXT_MAX_HEIGHT}px;
    height: 48px;
    padding: 14px 16px 14px 16px;

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

export interface ChatOptions {
  input: string;
}

const AskDoc = () => {
  const dispatch = useAppDispatch();
  const apiWrapper = useApiWrapper();
  const errorHandle = useErrorHandle();
  const {
    askDocHistory: chatHistory,
    questionList,
    sourceId,
    status
  } = useAppSelector(selectAskDoc);
  const { t } = useTranslation();
  const [options, setChatInput] = useState<ChatOptions>({
    input: ''
  });

  const chatTipList = useMemo(() => {
    return ['1ChatingCredit'];
  }, []);

  const { input: chatInput } = options;
  const [isActiveInput, setIsActiveInput] = useState<boolean>(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeRetry, setActiveRetry] = useState<boolean>(false);
  const [cancleList, setCancleList] = useState<AskDocChat['id'][]>([]);
  const stopRef = useRef<AskDocChat['id'][]>([]);
  const [chatTip, setChatTip] = useState<string>(
    chatTipList[Math.floor(Math.random() * chatTipList.length)]
  );

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const INIT_QUESTION_PROMPT = t('AskDoc.InitLoadQuestion');
  const INIT_DEFAULT_QUESTION = t('AskDoc.DefaultQuestion');

  useEffect(() => {
    if (isActiveInput && textRef?.current) {
      textRef.current.focus();
      handleResizeHeight();
    }
  }, [isActiveInput]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isActiveInput, loadingId]);

  useEffect(() => {
    handleResizeHeight();
  }, [chatInput]);

  const getRefPages = useCallback((contents: string) => {
    const pages = contents.match(/\[(P\d+\s*,?\s*)*\]/g)?.reduce((acc, cur) => {
      cur
        .replace(/\[|\]|p|P|\s/g, '')
        .split(',')
        .forEach((p) => acc.push(parseInt(p)));

      return acc;
    }, [] as number[]);
    return pages;
  }, []);

  const loadInitQuestion = async () => {
    const initQuestionLen = 3;

    if (!status) return;

    setLoadingId('init');
    dispatch(setCreating('ASKDoc'));
    setIsActiveInput(false);
    setActiveRetry(false);

    try {
      const { res } = await apiWrapper(ASKDOC_INIT_QUESTION_API, {
        headers: {
          ...JSON_CONTENT_TYPE,
          'User-Agent': navigator.userAgent
        },
        body: JSON.stringify({
          sourceId: sourceId,
          prompt: INIT_QUESTION_PROMPT
        }),
        method: 'POST'
      });
      const resultJson = await res.json();

      if (res.status !== 200) {
        if (res.status === 400) throw new Error(GPT_EXCEEDED_LIMIT);
        else throw res;
      }

      if (resultJson?.data?.contents) {
        const reg = /\d+\./;
        const result = resultJson.data.contents
          .split(reg)
          .filter((res: string) => res !== ' ' && res.length > 0)
          .slice(0, initQuestionLen - 1);
        dispatch(setQuestionList([INIT_DEFAULT_QUESTION, ...result]));
      }

      setLoadingId(null);
      dispatch(setCreating('none'));
      setIsActiveInput(true);
      setActiveRetry(false);
    } catch (error: any) {
      errorHandle(error);
      setIsActiveInput(false);
      setActiveRetry(true);
    } finally {
      dispatch(setCreating('none'));
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
        if (sourceId && questionList.length <= 0) loadInitQuestion();
        break;
    }
  }, [status]);

  const handleResizeHeight = () => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = textRef.current.scrollHeight + 'px';
    }
  };

  const validCheckSubmit = () => {
    if (chatInput.length > 0) return true;
    return false;
  };

  const submitPreprocessing = async (api: 'gpt' | 'askDoc', chatText?: string) => {
    const assistantId = uuidv4();
    const userId = uuidv4();

    dispatch(setCreating('ASKDoc'));

    setLoadingId(assistantId);
    setActiveRetry(false);

    handleResizeHeight();
    if (textRef.current) textRef.current.style.height = 'auto';

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

      const parsedRefPages = getRefPages(contents);
      let mergedRefPages = refs;
      if (parsedRefPages && refs) {
        mergedRefPages = Array.from(new Set([...parsedRefPages, ...refs]));
      }

      dispatch(
        updateChat({
          id: assistantId,
          role: 'assistant',
          result: contents,
          input: chatText ? chatText : chatInput,
          info: {
            request: api,
            page: mergedRefPages
          }
        })
      );

      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
      dispatch(
        activeToast({
          type: 'info',
          msg: t(`ToastMsg.StartCreating`, {
            deductionCredit: deductionCredit,
            leftCredit: leftCredit === '-1' ? t('Unlimited') : leftCredit
          })
        })
      );

      setChatInput({ input: '' });
      setLoadingId(null);
    } catch (error: any) {
      errorHandle(error);

      const assistantResult = chatHistory?.filter((history) => history.id === assistantId)[0]
        ?.result;
      if (!assistantResult || assistantResult?.length === 0) {
        dispatch(removeChat(userId));
        dispatch(removeChat(assistantId));
        setIsActiveInput(true);

        if (chatInput) {
          setChatInput({ input: chatInput });
        }
      }
      setLoadingId(null);
    } finally {
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
    <WrapperPage>
      <Header title={t('AITools')} subTitle={'ASK Doc'}></Header>
      <Body>
        <Wrapper>
          <ChatListWrapper
            style={{ position: 'relative' }}
            isLoading={loadingId ? true : false}
            onClick={(e) => {
              setIsActiveInput(false);
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
                    submitPreprocessing('gpt', chat.input);
                  }}></AskDocSpeechBubble>
              ))}
            <div ref={chatEndRef}></div>
          </ChatListWrapper>
          {loadingId && loadingId !== 'init' && (
            <CenterBox>
              <StopButton
                onClick={() => {
                  stopRef.current = [...stopRef.current, loadingId];
                  setCancleList((prev) => [...prev, loadingId]);
                  dispatch(setCreating('none'));
                  setIsActiveInput(true);
                  setLoadingId(null);

                  dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.StopMsg`) }));
                }}
              />
            </CenterBox>
          )}
          {activeRetry && (
            <CenterBox>
              <Button
                variant="white"
                width={'fit'}
                height={'fit'}
                borderType="gray"
                onClick={() => {
                  if (status === 'completeAnalyze' && sourceId) {
                    loadInitQuestion();
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
          <div style={{ position: 'relative', display: 'flex' }}>
            <FloatingBox>
              {!loadingId && !isActiveInput && (
                <Info>
                  <div
                    style={{
                      display: 'flex',
                      width: '16px',
                      height: '20px',
                      marginRight: '6px'
                    }}>
                    <Icon iconSrc={icon_ai} />
                  </div>
                  {t(`AskDoc.TipList.${chatTip}`)}
                </Info>
              )}
            </FloatingBox>

            <InputBox
              activeInputWrap={isActiveInput && !loadingId}
              style={{ position: 'relative', display: 'flex' }}>
              <TextBox
                onClick={() => {
                  setIsActiveInput(true);
                }}>
                <TextArea
                  disable={loadingId !== null}
                  placeholder={!loadingId ? placeholder : ''}
                  textRef={textRef}
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
                    setChatInput({ input: e.target.value.slice(0, INPUT_MAX_LENGTH) });
                  }}
                />
                {!loadingId && isActiveInput && (
                  <SendCoinButton
                    disabled={!validCheckSubmit()}
                    onClick={() => {
                      if (validCheckSubmit()) {
                        setIsActiveInput(false);
                        submitPreprocessing('askDoc');
                      }
                    }}
                  />
                )}
              </TextBox>
              {!loadingId && isActiveInput && (
                <InputBottomArea>
                  <LengthWrapper isError={chatInput.length >= INPUT_MAX_LENGTH}>
                    {chatInput.length}/{INPUT_MAX_LENGTH}
                  </LengthWrapper>
                </InputBottomArea>
              )}
            </InputBox>
          </div>
        </Wrapper>
      </Body>
    </WrapperPage>
  );
};

export default AskDoc;
