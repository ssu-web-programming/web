import { useTranslation } from 'react-i18next';
import { activeToast } from '../../store/slices/toastSlice';
import { useAppDispatch } from '../../store/store';

export const useShowCreditToast = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return function (consumed: string, left: string) {
    const leftCredit = left === '-1' ? t('AskDoc.Unlimited') : left;
    dispatch(
      activeToast({
        type: 'info',
        msg: t(`ToastMsg.StartCreating`, { deductionCredit: consumed, leftCredit })
      })
    );
  };
};
