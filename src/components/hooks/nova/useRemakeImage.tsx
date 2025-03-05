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
import { setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { calLeftCredit } from '../../../util/common';
import { createFormDataFromFiles } from '../../../util/files';
import useErrorHandle from '../useErrorHandle';

export const useRemakeImage = () => {
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.remakeImg));

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
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.remakeImg, status: 'loading' }));
    try {
      const formData = await createFormDataFromFiles([currentFile]);
      const { res, logger } = await apiWrapper().request(NOVA_REMAKE_IMAGE, {
        body: formData,
        method: 'POST'
      });

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
        track('click_nova_image', { image_name: 'NOVA_REIMAGE_CLIPDROP' });
      } else {
        const { leftCredit } = calLeftCredit(res.headers);
        handleRemakeImgError(response.error.code, Number(leftCredit));
      }
    } catch (err) {
      resetPageState();
      errorHandle(err);
    }
  };

  return { handleRemakeImage };
};
