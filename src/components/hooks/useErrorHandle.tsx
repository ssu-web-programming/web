import { useLocation } from 'react-router-dom';
import {
  ERR_INVALID_SESSION,
  ERR_NOT_ONLINE,
  GPT_EXCEEDED_LIMIT,
  INVALID_PROMPT,
  NoCreditError
} from '../../error/error';
import { setOnlineStatus } from '../../store/slices/network';
import { activeToast } from '../../store/slices/toastSlice';
import { useAppDispatch } from '../../store/store';
import NoCredit from '../toast/contents/NoCredit';
import { useTranslation } from 'react-i18next';

const useErrorHandle = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  return (error: any) => {
    if (error instanceof NoCreditError) {
      dispatch(
        activeToast({
          type: 'error',
          msg: !error.credit.current ? (
            <NoCredit />
          ) : (
            <NoCredit>
              <p>{t(`ToastMsg.NoCredit`, { credit: error.credit.necessary })}</p>
            </NoCredit>
          )
        })
      );
    } else {
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
        case INVALID_PROMPT: {
          msg = t(`Txt2ImgTab.ToastMsg.ForbiddenWord`);
          break;
        }
        case GPT_EXCEEDED_LIMIT: {
          msg = t(`Txt2ImgTab.ToastMsg.GPTExceededLimit`);
          break;
        }
        default: {
          switch (error.status) {
            case 401:
              msg = t(`ToastMsg.UnauthorizedMsg`);
              break;
            case 500:
              if (location.pathname.indexOf('askdoc') > 0) msg = t('AskDoc.FailedAnalyze');
              else msg = t(`ToastMsg.AIError`);
              break;
            default:
              msg = t(`ToastMsg.ErrorMsg`, { code: error.status, msg: error.statusText });
              break;
          }
        }
      }

      dispatch(activeToast({ type: 'error', msg }));
    }
  };
};

export default useErrorHandle;
