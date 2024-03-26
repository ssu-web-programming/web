import { Dispatch, MutableRefObject, SetStateAction, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { filesSelector } from '../../store/slices/askDocAnalyzeFiesSlice';
import { ASKDCO_ASK_QUESTION } from '../../api/constant';
import { apiWrapper } from '../../api/apiWrapper';
import useErrorHandle from './useErrorHandle';
import { setCreating } from '../../store/slices/tabSlice';
import { appendChat, removeChat, updateChat } from '../../store/slices/askDoc';
import { useTranslation } from 'react-i18next';
import { activeToast } from '../../store/slices/toastSlice';
import NoCredit from '../toast/contents/NoCredit';
import { useShowCreditToast } from './useShowCreditToast';
import useLangParameterNavigate from './useLangParameterNavigate';
import { getPlatform } from '../../util/bridge';
import TagManager from 'react-gtm-module';
import { useLocation } from 'react-router';

export const useChatAskdoc = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);

  const { files, userId } = useAppSelector(filesSelector);
  const dispatch = useAppDispatch();
  const errorHandle = useErrorHandle();
  const showCreditToast = useShowCreditToast();
  const { t } = useTranslation();
  const { isTesla } = useLangParameterNavigate();
  const location = useLocation();

  function createTagManagerArgs(eventValue: string) {
    return {
      gtmId: process.env.REACT_APP_GTM_ID,
      dataLayer: {
        user_id: userId,
        userProject: 'AskDoc',
        page: 'home',
        page_path: location.pathname,
        event: eventValue,
        OSName: getPlatform() === 'unknown' ? 'web' : getPlatform()
      }
    };
  }

  const submitChat = async (
    api: 'gpt' | 'askDoc',
    assistantId: string,
    UID: string,
    userChatText: string,
    stopRef: MutableRefObject<string[]>,
    reqVoiceRes: (text: string) => Promise<Response>,
    playVoiceRes: (res: Blob) => void,
    chatText?: string
  ) => {
    dispatch(
      appendChat({
        id: UID,
        role: 'user',
        result: chatText ? chatText : userChatText,
        input: chatText ? chatText : userChatText,
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
        input: chatText ? chatText : userChatText,
        info: {
          request: api,
          page: []
        }
      })
    );

    try {
      dispatch(setCreating('ASKDoc'));

      const { res } = await apiWrapper().request(ASKDCO_ASK_QUESTION, {
        body: {
          fileId: files[0].fileId,
          fileRevision: files[0].fileRevision,
          question: chatText ? chatText : userChatText
        },
        method: 'POST'
      });

      const leftCredit = res.headers?.get('Userinfo-Credit');
      const deductionCredit = 4;
      const contentType = res.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const response = await res?.json();

        if (response?.resultCode === 15002) {
          if (Number(leftCredit) === 0) {
            dispatch(
              activeToast({
                type: 'error',
                msg: (
                  <NoCredit>
                    <p>{t(`ToastMsg.UsedAllCredit`)}</p>
                  </NoCredit>
                )
              })
            );
            dispatch(removeChat(assistantId));
            return;
          }

          if (Number(leftCredit) < 4) {
            dispatch(
              activeToast({
                type: 'error',
                msg: (
                  <NoCredit>
                    <p>{t(`ToastMsg.NoCredit`, { credit: deductionCredit })}</p>
                  </NoCredit>
                )
              })
            );
            dispatch(removeChat(assistantId));
            return;
          }
        } else {
          if (response?.resultCode === 15308) {
            TagManager.dataLayer(createTagManagerArgs('aiservice_askdoc_engine_no_result'));
          }

          dispatch(
            activeToast({
              type: 'error',
              msg: <p>{t(`ToastMsg.ServiceErrorMsg`)}</p>
            })
          );
        }
      }

      if (res.body) {
        const reader = res.body.getReader();
        let isExistPages = false;
        let arrNumbers: number[] = [];

        let answer_tesla = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const result = new TextDecoder('utf-8').decode(value);
          const data = result.split('data:').filter(Boolean);

          data.map((data) => {
            if (
              data === '<PO_ANSWER_START>' ||
              data === '<PO_ANSWER_END>' ||
              data === '</PO_ANSWER_END>'
            ) {
              return;
            }

            if (
              data === '<PO_PAGENUM_START>' ||
              data === '<PO_PAGENUM_END>' ||
              data === '</PO_PAGENUM_END>'
            ) {
              isExistPages = true;
              return;
            }

            if (!isExistPages) {
              if (isTesla) {
                answer_tesla += data;
              } else {
                dispatch(
                  updateChat({
                    id: assistantId,
                    role: 'assistant',
                    result: data,
                    input: chatText ? chatText : userChatText,
                    info: {
                      request: api,
                      page: [...arrNumbers]
                    }
                  })
                );
              }
            }

            if (isExistPages) {
              const page = Number(data);
              if (!isNaN(page) && page != 0) {
                if (arrNumbers.length >= 5) return;
                arrNumbers.push(page);
                arrNumbers.sort();
                dispatch(
                  updateChat({
                    id: assistantId,
                    role: 'assistant',
                    result: '',
                    input: chatText ? chatText : userChatText,
                    info: {
                      request: api,
                      page: [...arrNumbers]
                    }
                  })
                );
              }
            }
          });

          const errText = data[data.length - 1];
          try {
            const json = JSON.parse(errText);
            if (json.resultCode === 15306) {
              TagManager.dataLayer(createTagManagerArgs('aiservice_askdoc_moderation_in_prompt'));
              break;
            }

            if (json.resultCode === 15307) {
              TagManager.dataLayer(createTagManagerArgs('aiservice_askdoc_moderation_in_context'));
              break;
            }
          } catch (e) {
            // do nothing
          }
        }

        if (stopRef.current?.indexOf(assistantId) !== -1) {
          dispatch(removeChat(assistantId));
          stopRef.current = stopRef.current?.filter((id) => id !== assistantId);
          return;
        }

        // 차량모드는 음성재생으로 인해 스트리밍을 지원하지 않음
        if (isTesla) {
          const resAudio = await reqVoiceRes(answer_tesla);
          const audioBlob = await resAudio.blob();
          playVoiceRes(audioBlob);

          dispatch(
            updateChat({
              id: assistantId,
              role: 'assistant',
              result: answer_tesla,
              input: chatText ? chatText : userChatText,
              info: {
                request: api,
                page: [...arrNumbers]
              }
            })
          );
        }

        setIsSuccess(true);
        showCreditToast(String(deductionCredit), leftCredit as string);
      } else {
        setIsSuccess(false);
      }
    } catch (error: any) {
      errorHandle(error);
      throw error;
    } finally {
      setIsLoading(false);
      dispatch(setCreating('none'));
    }
  };

  return { isLoading, isSuccess, submitChat };
};
