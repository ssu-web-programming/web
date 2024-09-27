import { useTranslation } from 'react-i18next';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_REMAKE_IMAGE } from '../../../api/constant';
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

export const useRemakeImage = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const showCreditToast = useShowCreditToast();
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.remakeImg));

  const handleRemakeImage = async () => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'loading' }));
    const file = await convertDriveFileToFile(currentFile);
    if (!file) return;

    if (await isPixelLimitExceeded(file, NOVA_TAB_TYPE.remakeImg)) {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.OverMaxFilePixel'),
        onOk: {
          text: t('OK'),
          callback: () => {}
        }
      });

      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'home' }));
      dispatch(resetPageData(NOVA_TAB_TYPE.remakeImg));
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));

      return;
    }

    try {
      const formData = await createFormDataFromFiles([currentFile]);
      const { res } = await apiWrapper().request(NOVA_REMAKE_IMAGE, {
        body: formData,
        method: 'POST'
      });
      const response = await res.json();
      if (response.success) {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.remakeImg, result: response.data.image[0] }));
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'done' }));

        const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
        showCreditToast(deductionCredit ?? '', leftCredit ?? '', 'credit');
      } else {
        handleRemakeImgError(response.error.code);
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'home' }));
      errorHandle(err);
    }
  };

  const handleRemakeImgError = (errCode: string) => {
    if (errCode === 'Timeout') {
      dispatch(
        setPageResult({
          tab: NOVA_TAB_TYPE.remakeImg,
          result: {
            contentType: '',
            data: ''
          }
        })
      );
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'timeout' }));
    } else {
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));
      resetPageResult(NOVA_TAB_TYPE.remakeImg);
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'home' }));
    }
    errorHandle(errCode);
  };

  return { handleRemakeImage };
};
