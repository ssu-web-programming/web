import { Dispatch, SetStateAction, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ASKDOC_ALL_COMPLETE_ANALYZING } from '../../../api/constant';
import { IFileStatus } from '../../../store/slices/askDocAnalyzeFiesSlice';
import { setCreating } from '../../../store/slices/tabSlice';
import { activeToast } from '../../../store/slices/toastSlice';
import { useAppDispatch } from '../../../store/store';
import useAskDocErrorHandler from '../../hooks/useAskDocErrorHandler';
import useAskDocRequestHandler from '../../hooks/useAskDocRequestHandler';
import useLangParameterNavigate from '../../hooks/useLangParameterNavigate';
import usePercentage from '../../hooks/usePercentage';
import ProgressBar from '../../ProgressBar';

type Props = {
  onNext: Dispatch<SetStateAction<'ready' | IFileStatus>>;
};

const PreAsk = ({ onNext }: Props) => {
  const { navigate } = useLangParameterNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const errorHandle = useAskDocErrorHandler();
  const { data, isLoading, isSuccess } = useAskDocRequestHandler(ASKDOC_ALL_COMPLETE_ANALYZING);
  const { percentage } = usePercentage(isLoading, data?.code === 'success', 90, 100, 500);

  errorHandle(data);

  useEffect(() => {
    if (!isLoading && data?.code === 'success' && percentage === 100) {
      dispatch(setCreating('PreAsk'));
      dispatch(
        activeToast({
          type: 'info',
          msg: t(`AskDocStep.Step4.Noti`, {
            deductionCredit: 5,
            leftCredit: data.data.credit === '-1' ? t('Unlimited') : data.data.credit
          })
        })
      );
      navigate('/AskDocStep/Chat');
      dispatch(setCreating('none'));
    }
  }, [isLoading, data, onNext, percentage, navigate, isSuccess]);
  return <ProgressBar progressPer={percentage} />;
};

export default PreAsk;
