import { useEffect, Dispatch, SetStateAction } from 'react';
import ProgressBar from '../../../components/ProgressBar';
import { useAskDocRequestHandler } from '../../../components/hooks/useCreateVectorData';
import { ASKDOC_MAKE_SUMMARY } from '../../../api/constant';
import { IFileStatus } from '../../../store/slices/askDocAnalyzeFiesSlice';
import usePercentage from '../../../components/hooks/usePercentage';
import { useAppDispatch } from '../../../store/store';
import { setSummary } from '../../../store/slices/askDocSummary';
import useAskDocErrorHandler from '../../../components/hooks/useAskDocErrorHandler';
type Props = {
  onNext: Dispatch<SetStateAction<'ready' | IFileStatus>>;
};

const Keyword = ({ onNext }: Props) => {
  const dispatch = useAppDispatch();
  const errorHandle = useAskDocErrorHandler();
  const { data, isLoading } = useAskDocRequestHandler(ASKDOC_MAKE_SUMMARY);
  const { percentage } = usePercentage(isLoading, data?.code === 'success', 45, 90, 500);

  errorHandle(data);

  useEffect(() => {
    if (!isLoading && data?.code === 'success' && percentage === 90) {
      dispatch(
        setSummary({
          keywords: data.data.keywords,
          questions: data.data.questions,
          summary: data.data.summary
        })
      );

      onNext('DOCINFO_DONE');
    }
  }, [isLoading, data, onNext, percentage]);
  return <ProgressBar progressPer={percentage} />;
};

export default Keyword;
