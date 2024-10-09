import { useTranslation } from 'react-i18next';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_REMOVE_BACKGROUND } from '../../../api/constant';
import { isPixelLimitExceeded } from '../../../constants/fileTypes';
import {
  resetPageData,
  resetPageResult,
  selectPageData,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from '../../../store/slices/tabSlice';
import { setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { calLeftCredit } from '../../../util/common';
import { convertDriveFileToFile, createFormDataFromFiles } from '../../../util/files';
import { useConfirm } from '../../Confirm';
import useErrorHandle from '../useErrorHandle';
import { useShowCreditToast } from '../useShowCreditToast';

export const useRemoveBackground = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const showCreditToast = useShowCreditToast();
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.removeBG));

  const handleRemoveBackground = async () => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'loading' }));
    const file = await convertDriveFileToFile(currentFile);
    if (!file) return;

    if (await isPixelLimitExceeded(file, NOVA_TAB_TYPE.removeBG)) {
      await confirm({
        title: '',
        msg:
          t('Nova.Confirm.OverMaxFilePixel') +
          '\n\n' +
          t(`Nova.${NOVA_TAB_TYPE.removeBG}.AllowImageSize`),
        onOk: {
          text: t('OK'),
          callback: () => {}
        }
      });

      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'home' }));
      dispatch(resetPageData(NOVA_TAB_TYPE.removeBG));
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));

      return;
    }

    try {
      const formData = await createFormDataFromFiles([currentFile]);
      const { res, logger } = await apiWrapper().request(NOVA_REMOVE_BACKGROUND, {
        body: formData,
        method: 'POST'
      });
      const response = await res.json();
      if (response.success) {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.removeBG, result: response.data.image[0] }));
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'done' }));

        await logger({
          dp: 'ai.nova',
          el: 'nova_background_remove',
          gpt_ver: 'NOVA_REMOVE_BG'
        });

        const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
        showCreditToast(deductionCredit ?? '', leftCredit ?? '', 'credit');
      } else {
        const { leftCredit } = calLeftCredit(res.headers);
        handleRemoveBGError(response.error.code, Number(leftCredit));
      }
    } catch (err) {
      resetPageData(NOVA_TAB_TYPE.removeBG);
      resetPageResult(NOVA_TAB_TYPE.removeBG);
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'home' }));
      errorHandle(err);
    }
  };

  const handleRemoveBGError = (errCode: string, leftCredit: number) => {
    if (errCode === 'Timeout') {
      dispatch(
        setPageResult({
          tab: NOVA_TAB_TYPE.removeBG,
          result: {
            contentType: '',
            data: ''
          }
        })
      );
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'timeout' }));
    } else {
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));
      dispatch(resetPageData(NOVA_TAB_TYPE.removeBG));
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'home' }));
    }
    errorHandle({ code: errCode, credit: leftCredit });
  };

  return { handleRemoveBackground };
};
