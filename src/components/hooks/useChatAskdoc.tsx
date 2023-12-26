import { MutableRefObject, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { filesSelector } from '../../store/slices/askDocAnalyzeFiesSlice';
import { ASKDCO_ASK_QUESTION, JSON_CONTENT_TYPE } from '../../api/constant';
import useApiWrapper from '../../api/useApiWrapper';
import useErrorHandle from './useErrorHandle';
import { setCreating } from '../../store/slices/tabSlice';
import { appendChat, removeChat, updateChat } from '../../store/slices/askDoc';
import { useTranslation } from 'react-i18next';
import { activeToast } from '../../store/slices/toastSlice';
import NoCredit from '../toast/contents/NoCredit';
import { useShowCreditToast } from './useShowCreditToast';

export const useChatAskdoc = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);

  const { files } = useAppSelector(filesSelector);
  const dispatch = useAppDispatch();
  const apiWrapper = useApiWrapper();
  const errorHandle = useErrorHandle();
  const showCreditToast = useShowCreditToast();
  const { t } = useTranslation();

  const submitChat = async (
    api: 'gpt' | 'askDoc',
    assistantId: string,
    userId: string,
    userChatText: string,
    stopRef: MutableRefObject<string[]>,
    chatText?: string
  ) => {
    dispatch(
      appendChat({
        id: userId,
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

      const { res } = await apiWrapper(ASKDCO_ASK_QUESTION, {
        headers: {
          ...JSON_CONTENT_TYPE,
          'User-Agent': navigator.userAgent
        },
        body: JSON.stringify({
          fileId: files[0].fileId,
          fileRevision: files[0].fileRevision,
          question: chatText ? chatText : userChatText
        }),
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
        }
      }

      if (res.body) {
        const reader = res.body.getReader();
        let isExistPages = false;
        let arrNumbers: number[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const result = new TextDecoder('utf-8').decode(value);
          const data = result.split('data:').filter(Boolean);

          data.map((data) => {
            if (data === '<PO_ANSWER_START>' || data === '<PO_ANSWER_END>') {
              return;
            }

            if (data === '<PO_PAGENUM_START>' || data === '<PO_PAGENUM_END>') {
              isExistPages = true;
              return;
            }

            if (!isExistPages) {
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
        }

        if (stopRef.current?.indexOf(assistantId) !== -1) {
          dispatch(removeChat(assistantId));
          stopRef.current = stopRef.current?.filter((id) => id !== assistantId);
          return;
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
