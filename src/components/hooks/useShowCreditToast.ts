import { useTranslation } from 'react-i18next';

import { activeToast } from '../../store/slices/toastSlice';
import { useAppDispatch } from '../../store/store';

export const useShowCreditToast = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return function (consumed: string, left: string, type = 'common') {
    const leftCredit = left === '-1' ? t('Unlimited') : Number(left).toLocaleString();
    dispatch(
      activeToast({
        type: 'info',
        msg: t(type === 'common' ? `ToastMsg.StartCreating` : `Nova.Toast.ConsumeCredit`, {
          deductionCredit: consumed,
          leftCredit
        })
      })
    );
  };
};
