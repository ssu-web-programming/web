import { useTranslation } from 'react-i18next';

import { activeToast } from '../../store/slices/toastSlice';
import { useAppDispatch } from '../../store/store';
import { useCopyClipboard } from '../../util/bridge';

export default function useCopyText() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const copyClipboard = useCopyClipboard();

  const onCopy = async (output: string) => {
    try {
      const imgReg = /!\[.*\]\((.*)\)/;
      const imgURL = output.match(imgReg)?.[1];

      let target: string | Blob | undefined = undefined;
      if (imgURL) {
        const data = await fetch(String(imgURL));
        target = await data.blob();
      } else {
        target = output;
      }
      copyClipboard(target);

      dispatch(activeToast({ type: 'info', msg: t(`ToastMsg.CopyCompleted`) }));
    } catch {
      dispatch(activeToast({ type: 'error', msg: t(`ToastMsg.CopyFailed`) }));
    }
  };

  return { onCopy };
}
