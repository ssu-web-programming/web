import { useTranslation } from 'react-i18next';
import { ASKDOC_INIT_QUESTION_API, JSON_CONTENT_TYPE } from '../../api/constant';
import useApiWrapper from '../../api/useApiWrapper';
import { GPT_EXCEEDED_LIMIT } from '../../error/error';
import { setCreating } from '../../store/slices/tabSlice';
import { useAppDispatch } from '../../store/store';
import { AskDocSourceId, setQuestionList } from '../../store/slices/askDoc';
import useErrorHandle from './useErrorHandle';

export default function useLoadInitQuestion() {
  const dispatch = useAppDispatch();
  const apiWrapper = useApiWrapper();
  const { t } = useTranslation();
  const errorHandle = useErrorHandle();

  const INIT_QUESTION_PROMPT = t('AskDoc.InitLoadQuestion');
  const INIT_DEFAULT_QUESTION = t('AskDoc.DefaultQuestion');

  return async function loadInitQuestion(sourceId?: AskDocSourceId) {
    let splunk = null;
    const initQuestionLen = 3;

    dispatch(setCreating('ASKDoc'));

    try {
      if (!sourceId) return new Error('No sourceId');

      const { res, logger } = await apiWrapper(ASKDOC_INIT_QUESTION_API, {
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
      splunk = logger;
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
    } catch (error: any) {
      errorHandle(error);
      if (splunk) {
        splunk({
          dp: 'ai.askdoc',
          ec: 'system',
          ea: 'result',
          el: 'chat_askdoc.gen_failed'
        });
      }
      throw error;
    } finally {
      dispatch(setCreating('none'));
    }
  };
}
