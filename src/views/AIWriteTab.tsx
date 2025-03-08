import { useRef } from 'react';
import AIWriteInput from 'components/aiWrite/ai-write-input';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import { track } from '@amplitude/analytics-browser';

import { apiWrapper, streaming } from '../api/apiWrapper';
import { AI_WRITE_RESPONSE_STREAM_API } from '../api/constant';
import { calcToken, parseGptVer } from '../api/usePostSplunkLog';
import AiWriteResult from '../components/aiWrite/AiWriteResult';
import { EngineVersion, WriteOptions } from '../components/chat/RecommendBox/FormRec';
import useErrorHandle from '../components/hooks/useErrorHandle';
import { useShowCreditToast } from '../components/hooks/useShowCreditToast';
import { StreamPreprocessing } from '../store/slices/chatHistorySlice';
import { setCreating } from '../store/slices/tabSlice';
import { activeToast } from '../store/slices/toastSlice';
import { getCurrentFile } from '../store/slices/uploadFiles';
import {
  addWriteHistory,
  removeWriteHistory,
  resetCurrentWrite,
  selectWriteHistorySlice,
  setCurrentWrite,
  updateWriteHistory,
  WriteType
} from '../store/slices/writeHistorySlice';
import { useAppSelector } from '../store/store';
import { calLeftCredit } from '../util/common';

const TabWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  const currentFile = useAppSelector(getCurrentFile);

  const requestor = useRef<any>();
  const errorHandle = useErrorHandle();
  const showCreditToast = useShowCreditToast();

  const dispatch = useDispatch();
  const { history, currentWriteId } = useAppSelector(selectWriteHistorySlice);

  const submitSubject = async (inputParam?: WriteType) => {
    let resultText = '';
    let input = '';
    let splunk = undefined;
    let version: EngineVersion = 'gpt3.5';
    let usedCredit: string | null = '';

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
      const { res, logger } = await apiWrapper().request(AI_WRITE_RESPONSE_STREAM_API, {
        headers: {
          'Content-Type': 'application/json'
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

      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
      showCreditToast(deductionCredit ?? '', leftCredit ?? '');
      usedCredit = deductionCredit;

      await streaming(res, (contents) => {
        if (preProc) {
          dispatch(
            updateWriteHistory({
              id: assistantId,
              result: contents,
              input: input,
              preProcessing: preProc,
              version
            })
          );
        }
        resultText += contents;
      });
    } catch (error) {
      if (requestor.current?.isAborted() === true) {
        /* empty */
      } else {
        dispatch(resetCurrentWrite());
        errorHandle(error);

        const assistantResult = history?.filter((write) => write.id === assistantId)[0]?.result;
        if (!assistantResult || assistantResult?.length === 0) {
          dispatch(removeWriteHistory(assistantId));
        }
        if (input) {
          setSelectedOptions((prev) => ({ ...prev, input: input }));
        }
      }
    } finally {
      dispatch(setCreating('none'));

      const gpt_ver = parseGptVer(version);
      if (splunk) {
        try {
          const input_token = calcToken(input);
          const output_token = calcToken(resultText);
          splunk({
            dp: 'ai.write',
            el: 'create_text',
            input_token,
            output_token,
            gpt_ver
          });
        } catch (err) {
          /* empty */
        }
      }
      track('ai_write', {
        document_format: currentFile.ext,
        file_id: currentFile.id,
        model_type: gpt_ver,
        credit: usedCredit
      });
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
    </TabWrapper>
  );
};

export default AIWriteTab;
