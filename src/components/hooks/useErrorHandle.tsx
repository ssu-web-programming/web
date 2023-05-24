import { ERR_INVALID_SESSION, ERR_NOT_ONLINE } from '../../error/error';
import { setOnlineStatus } from '../../store/slices/network';
import { activeToast } from '../../store/slices/toastSlice';
import { useAppDispatch } from '../../store/store';
import { calLeftCredit } from '../../util/common';
import NoCredit from '../toast/contents/NoCredit';
import { useTranslation } from 'react-i18next';

const useErrorHandle = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (error: any) => {
    let msg: string | React.ReactNode = '';
    switch (error.message) {
      case ERR_NOT_ONLINE: {
        dispatch(setOnlineStatus(false));
        return;
      }
      case ERR_INVALID_SESSION: {
        msg = 'Invalid Session';
        break;
      }
      default: {
        switch (error.status) {
          case 400:
            // return '400 Bad Request';
            msg = t(`Txt2ImgTab.ToastMsg.ForbiddenWord`);
            break;
          case 401:
            msg = '401 Unauthorized';
            break;
          case 429:
            const { leftCredit, deductionCredit } = calLeftCredit(error.header);
            if (leftCredit === 0) {
              msg = <NoCredit />;
            } else {
              msg = t(`ToastMsg.NoCredit`, { credit: deductionCredit });
            }
            break;
          case 500:
            msg = t(`ToastMsg.AIError`);
            break;
          default:
            msg = t(`ToastMsg.ErrorMsg`, { code: error.status, msg: error.statusText });
            break;
        }
      }
    }

    dispatch(
      activeToast({
        active: true,
        msg,
        isError: true
      })
    );
  };
};

export default useErrorHandle;
