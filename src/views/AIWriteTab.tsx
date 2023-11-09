import styled from 'styled-components';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { postSplunkLog, calcToken, parseGptVer } from '../api/usePostSplunkLog';
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
import { calLeftCredit } from '../util/common';
import { useTranslation } from 'react-i18next';
import useErrorHandle from '../components/hooks/useErrorHandle';
import AiWriteResult from '../components/aiWrite/AiWriteResult';
import AIWriteInput from '../components/aiWrite/AIWriteInput';
import { EngineVersion, WriteOptions } from '../components/chat/RecommendBox/FormRec';
import AiEventBanner, { AI_EVENT_BANNER_TARGET_LEVEL } from '../external/AiEvent/AiEventBanner';
import { selectBanner } from '../store/slices/banner';
import { Requestor, requestChatStream, streaming } from '../api';
import { useShowCreditToast } from '../components/hooks/useShowCreditToast';
import Bridge from '../util/bridge';
import { StreamPreprocessing } from '../store/slices/chatHistorySlice';

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
  const { options: selectedOptions, setOptions: setSelectedOptions } = props;
  const { t } = useTranslation();

  const errorHandle = useErrorHandle();
  const showCreditToast = useShowCreditToast();

  const requestor = useRef<Requestor | null>(null);
  const endRef = useRef<any>();

  const dispatch = useDispatch();
  const { history, currentWriteId } = useAppSelector(selectWriteHistorySlice);
  const { active: isBannerActive, userLevel } = useAppSelector(selectBanner);

  const submitSubject = async (inputParam?: WriteType) => {
    let resultText = '';
    let input = '';
    let version: EngineVersion = 'gpt3.5';

    const assistantId = uuidv4();

    let preProc: StreamPreprocessing | null = null;

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
      const sessionInfo = await Bridge.checkSession('');
      try {
        requestor.current = requestChatStream(sessionInfo, {
          engine: version,
          history: [
            {
              content: input,
              role: 'user',
              preProcessing: preProc
            }
          ]
        });

        const res = await requestor.current.request();

        const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
        showCreditToast(deductionCredit, leftCredit);

        await streaming(res, (contents) => {
          dispatch(
            updateWriteHistory({
              id: assistantId,
              result: contents,
              input: input,
              preProcessing: preProc!,
              version
            })
          );
          resultText += contents;
          endRef?.current?.scrollIntoView({ behavior: 'smooth' });
        });
      } catch (err) {
        if (requestor.current?.isAborted() === true) {
        } else {
          throw err;
        }
      } finally {
        requestor.current = null;

        const input_token = calcToken(input);
        const output_token = calcToken(resultText);
        const gpt_ver = parseGptVer(version);

        postSplunkLog(sessionInfo, {
          dp: 'ai.write',
          el: 'create_text',
          input_token,
          output_token,
          gpt_ver
        });
      }
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
      dispatch(setCreating('none'));
    }
  };

  const onClickStop = () => {
    requestor.current?.abort();
    dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.StopMsg`) }));
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
