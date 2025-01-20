import { useConfirm } from 'components/Confirm';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { userInfoSelector } from 'store/slices/userInfo';
import { ClientType, getPlatform } from 'util/bridge';
import { openNewWindow, sliceFileName } from 'util/common';

import {
  DelayDocConverting,
  DocConvertingError,
  DocUnopenableError,
  ERR_INVALID_SESSION,
  ERR_NOT_ONLINE,
  GPT_EXCEEDED_LIMIT,
  INVALID_PROMPT,
  NoCreditError,
  NoFileInDrive,
  NovaNoCreditError
} from '../../error/error';
import { setOnlineStatus } from '../../store/slices/network';
import { activeToast } from '../../store/slices/toastSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import NoCredit from '../toast/contents/NoCredit';

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
          msg: error.credit.current ? (
            <NoCredit>
              <p>{t(`ToastMsg.NoCredit`, { credit: error.credit.necessary })}</p>
            </NoCredit>
          ) : (
            <NoCredit />
          )
        })
      );
    } else if (
      error instanceof NovaNoCreditError ||
      error.code === 'no_credit' ||
      error.code === 'not_enough_credit'
    ) {
      const platform = getPlatform();
      const leftCredit =
        typeof error.credit === 'object' && error.credit !== null
          ? error.credit.current
          : error.credit;

      switch (ul) {
        case '12':
        case '13':
        case '4': {
          switch (platform) {
            case ClientType.ios:
            case ClientType.mac: {
              if (leftCredit === 0) {
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
                  leftCredit === 0
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
              leftCredit === 0
                ? t(`Nova.Alert.NoCredit.Title`)!
                : t(`Nova.Alert.NotEnoughCredit.Title`)!,
            msg: t(`Nova.Alert.NoCredit.UpgradeLevel`),
            onOk: {
              text: t('Subscribe'),
              callback: () => openNewWindow(`upgradePlan`)
            },
            onCancel: {
              text: t('Cancel'),
              callback: () => {}
            }
          });
        }
      }
    } else if (error instanceof DocConvertingError) {
      confirm({
        title: '',
        msg: t('Index.Alert.FailedConvertDoc'),
        onOk: {
          text: t('Confirm'),
          callback: () => {}
        }
      });
    } else if (error instanceof DocUnopenableError) {
      const unopenable = error.errorInfos.filter((info) => info.type === 'UNOPENABLE_DOCUMENT');
      const password = error.errorInfos.filter((info) => info.type === 'PASSWORD');
      confirm({
        title: '',
        msg: (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}>
            <div style={{ marginBottom: '20px' }}>{t('Index.Alert.UnopenableDocError')}</div>
            {unopenable.length > 0 && (
              <div>{`- ${t('Index.Alert.Unopenable')} : ${unopenable
                .map((item) => sliceFileName(item.filename, 10))
                .join(', ')}`}</div>
            )}
            {password.length > 0 && (
              <div>{`- ${t('Index.Alert.Password')} : ${password
                .map((item) => sliceFileName(item.filename, 10))
                .join(', ')}`}</div>
            )}
          </div>
        ),
        onOk: {
          text: t('Confirm'),
          callback: () => {}
        }
      });
    } else if (error instanceof DelayDocConverting) {
      confirm({
        title: '',
        msg: t('Index.Alert.ReQuestion'),
        onOk: {
          text: t('Confirm'),
          callback: () => {}
        }
      });
    } else if (error instanceof NoFileInDrive) {
      confirm({
        title: '',
        msg: t('Index.Alert.NoFileInDrive'),
        onOk: {
          text: t('Confirm'),
          callback: () => {}
        }
      });
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
