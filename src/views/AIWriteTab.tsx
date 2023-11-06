import styled from 'styled-components';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { calcToken, parseGptVer } from '../api/usePostSplunkLog';
import { activeToast } from '../store/slices/toastSlice';
import { v4 as uuidv4 } from 'uuid';
import {
  WriteType,
  addWriteHistory,
  removeWriteHistory,
  resetCurrentWrite,
  selectWriteHistorySlice,
  setCurrentWrite,
  updateWriteHistory
} from '../store/slices/writeHistorySlice';
import { useAppSelector } from '../store/store';
import { flex, flexColumn } from '../style/cssCommon';
import { setCreating } from '../store/slices/tabSlice';
import { JSON_CONTENT_TYPE, CHAT_STREAM_API } from '../api/constant';
import { calLeftCredit } from '../util/common';
import useApiWrapper from '../api/useApiWrapper';
import { useTranslation } from 'react-i18next';
import useErrorHandle from '../components/hooks/useErrorHandle';
import { GPT_EXCEEDED_LIMIT } from '../error/error';
import AiWriteResult from '../components/aiWrite/AiWriteResult';
import AIWriteInput from '../components/aiWrite/AIWriteInput';
import { EngineVersion, WriteOptions } from '../components/chat/RecommendBox/FormRec';
import AiEventBanner, { AI_EVENT_BANNER_TARGET_LEVEL } from '../external/AiEvent/AiEventBanner';
import { selectBanner } from '../store/slices/banner';

const TabWrapper = styled.div`
  ${flex}
  ${flexColumn}
  height: 100%;
  overflow-x: hidden;
`;

interface WriteTabProps {
  options: WriteOptions;
  setOptions: React.Dispatch<React.SetStateAction<WriteOptions>>;
}

const AIWriteTab = (props: WriteTabProps) => {
  const apiWrapper = useApiWrapper();

  const { options: selectedOptions, setOptions: setSelectedOptions } = props;
  const { t } = useTranslation();

  const errorHandle = useErrorHandle();

  const stopRef = useRef<boolean>(false);
  const endRef = useRef<any>();

  const dispatch = useDispatch();
  const { history, currentWriteId } = useAppSelector(selectWriteHistorySlice);
  const { active: isBannerActive, userLevel } = useAppSelector(selectBanner);

  const submitSubject = async (inputParam?: WriteType) => {
    let resultText = '';
    let splunk = null;
    let input = '';
    let version: EngineVersion = 'gpt3.5';

    const assistantId = uuidv4();

    let preProc = {
      type: '',
      arg1: '',
      arg2: ''
    };

    if (inputParam) {
      input = inputParam.input;
      preProc = inputParam.preProcessing;
      version = inputParam.version;
    } else {
      input = selectedOptions.input;
      preProc = {
        type: 'create_text',
        arg1: selectedOptions.form.id, // id로 수정
        arg2: selectedOptions.length.length.toString()
      };
      version = selectedOptions.version.version;
    }

    dispatch(
      addWriteHistory({
        id: assistantId,
        input: input,
        preProcessing: preProc,
        result: '',
        version
      })
    );
    dispatch(setCurrentWrite(assistantId));
    dispatch(setCreating('Write'));

    try {
      const { res, logger } = await apiWrapper(CHAT_STREAM_API, {
        headers: {
          ...JSON_CONTENT_TYPE,
          'User-Agent': navigator.userAgent
        },
        body: JSON.stringify({
          engine: version,
          history: [
            {
              content: input,
              role: 'user',
              preProcessing: preProc
            }
          ]
        }),
        method: 'POST'
      });
      splunk = logger;

      if (res.status !== 200) {
        if (res.status === 400) throw new Error(GPT_EXCEEDED_LIMIT);
        else throw res;
      }

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

      const reader = res.body?.getReader();
      var enc = new TextDecoder('utf-8');

      while (reader) {
        // if (isFull) break;
        const { value, done } = await reader.read();

        if (stopRef?.current) {
          reader.cancel();
          dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.StopMsg`) }));
          break;
        }

        if (done) {
          // setProcessState(PROCESS_STATE.COMPLETE_GENERATE);

          break;
        }

        const decodeStr = enc.decode(value);
        dispatch(
          updateWriteHistory({
            id: assistantId,
            result: decodeStr,
            input: input,
            preProcessing: preProc,
            version
          })
        );
        resultText += decodeStr;

        endRef?.current?.scrollIntoView({ behavior: 'smooth' });
      }

      if (!stopRef.current) dispatch(setCreating('none'));
    } catch (error: any) {
      dispatch(resetCurrentWrite());
      errorHandle(error);

      const assistantResult = history?.filter((write) => write.id === assistantId)[0]?.result;
      if (!assistantResult || assistantResult?.length === 0) {
        dispatch(removeWriteHistory(assistantId));
      }
      if (input) {
        setSelectedOptions((prev) => ({ ...prev, input: input }));
      }
    } finally {
      if (splunk) {
        const input_token = calcToken(input);
        const output_token = calcToken(resultText);
        const gpt_ver = parseGptVer(version);

        splunk({
          dp: 'ai.write',
          el: 'create_text',
          input_token,
          output_token,
          gpt_ver
        });
      }
      stopRef.current = false;
      dispatch(setCreating('none'));
    }
  };

  const onClickStop = () => {
    stopRef.current = true;
  };

  return (
    <TabWrapper>
      {!currentWriteId ? (
        <AIWriteInput
          history={history}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          submitSubject={submitSubject}
        />
      ) : (
        <AiWriteResult
          history={history}
          onClickStop={onClickStop}
          currentWriteId={currentWriteId}
          submitSubject={submitSubject}
        />
      )}
      {isBannerActive && userLevel === AI_EVENT_BANNER_TARGET_LEVEL && (
        <AiEventBanner tab="ai.write" />
      )}
    </TabWrapper>
  );
};

export default AIWriteTab;
