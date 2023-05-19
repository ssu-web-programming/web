import { calLeftCredit } from '../../util/common';
import NoCredit from '../toast/contents/NoCredit';
import { useTranslation } from 'react-i18next';

const useErrorMsg = () => {
  const { t } = useTranslation();

  return (error: any) => {
    switch (error.status) {
      case 400:
        // return '400 Bad Request';
        return t(`Txt2ImgTab.ToastMsg.ForbiddenWord`);
      case 401:
        return '401 Unauthorized';
      case 429:
        const { leftCredit, prevCredit } = calLeftCredit(error.header);
        if (prevCredit === 0) return <NoCredit />;
        // else return t(`ToastMsg.NoCredit`, { credit: Math.abs(leftCredit) });
        else return t(`ToastMsg.NoCredit`, { credit: t(`Additional`) });
      case 500:
        return t(`ToastMsg.AIError`);
      default:
        return t(`ToastMsg.ErrorMsg`, { code: error.status, msg: error.statusText });
    }
  };
};

export default useErrorMsg;
