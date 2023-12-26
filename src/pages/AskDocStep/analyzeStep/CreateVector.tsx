import { useEffect, Dispatch, SetStateAction } from 'react';
import ProgressBar from '../../../components/ProgressBar';
import { useAskDocRequestHandler } from '../../../components/hooks/useCreateVectorData';
import { ASKDOC_CREATE_VECTOR_DATA } from '../../../api/constant';
import { IFileStatus } from '../../../store/slices/askDocAnalyzeFiesSlice';
import usePercentage from '../../../components/hooks/usePercentage';
import useAskDocErrorHandler from '../../../components/hooks/useAskDocErrorHandler';
type Props = {
  onNext: Dispatch<SetStateAction<'ready' | IFileStatus>>;
};

const CreateVector = ({ onNext }: Props) => {
  const { data, isLoading } = useAskDocRequestHandler(ASKDOC_CREATE_VECTOR_DATA);
  const errorHandle = useAskDocErrorHandler();
  errorHandle(data);

  const { percentage } = usePercentage(isLoading, data?.code === 'success', 0, 45);
  useEffect(() => {
    if (!isLoading && data?.code === 'success' && percentage === 45) {
      onNext('ANALYZE_DONE');
    }
  }, [isLoading, data, onNext, percentage]);

  return <ProgressBar progressPer={percentage} />;
};

export default CreateVector;
