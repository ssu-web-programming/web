import { v4 } from 'uuid';

import { track } from '@amplitude/analytics-browser';

import { apiWrapper, sendNovaStatus } from '../../../api/apiWrapper';
import { NOVA_IMPROVED_RESOLUTION } from '../../../api/constant';
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
import Bridge from '../../../util/bridge';
import { calLeftCredit } from '../../../util/common';
import { createFormDataFromFiles } from '../../../util/files';
import useErrorHandle from '../useErrorHandle';

export const useImprovedResolution = () => {
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const curPageFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.improvedRes));
  const currentFile = useAppSelector(getCurrentFile);

  const resetPageState = () => {
    dispatch(resetPageData(NOVA_TAB_TYPE.improvedRes));
    dispatch(resetPageResult(NOVA_TAB_TYPE.improvedRes));
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.improvedRes, status: 'home' }));
  };

  const handleImprovedResError = (errCode: string, leftCredit: number) => {
    if (errCode === 'Timeout') {
      dispatch(
        setPageResult({
          tab: NOVA_TAB_TYPE.improvedRes,
          result: {
            contentType: '',
            data: ''
          }
        })
      );
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.improvedRes, status: 'timeout' }));
    } else {
      resetPageState();
    }
    errorHandle({ code: errCode, credit: leftCredit });
  };

  const handleImprovedResolution = async () => {
    if (!curPageFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.improvedRes, status: 'loading' }));
    try {
      const formData = await createFormDataFromFiles([curPageFile.file]);
      const { res, logger } = await apiWrapper().request(
        NOVA_IMPROVED_RESOLUTION,
        {
          body: formData,
          method: 'POST'
        },
        { name: NOVA_TAB_TYPE.improvedRes, uuid: v4() }
      );
      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);

      const response = await res.json();
      if (response.success) {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.improvedRes, result: response.data.image[0] }));
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.improvedRes, status: 'done' }));

        const log_info = getServiceLoggingInfo(SERVICE_TYPE.NOVA_PO_RESOLUTION);
        await logger({
          dp: 'ai.nova',
          el: log_info.name,
          gpt_ver: log_info.detail
        });
        await Bridge.callBridgeApi('amplitudeData', {
          type: 'nova_image',
          props: {
            image_name: 'NOVA_PO_RESOLUTION',
            file_id: currentFile.id,
            document_format: currentFile.ext,
            credit: deductionCredit,
            function_result: true
          }
        });
      } else {
        handleImprovedResError(response.error.code, Number(leftCredit));
        await Bridge.callBridgeApi('amplitudeData', {
          type: 'nova_image',
          props: {
            image_name: 'NOVA_PO_RESOLUTION',
            file_id: currentFile.id,
            document_format: currentFile.ext,
            function_result: false
          }
        });
      }
    } catch (err) {
      resetPageState();
      errorHandle(err);
    } finally {
      await sendNovaStatus({ name: NOVA_TAB_TYPE.improvedRes, uuid: '' }, 'finish');
    }
  };

  return { handleImprovedResolution };
};
