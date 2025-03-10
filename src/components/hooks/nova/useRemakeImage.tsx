import { track } from '@amplitude/analytics-browser';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_REMAKE_IMAGE } from '../../../api/constant';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { getServiceLoggingInfo, SERVICE_TYPE } from '../../../constants/serviceType';
import {
  resetPageData,
  resetPageResult,
  selectPageData,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { getCurrentFile, setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { calLeftCredit } from '../../../util/common';
import { createFormDataFromFiles } from '../../../util/files';
import useErrorHandle from '../useErrorHandle';

export const useRemakeImage = () => {
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const curPageFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.removeBG));
  const currentFile = useAppSelector(getCurrentFile);

  const resetPageState = () => {
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'home' }));
    dispatch(resetPageData(NOVA_TAB_TYPE.remakeImg));
    dispatch(resetPageResult(NOVA_TAB_TYPE.remakeImg));
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
  };

  const handleRemakeImgError = (errCode: string, leftCredit: number) => {
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
      resetPageState();
    }
    errorHandle({ code: errCode, credit: leftCredit });
  };

  const handleRemakeImage = async () => {
    if (!curPageFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'loading' }));
    try {
      const formData = await createFormDataFromFiles([curPageFile]);
      const { res, logger } = await apiWrapper().request(NOVA_REMAKE_IMAGE, {
        body: formData,
        method: 'POST'
      });
      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);

      const response = await res.json();
      if (response.success) {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.remakeImg, result: response.data.image[0] }));
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'done' }));

        const log_info = getServiceLoggingInfo(SERVICE_TYPE.NOVA_REIMAGE_CLIPDROP);
        await logger({
          dp: 'ai.nova',
          el: log_info.name,
          gpt_ver: log_info.detail
        });
        track('nova_image', {
          image_name: 'NOVA_REIMAGE_CLIPDROP',
          file_id: currentFile.id,
          document_format: currentFile.ext,
          credit: deductionCredit,
          function_result: true
        });
      } else {
        handleRemakeImgError(response.error.code, Number(leftCredit));
        track('nova_image', {
          image_name: 'NOVA_REIMAGE_CLIPDROP',
          file_id: currentFile.id,
          document_format: currentFile.ext,
          function_result: false
        });
      }
    } catch (err) {
      resetPageState();
      errorHandle(err);
    }
  };

  return { handleRemakeImage };
};
