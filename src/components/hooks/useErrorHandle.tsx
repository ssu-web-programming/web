import { useLocation } from 'react-router-dom';
import {
  ERR_INVALID_SESSION,
  ERR_NOT_ONLINE,
  GPT_EXCEEDED_LIMIT,
  INVALID_PROMPT,
  NoCreditError,
  NovaNoCreditError
} from '../../error/error';
import { setOnlineStatus } from '../../store/slices/network';
import { activeToast } from '../../store/slices/toastSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import NoCredit from '../toast/contents/NoCredit';
import { useTranslation } from 'react-i18next';
import { userInfoSelector } from 'store/slices/userInfo';
import { ClientType, getPlatform } from 'util/bridge';
import { useConfirm } from 'components/Confirm';
import { openNewWindow } from 'util/common';

const useErrorHandle = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const {
    userInfo: { ul }
  } = useAppSelector(userInfoSelector);
  const confirm = useConfirm();

  return (error: any) => {
    if (error instanceof NoCreditError) {
      dispatch(
        activeToast({
          type: 'error',
          msg: !!error.credit.current ? (
            <NoCredit />
          ) : (
            <NoCredit>
              <p>{t(`ToastMsg.NoCredit`, { credit: error.credit.necessary })}</p>
            </NoCredit>
          )
        })
      );
    } else if (error instanceof NovaNoCreditError) {
      const { current, necessary } = error.credit;
      const platform = getPlatform();

      switch (ul) {
        case '12':
        case '13': {
          switch (platform) {
            case ClientType.ios:
            case ClientType.mac: {
              if (current === 0) {
                confirm({
                  title: t(`Nova.Alert.NoCredit.Title`)!,
                  msg: t(`Nova.Alert.NoCredit.ios`),
                  onOk: {
                    text: t('Confirm'),
                    callback: () => {}
                  }
                });
              } else {
                confirm({
                  title: t(`Nova.Alert.NotEnoughCredit.Title`)!,
                  msg: t(`Nova.Alert.NotEnoughCredit.ios`),
                  onOk: {
                    text: t('Confirm'),
                    callback: () => {}
                  }
                });
              }
              break;
            }
            default: {
              confirm({
                title:
                  current === 0
                    ? t(`Nova.Alert.NoCredit.Title`)!
                    : t(`Nova.Alert.NotEnoughCredit.Title`)!,
                msg: t(`Nova.Alert.NoCredit.android`),
                onOk: {
                  text: t('Purchase'),
                  callback: () => openNewWindow(`https://www.polarisoffice.com/store`)
                },
                onCancel: {
                  text: t('Cancel'),
                  callback: () => {}
                }
              });
            }
          }
          break;
        }
        default: {
          confirm({
            title:
              current === 0
                ? t(`Nova.Alert.NoCredit.Title`)!
                : t(`Nova.Alert.NotEnoughCredit.Title`)!,
            msg: t(`Nova.Alert.NoCredit.UpgradeLevel`),
            onOk: {
              text: t('Subscribe'),
              callback: () => openNewWindow(`credit`)
            },
            onCancel: {
              text: t('Cancel'),
              callback: () => {}
            }
          });
        }
      }
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
