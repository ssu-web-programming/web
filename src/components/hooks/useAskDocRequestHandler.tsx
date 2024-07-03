import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { filesSelector, setFiles } from '../../store/slices/askDocAnalyzeFiesSlice';
import {
  ASKDOC_EXTRACT_TEXT,
  ASKDOC_CREATE_VECTOR_DATA,
  ASKDOC_MAKE_SUMMARY
} from '../../api/constant';
import { setCreating } from '../../store/slices/tabSlice';
import useErrorHandle from './useErrorHandle';
import { apiWrapper } from '../../api/apiWrapper';

const useAskDocRequestHandler = (api: string) => {
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
        const { res } = await apiWrapper().request(api, {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sendData),
          method: 'POST'
        });
        const response = await res.json();
        if (api !== ASKDOC_EXTRACT_TEXT) {
          dispatch(
            setFiles({
              userId,
              isLoading: false,
              isSuccsess: true,
              files: [...files],
              fileStatus: response.status,
              isInitialized: true
            })
          );
        }
        const resData = { ...response, credit: res?.headers?.get('Userinfo-Credit') };
        if (response.resultCode === 0) {
          setIsSuccess(true);
          setData({ code: 'success', data: resData });
        } else {
          setIsSuccess(false);
          setData({ code: 'fail', data: resData });
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

export default useAskDocRequestHandler;
