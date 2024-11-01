import { useTranslation } from 'react-i18next';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_GENERATE_ANIMATION } from '../../../api/constant';
import { isPixelLimitExceeded } from '../../../constants/fileTypes';
import {
  resetPageData,
  resetPageResult,
  selectPageData,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { platformInfoSelector } from '../../../store/slices/platformInfo';
import { NOVA_TAB_TYPE } from '../../../store/slices/tabSlice';
import { setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import Bridge, { ClientType } from '../../../util/bridge';
import { calLeftCredit, isHigherVersion } from '../../../util/common';
import { convertDriveFileToFile, createFormDataFromFiles, fileToBase64 } from '../../../util/files';
import { useConfirm } from '../../Confirm';
import useErrorHandle from '../useErrorHandle';
import { useShowCreditToast } from '../useShowCreditToast';

export const useConvert2DTo3D = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const showCreditToast = useShowCreditToast();
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const { platform, version } = useAppSelector(platformInfoSelector);
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.convert2DTo3D));

  const resetPageState = () => {
    dispatch(resetPageData(NOVA_TAB_TYPE.convert2DTo3D));
    dispatch(resetPageResult(NOVA_TAB_TYPE.convert2DTo3D));
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'home' }));
  };

  const handleExpandError = (
    errCode: string,
    leftCredit: number,
    pattern: string,
    animationType: string
  ) => {
    if (errCode === 'Timeout') {
      dispatch(
        setPageResult({
          tab: NOVA_TAB_TYPE.convert2DTo3D,
          result: {
            contentType: '',
            data: '',
            info: { pattern, animationType }
          }
        })
      );
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'timeout' }));
    } else {
      resetPageState();
    }
    errorHandle({ code: errCode, credit: leftCredit });
  };

  const getDownloadUrlByPlatform = () => {
    switch (platform) {
      case ClientType.android:
        return 'market://details?id=com.infraware.office.link';
      case ClientType.ios:
        return 'https://itunes.apple.com/app/polaris-office-pdf-docs/id698070860';
      case ClientType.windows:
        return 'https://polarisoffice.com/ko/download';
      case ClientType.mac:
        return 'itms-apps://itunes.apple.com/app/id1098211970?mt=12';
      default:
        return '';
    }
  };

  const isUpdateRequired = () => {
    if (platform === ClientType.web || platform === ClientType.unknown) return false;

    type ClientType = 'android' | 'ios' | 'windows' | 'mac';
    const versionMap: Record<ClientType, string> = {
      android: '9.9.5',
      ios: '9.8.6',
      windows: '10.105.250.54114',
      mac: '9.0.63'
    };

    return !isHigherVersion(versionMap[platform as keyof typeof versionMap], version);
  };

  const confirmUpload = async (url: string) => {
    await confirm({
      title: '',
      msg: t('Nova.Confirm.UpdateVersion.Msg'),
      onOk: {
        text: t('Nova.Confirm.UpdateVersion.Ok'),
        callback: () => {
          Bridge.callBridgeApi('openWindow', url);
        }
      },
      onCancel: {
        text: t('Nova.Confirm.UpdateVersion.Cancel'),
        callback: () => {}
      }
    });
  };

  const goConvertPage = async () => {
    if (isUpdateRequired()) {
      const url = getDownloadUrlByPlatform();
      await confirmUpload(url);
      return;
    }

    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'progress' }));
    try {
      const file = await convertDriveFileToFile(currentFile);
      if (!file) return;

      if (await isPixelLimitExceeded(file, NOVA_TAB_TYPE.convert2DTo3D)) {
        await confirm({
          title: '',
          msg:
            t('Nova.Confirm.OverMaxFilePixel') +
            '\n\n' +
            t(`Nova.${NOVA_TAB_TYPE.convert2DTo3D}.AllowImageSize`),
          onOk: {
            text: t('OK'),
            callback: () => {}
          }
        });
        resetPageState();
        return;
      }

      const base64Data = await fileToBase64(file);
      dispatch(setPageResult({ tab: NOVA_TAB_TYPE.convert2DTo3D, result: base64Data }));
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'convert' }));
    } catch (err) {
      resetPageState();
      errorHandle(err);
    }
  };

  const handleConver2DTo3D = async (pattern: string, animationType: string) => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'loading' }));

    try {
      const formData = await createFormDataFromFiles([currentFile]);
      formData.append('pattern', pattern);
      formData.append('animationType', animationType);

      const { res, logger } = await apiWrapper().request(NOVA_GENERATE_ANIMATION, {
        body: formData,
        method: 'POST'
      });
      const response = await res.json();

      if (response.success) {
        dispatch(
          setPageResult({
            tab: NOVA_TAB_TYPE.convert2DTo3D,
            result: {
              contentType: '',
              data: '',
              link: response.data.animationUrl,
              info: { pattern, animationType }
            }
          })
        );
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'done' }));

        await logger({
          dp: 'ai.nova',
          el: 'nova_image_expansion',
          gpt_ver: 'NOVA_UNCROP_CLIPDROP'
        });

        const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
        showCreditToast(deductionCredit ?? '', leftCredit ?? '', 'credit');
      } else {
        const { leftCredit } = calLeftCredit(res.headers);
        handleExpandError(response.error.code, Number(leftCredit), pattern, animationType);
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'home' }));
      errorHandle(err);
    }
  };

  return { goConvertPage, handleConver2DTo3D };
};
