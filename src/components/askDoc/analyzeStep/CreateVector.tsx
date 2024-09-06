import { Dispatch, SetStateAction, useEffect } from 'react';

import { ASKDOC_CREATE_VECTOR_DATA } from '../../../api/constant';
import { IFileStatus } from '../../../store/slices/askDocAnalyzeFiesSlice';
import useAskDocErrorHandler from '../../hooks/useAskDocErrorHandler';
import useAskDocRequestHandler from '../../hooks/useAskDocRequestHandler';
import usePercentage from '../../hooks/usePercentage';
import ProgressBar from '../../ProgressBar';
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
