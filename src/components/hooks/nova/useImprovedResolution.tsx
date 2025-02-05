import { track } from '@amplitude/analytics-browser';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_IMPROVED_RESOLUTION } from '../../../api/constant';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
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
import { useShowCreditToast } from '../useShowCreditToast';

export const useImprovedResolution = () => {
  const showCreditToast = useShowCreditToast();
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.improvedRes));

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
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.improvedRes, status: 'loading' }));
    try {
      const formData = await createFormDataFromFiles([currentFile]);
      const { res, logger } = await apiWrapper().request(NOVA_IMPROVED_RESOLUTION, {
        body: formData,
        method: 'POST'
      });

      const response = await res.json();
      if (response.success) {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.improvedRes, result: response.data.image[0] }));
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.improvedRes, status: 'done' }));

        await logger({
          dp: 'ai.nova',
          el: 'nova_resolution_elevation',
          gpt_ver: 'NOVA_PO_RESOLUTION'
        });
        track('click_nova_image', { image_name: 'NOVA_PO_RESOLUTION' });

        const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
        showCreditToast(deductionCredit ?? '', leftCredit ?? '', 'credit');
      } else {
        const { leftCredit } = calLeftCredit(res.headers);
        handleImprovedResError(response.error.code, Number(leftCredit));
      }
    } catch (err) {
      resetPageState();
      errorHandle(err);
    }
  };

  return { handleImprovedResolution };
};
