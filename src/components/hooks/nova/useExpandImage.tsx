import { track } from '@amplitude/analytics-browser';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_EXPAND_IMAGE } from '../../../api/constant';
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
import { createFormDataFromFiles, fileToBase64 } from '../../../util/files';
import useErrorHandle from '../useErrorHandle';

export const useExpandImage = () => {
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const curPageFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.expandImg));
  const currentFile = useAppSelector(getCurrentFile);

  const resetPageState = () => {
    dispatch(resetPageData(NOVA_TAB_TYPE.expandImg));
    dispatch(resetPageResult(NOVA_TAB_TYPE.expandImg));
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'home' }));
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
      resetPageState();
    }
    errorHandle({ code: errCode, credit: leftCredit });
  };

  const goExpandPage = async () => {
    if (!curPageFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'progress' }));
    try {
      const base64Data = await fileToBase64(curPageFile);
      dispatch(setPageResult({ tab: NOVA_TAB_TYPE.expandImg, result: base64Data }));
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'expand' }));
    } catch (err) {
      resetPageState();
      errorHandle(err);
    }
  };

  const handleExpandImage = async (
    extend_left: number,
    extend_right: number,
    extend_up: number,
    extend_down: number
  ) => {
    if (!curPageFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'loading' }));

    try {
      const formData = await createFormDataFromFiles([curPageFile]);
      formData.append('extend_left', String(extend_left));
      formData.append('extend_right', String(extend_right));
      formData.append('extend_up', String(extend_up));
      formData.append('extend_down', String(extend_down));

      const { res, logger } = await apiWrapper().request(NOVA_EXPAND_IMAGE, {
        body: formData,
        method: 'POST'
      });
      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);

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

        const log_info = getServiceLoggingInfo(SERVICE_TYPE.NOVA_UNCROP_CLIPDROP);
        await logger({
          dp: 'ai.nova',
          el: log_info.name,
          gpt_ver: log_info.detail
        });
        track('click_nova_image', {
          image_name: 'NOVA_UNCROP_CLIPDROP',
          file_id: currentFile.id,
          document_format: currentFile.ext,
          credit: deductionCredit
        });
      } else {
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

  return { goExpandPage, handleExpandImage };
};
