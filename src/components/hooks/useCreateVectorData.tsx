import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { filesSelector, setFiles } from '../../store/slices/askDocAnalyzeFiesSlice';
import {
  ASKDOC_GET_EXTRACT_TEXT_STATUS,
  JSON_CONTENT_TYPE,
  ASKDOC_EXTRACT_TEXT,
  ASKDOC_CREATE_VECTOR_DATA,
  ASKDOC_MAKE_SUMMARY
} from '../../api/constant';
import { ERR_NOT_ONLINE, ERR_INVALID_SESSION } from '../../error/error';
import Bridge from '../../util/bridge';
import { setCreating } from '../../store/slices/tabSlice';
import useErrorHandle from './useErrorHandle';
import useAskDocErrorHandler from './useAskDocErrorHandler';

interface IBody {
  fileId: string;
  fileRevision: number;
}

const requestHandler = async <T = IBody,>(api: string, requestBody: T) => {
  try {
    if (!navigator.onLine) {
      throw new Error(ERR_NOT_ONLINE);
    }
    const resSession = await Bridge.checkSession(api);
    if (!resSession || !resSession.success) {
      throw new Error(ERR_INVALID_SESSION);
    }

    const AID = resSession.sessionInfo['AID'];
    const BID = resSession.sessionInfo['BID'];
    const SID = resSession.sessionInfo['SID'];

    const session: any = {};
    session['X-PO-AI-MayFlower-Auth-AID'] = AID;
    session['X-PO-AI-MayFlower-Auth-BID'] = BID;
    session['X-PO-AI-MayFlower-Auth-SID'] = SID;

    const res = await fetch(api, {
      headers: {
        ...JSON_CONTENT_TYPE,
        'User-Agent': navigator.userAgent,
        ...session
      },
      body: JSON.stringify({
        ...requestBody
      }),
      method: 'POST'
    });
    const response = await res.json();
    return { ...response, credit: res?.headers?.get('Userinfo-Credit') };
  } catch (error: any) {
    throw error;
  }
};

export const useAskDocRequestHandler = (api: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);
  const { files, userId } = useAppSelector(filesSelector);
  const dispatch = useAppDispatch();
  const errorHandle = useErrorHandle();
  let shareAnswerState:
    | 'ASKDoc'
    | 'TextExtract'
    | 'CreateVectorData'
    | 'MakeSummary'
    | 'PreAsk'
    | 'none' = 'none';
  if (api === ASKDOC_CREATE_VECTOR_DATA) shareAnswerState = 'CreateVectorData';
  if (api === ASKDOC_MAKE_SUMMARY) shareAnswerState = 'MakeSummary';
  if (api === ASKDOC_EXTRACT_TEXT) shareAnswerState = 'TextExtract';
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sendData = {
          fileId: files[0].fileId,
          fileRevision: files[0].fileRevision
        };
        dispatch(setCreating(shareAnswerState));
        const res = await requestHandler(api, sendData);
        if (api !== ASKDOC_EXTRACT_TEXT) {
          dispatch(
            setFiles({
              userId,
              isLoading: false,
              isSuccsess: true,
              files: [...files],
              fileStatus: res.status,
              isInitialized: true
            })
          );
        }
        if (res.resultCode === 0) {
          setIsSuccess(true);
          setData({ code: 'success', data: res });
        } else {
          setIsSuccess(false);
          setData({ code: 'fail', data: res });
        }
        setIsLoading(false);
      } catch (error: any) {
        errorHandle(error);
        setIsLoading(false);
        setIsSuccess(false);
        setData({ code: 'fail', data: error });
      } finally {
        dispatch(setCreating('none'));
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    data,
    isSuccess
  };
};

export const usePollingExtractText = () => {
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
        const { resultCode, status } = await requestHandler(ASKDOC_GET_EXTRACT_TEXT_STATUS, {
          taskId: data.data.taskId
        });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPollingEnabled, isLoading]);

  return {
    data,
    isSuccess: !isPollingEnabled && data.code === 'success' && isSuccess,
    isLoading: isPollingEnabled && isLoading,
    textExtractLoading: isLoading
  };
};
