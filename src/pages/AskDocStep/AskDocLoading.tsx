import { useLayoutEffect } from 'react';
import CheckDocHistorySkeleton from '../../components/askDoc/CheckDocHistorySkeleton';

import TagManager from 'react-gtm-module';
import { WrapperPage } from '../../style/askDoc';
import useGetAskDocFiles, { Data } from '../../components/hooks/useGetAskDocFiles';
import { useAppSelector } from '../../store/store';
import { filesSelector } from '../../store/slices/askDocAnalyzeFiesSlice';
import useLangParameterNavigate from '../../components/hooks/useLangParameterNavigate';
export const FallbackComponent = () => {
  return (
    <WrapperPage>
      <CheckDocHistorySkeleton />
    </WrapperPage>
  );
};

const AskDocLoading = () => {
  const { navigate } = useLangParameterNavigate();
  const { data } = useGetAskDocFiles();
  const { userId } = useAppSelector(filesSelector);

  if (data?.resultCode === 0) {
    const tagManagerArgs = {
      gtmId: process.env.REACT_APP_GTM_ID as string
    };
    TagManager.dataLayer({
      dataLayer: {
        user_id: userId
      }
    });
    TagManager.initialize(tagManagerArgs);
  }

  useLayoutEffect(() => {
    // 문서 편집 기록이 없는 경우
    const movePage = (data: Data) => {
      if (data.resultCode === 0 && data.fileRevision === data.maxFileRevision) {
        if (data.status === 'AVAILABLE') return navigate('/AskDocStep/Chat');
        if (data.status === 'TEXT_DONE') return navigate('/AskDocStep/StartAnalysisDoc');
        if (data.status === null) return navigate('/AskDocStep/ConfirmDoc');
        return navigate('/AskDocStep/ProgressAnalysisDoc');
      }
      if (data && data.status === null) return navigate('/AskDocStep/ConfirmDoc');
      return navigate('/AskDocStep/CheckDocHistory');
    };
    if (data) {
      movePage(data);
    }
  }, [data, navigate]);

  return <FallbackComponent />;
};

export default AskDocLoading;
