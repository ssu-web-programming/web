import { useEffect, useRef, useState } from 'react';

import { apiWrapper } from '../../api/apiWrapper';
import { ASKDOC_EXTRACT_TEXT, ASKDOC_GET_EXTRACT_TEXT_STATUS } from '../../api/constant';
import { filesSelector, setFiles } from '../../store/slices/askDocAnalyzeFiesSlice';
import { setCreating } from '../../store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

import useAskDocErrorHandler from './useAskDocErrorHandler';
import useAskDocRequestHandler from './useAskDocRequestHandler';
import useErrorHandle from './useErrorHandle';

const usePollingExtractText = () => {
  const timerIdRef = useRef<any>(null);
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const dispatch = useAppDispatch();
  const errorHandle = useErrorHandle();
  const { data, isLoading } = useAskDocRequestHandler(ASKDOC_EXTRACT_TEXT);
  const askDocErrorHandle = useAskDocErrorHandler();
  askDocErrorHandle(data);
  const [isSuccess, setIsSuccess] = useState(true);
  const { files, userId } = useAppSelector(filesSelector);

  useEffect(() => {
    const pollingCallback = async () => {
      let fail = false;
      // Your polling logic here
      try {
        dispatch(setCreating('TextExtract'));
        const { res } = await apiWrapper().request(ASKDOC_GET_EXTRACT_TEXT_STATUS, {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ taskId: data.data.taskId }),
          method: 'POST'
        });

        const { resultCode, status } = await res.json();
        if (resultCode === 0) {
          if (status === 'completed') {
            dispatch(
              setFiles({
                userId,
                isLoading: false,
                isSuccsess: true,
                files: [...files],
                fileStatus: 'TEXT_DONE',
                isInitialized: true
              })
            );
            dispatch(setCreating('none'));
            setIsPollingEnabled(false);
          }
        } else {
          askDocErrorHandle({ code: 'fail', data: { resultCode, status } });
          setIsSuccess(false);
          setIsPollingEnabled(false);
        }
      } catch (error: any) {
        fail = true;
        setIsPollingEnabled(false);
        errorHandle(error);
      } finally {
        dispatch(setCreating('none'));
      }

      if (fail) {
        console.log('Polling failed. Stopped polling.');
      }
    };

    const startPolling = () => {
      // pollingCallback(); // To immediately start fetching data
      // Polling every 1 seconds
      timerIdRef.current = setInterval(pollingCallback, 1000);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (isPollingEnabled && data?.code === 'success') {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isPollingEnabled, isLoading]);

  return {
    data,
    isSuccess: !isPollingEnabled && data.code === 'success' && isSuccess,
    isLoading: isPollingEnabled && isLoading,
    textExtractLoading: isLoading
  };
};

export default usePollingExtractText;
