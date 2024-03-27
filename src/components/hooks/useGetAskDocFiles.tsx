import { useEffect, useState } from 'react';
import { filesSelector, setFiles } from '../../store/slices/askDocAnalyzeFiesSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Bridge from '../../util/bridge';
import { initFlagSelector } from '../../store/slices/initFlagSlice';
import { apiWrapper } from '../../api/apiWrapper';
import { ASKDOC_GET_ANALYZE_INFO } from '../../api/constant';
import useErrorHandle from './useErrorHandle';
import { setSummary } from '../../store/slices/askDocSummary';
import useInterval from './useInterval';

export type Data = {
  detail: null;
  fileId: string;
  fileRevision: number;
  keywords: string[];
  maxFileRevision: number;
  preAnswer: string;
  preQuestion: string;
  questions: string[];
  resultCode: number;
  resultMsg: string;
  status:
    | null
    | 'TEXT_DONE'
    | 'ANALYZE_DONE'
    | 'DOCINFO_DONE'
    | 'USECREDIT_REQUIRED'
    | 'AVAILABLE'
    | 'DELETED';
  summary: string;
  timeAnalyze: number;
};

const useGetAskDocFiles = () => {
  const { isInit } = useAppSelector(initFlagSelector);
  const { isSuccsess, files, userId, isInitialized } = useAppSelector(filesSelector);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const errorHandle = useErrorHandle();
  const [data, setData] = useState<Data | null>(null);

  useInterval(
    () => {
      if (isInit) {
        console.log('analyzeFiles polling..');
        Bridge.callBridgeApi('analyzeFiles');
      }
    },
    isSuccsess ? null : 2000
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const { res } = await apiWrapper().request(ASKDOC_GET_ANALYZE_INFO, {
          body: {
            fileId: files[0].fileId
          },
          method: 'POST'
        });

        const response = await res.json();
        if (response.resultCode === 0) {
          dispatch(
            setFiles({
              isLoading: false,
              isSuccsess: true,
              isInitialized,
              userId,
              files: [
                {
                  ...files[0],
                  fileRevision:
                    response.status === 'AVAILABLE' ? response.fileRevision : files[0].fileRevision
                }
              ],
              fileStatus: response.status,
              maxFileRevision: response.maxFileRevision
            })
          );

          dispatch(
            setSummary({
              keywords: response.keywords,
              questions: response.questions,
              summary: response.summary
            })
          );
          setData(response);
        }
      } catch (error: any) {
        //TODO: 네트워크 관련 에러처리 필요
        errorHandle(error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    if (isSuccsess) {
      getData();
    }
  }, [isSuccsess]);

  return {
    isLoading: loading,
    files,
    data
  };
};

export default useGetAskDocFiles;
