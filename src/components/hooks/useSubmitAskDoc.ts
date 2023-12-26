import { useAppDispatch, useAppSelector } from '../../store/store';
import { setCreating } from '../../store/slices/tabSlice';
import { appendChat, removeChat, updateChat } from '../../store/slices/askDoc';
import useApiWrapper from '../../api/useApiWrapper';
import { ASKDOC_API, JSON_CONTENT_TYPE } from '../../api/constant';
import { calLeftCredit, parseRefPages } from '../../util/common';
import { activeToast } from '../../store/slices/toastSlice';
import { useTranslation } from 'react-i18next';
import { GPT_EXCEEDED_LIMIT } from '../../error/error';
import useErrorHandle from './useErrorHandle';
import { selectAskDoc } from '../../store/slices/askDoc';

const useSubmitAskdoc = () => {
  const dispatch = useAppDispatch();
  const apiWrapper = useApiWrapper();
  const errorHandle = useErrorHandle();
  const { t } = useTranslation();
  const { askDocHistory: chatHistory, sourceId } = useAppSelector(selectAskDoc);

  return async (
    api: 'gpt' | 'askDoc',
    assistantId: string,
    userId: string,
    userChatText: string,
    chatText?: string
  ) => {
    dispatch(setCreating('ASKDoc'));

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
              content: chatText ? chatText : userChatText,
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
      let mergedRefPages = refs;
      if (parsedRefPages && refs) {
        mergedRefPages = Array.from(new Set([...parsedRefPages, ...refs]));
      }

      dispatch(
        updateChat({
          id: assistantId,
          role: 'assistant',
          result: contents,
          input: chatText ? chatText : userChatText,
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
    } catch (error: any) {
      errorHandle(error);

      const assistantResult = chatHistory?.filter((history) => history.id === assistantId)[0]
        ?.result;
      if (!assistantResult || assistantResult?.length === 0) {
        dispatch(removeChat(userId));
        dispatch(removeChat(assistantId));
      }
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
};

export default useSubmitAskdoc;
