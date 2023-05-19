import { calLeftCredit } from '../../util/common';
import NoCredit from '../toast/contents/NoCredit';
import { useTranslation } from 'react-i18next';

const useErrorMsg = () => {
  const { t } = useTranslation();

  return (error: any) => {
    const { leftCredit, prevCredit } = calLeftCredit(error.header);

    switch (error.status) {
      case 400:
        // return '400 Bad Request';
        return t(`Txt2ImgTab.ToastMsg.ForbiddenWord`);
      case 401:
        // TODO: Unauthorized error
        return '401 Unauthorized';
      case 429:
        if (prevCredit === 0) return <NoCredit />;
        else return t(`ToastMsg.NoCredit`, { credit: Math.abs(leftCredit) });
      case 500:
        return t(`ToastMsg.AIError`);
      default:
        return `${error.status} : ${error.statusText}`;
    }
  };
};

export default useErrorMsg;
