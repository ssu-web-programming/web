import NoCredit from '../toast/contents/NoCredit';
import { useTranslation } from 'react-i18next';

const useErrorMsg = () => {
  const { t } = useTranslation();

  return (error: any) => {
    // const prevCredit = error.headers.get('X-PO-AI-Mayflower-Userinfo-Credit'.toLowerCase());
    // const deductionCredit = error.headers.get(
    //   'X-PO-AI-Mayflower-Userinfo-Usedcredit'.toLowerCase()
    // );

    // const leftCredit = Number(prevCredit) - Number(deductionCredit);

    switch (error.status) {
      case 400:
        // return '400 Bad Request';
        return t(`Txt2ImgTab.ToastMsg.ForbiddenWord`);
      case 401:
        // TODO: Unauthorized error
        return '401 Unauthorized';
      case 429:
        // if (leftCredit === 0) return <NoCredit />;
        // else return t(`ToastMsg.NoCredit`, { credit: leftCredit });
        return t(`ToastMsg.NoCredit`, { credit: '' });
      case 500:
        return t(`ToastMsg.AIError`);
      default:
        return `${error.status} : ${error.statusText}`;
    }
  };
};

export default useErrorMsg;
