import { useTranslation } from 'react-i18next';
import { activeToast } from 'store/slices/toastSlice';
import { useAppDispatch } from 'store/store';

export function useCopyToClipboard() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CopyCompleted`) }));

      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      dispatch(activeToast({ type: 'error', msg: t(`ToastMsg.CopyFailed`) }));
      return false;
    }
  };

  return { copyText };
}
