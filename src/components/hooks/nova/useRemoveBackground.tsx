import { track } from '@amplitude/analytics-browser';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_REMOVE_BACKGROUND } from '../../../api/constant';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { getServiceLoggingInfo, SERVICE_TYPE } from '../../../constants/serviceType';
import {
  resetPageData,
  selectPageCreditReceived,
  selectPageData,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { getCurrentFile, setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { calLeftCredit } from '../../../util/common';
import { createFormDataFromFiles } from '../../../util/files';
import useErrorHandle from '../useErrorHandle';

export const useRemoveBackground = () => {
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const curPageFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.removeBG));
  const currentFile = useAppSelector(getCurrentFile);

  const resetPageState = () => {
    dispatch(resetPageData(NOVA_TAB_TYPE.removeBG));
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'home' }));
  };

  const handleRemoveBGError = (errCode: string, leftCredit: number) => {
    if (errCode === 'Timeout') {
      dispatch(
        setPageResult({ tab: NOVA_TAB_TYPE.removeBG, result: { contentType: '', data: '' } })
      );
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'timeout' }));
    } else {
      resetPageState();
    }
    errorHandle({ code: errCode, credit: leftCredit });
  };

  const handleRemoveBackground = async () => {
    if (!curPageFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'loading' }));
    try {
      const formData = await createFormDataFromFiles([curPageFile]);
      const { res, logger } = await apiWrapper().request(NOVA_REMOVE_BACKGROUND, {
        body: formData,
        method: 'POST'
      });
      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);

      const response = await res.json();
      if (response.success) {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.removeBG, result: response.data.image[0] }));
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'done' }));

        const log_info = getServiceLoggingInfo(SERVICE_TYPE.NOVA_REMOVE_BG);
        await logger({
          dp: 'ai.nova',
          el: log_info.name,
          gpt_ver: log_info.detail
        });
        track('click_nova_image', {
          image_name: 'NOVA_REMOVE_BG',
          file_id: currentFile.id,
          document_format: currentFile.ext,
          credit: deductionCredit
        });
      } else {
        handleRemoveBGError(response.error.code, Number(leftCredit));
      }
    } catch (err) {
      resetPageState();
      errorHandle(err);
    }
  };

  return { handleRemoveBackground };
};
