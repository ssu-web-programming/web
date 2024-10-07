import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_EXPAND_IMAGE } from '../../../api/constant';
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
import { convertDriveFileToFile, createFormDataFromFiles, fileToBase64 } from '../../../util/files';
import { useConfirm } from '../../Confirm';
import useErrorHandle from '../useErrorHandle';
import { useShowCreditToast } from '../useShowCreditToast';

export const useExpandImage = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const showCreditToast = useShowCreditToast();
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.expandImg));

  useEffect(() => {}, [currentFile]);

  const goExpandPage = async () => {
    if (!currentFile) return;
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'progress' }));

    const file = await convertDriveFileToFile(currentFile);
    if (!file) return;

    if (await isPixelLimitExceeded(file, NOVA_TAB_TYPE.expandImg)) {
      await confirm({
        title: '',
        msg:
          t('Nova.Confirm.OverMaxFilePixel') +
          '\n\n' +
          t(`Nova.${NOVA_TAB_TYPE.expandImg}.AllowImageSize`),
        onOk: {
          text: t('OK'),
          callback: () => {}
        }
      });
      dispatch(resetPageData(NOVA_TAB_TYPE.expandImg));
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'home' }));
      return;
    }

    const base64Data = await fileToBase64(file);
    dispatch(setPageResult({ tab: NOVA_TAB_TYPE.expandImg, result: base64Data }));
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'expand' }));
  };

  const handleExpandImage = async (
    extend_left: number,
    extend_right: number,
    extend_up: number,
    extend_down: number
  ) => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'loading' }));

    try {
      const formData = await createFormDataFromFiles([currentFile]);
      formData.append('extend_left', String(extend_left));
      formData.append('extend_right', String(extend_right));
      formData.append('extend_up', String(extend_up));
      formData.append('extend_down', String(extend_down));

      const { res } = await apiWrapper().request(NOVA_EXPAND_IMAGE, {
        body: formData,
        method: 'POST'
      });
      const response = await res.json();

      if (response.success) {
        const image = response.data.image[0];
        dispatch(
          setPageResult({
            tab: NOVA_TAB_TYPE.expandImg,
            result: {
              contentType: image.contentType,
              data: image.data,
              info: { extend_left, extend_right, extend_up, extend_down }
            }
          })
        );
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'done' }));

        const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
        showCreditToast(deductionCredit ?? '', leftCredit ?? '', 'credit');
      } else {
        const { leftCredit } = calLeftCredit(res.headers);
        handleExpandError(response.error.code, Number(leftCredit), {
          extend_left,
          extend_right,
          extend_up,
          extend_down
        });
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'home' }));
      errorHandle(err);
    }
  };

  const handleExpandError = (
    errCode: string,
    leftCredit: number,
    { extend_left, extend_right, extend_up, extend_down }: any
  ) => {
    if (errCode === 'Timeout') {
      dispatch(
        setPageResult({
          tab: NOVA_TAB_TYPE.expandImg,
          result: {
            contentType: '',
            data: '',
            info: { extend_left, extend_right, extend_up, extend_down }
          }
        })
      );
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'timeout' }));
    } else {
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));
      dispatch(resetPageData(NOVA_TAB_TYPE.expandImg));
      resetPageResult(NOVA_TAB_TYPE.expandImg);
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'home' }));
    }
    errorHandle({ code: errCode, credit: leftCredit });
  };

  return { goExpandPage, handleExpandImage };
};
