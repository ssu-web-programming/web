import { track } from '@amplitude/analytics-browser';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_CHANGE_BACKGROUND } from '../../../api/constant';
import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import { getServiceLoggingInfo, SERVICE_TYPE } from '../../../constants/serviceType';
import {
  resetPageData,
  resetPageResult,
  selectPageData,
  selectPageStatus,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { calLeftCredit } from '../../../util/common';
import { createFormDataFromFiles, fileToBase64 } from '../../../util/files';
import useErrorHandle from '../useErrorHandle';

export const useChangeBackground = () => {
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.changeBG));
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.changeBG));

  const resetPageState = () => {
    dispatch(resetPageData(NOVA_TAB_TYPE.changeBG));
    dispatch(resetPageResult(NOVA_TAB_TYPE.changeBG));
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'home' }));
  };

  const handleChangeBGError = (errCode: string, leftCredit: number, prompt: string) => {
    if (errCode === 'Timeout') {
      dispatch(
        setPageResult({
          tab: NOVA_TAB_TYPE.changeBG,
          result: {
            contentType: '',
            data: '',
            info: prompt
          }
        })
      );
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'timeout' }));
    } else {
      resetPageState();
    }
    errorHandle({ code: errCode, credit: leftCredit });
  };

  const goPromptPage = async () => {
    if (!currentFile || status === 'progress') return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'progress' }));
    try {
      fileToBase64(currentFile)
        .then((data) => {
          dispatch(setPageResult({ tab: NOVA_TAB_TYPE.changeBG, result: data }));
        })
        .then(() => {
          dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'prompt' }));
        });
    } catch (err) {
      resetPageState();
      errorHandle(err);
    }
  };

  const handleChangeBackground = async (prompt: string) => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'loading' }));
    try {
      const formData = await createFormDataFromFiles([currentFile]);
      formData.append('prompt', prompt);
      const { res, logger } = await apiWrapper().request(NOVA_CHANGE_BACKGROUND, {
        body: formData,
        method: 'POST'
      });
      const response = await res.json();
      if (response.success) {
        const image = response.data.image[0];
        dispatch(
          setPageResult({
            tab: NOVA_TAB_TYPE.changeBG,
            result: {
              contentType: image.contentType,
              data: image.data,
              info: prompt
            }
          })
        );
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'done' }));

        const log_info = getServiceLoggingInfo(SERVICE_TYPE.NOVA_REPLACE_BG_CLIPDROP);
        await logger({
          dp: 'ai.nova',
          el: log_info.name,
          gpt_ver: log_info.detail
        });
        track('click_nova_image', { image_name: 'NOVA_REPLACE_BG_CLIPDROP' });
      } else {
        const { leftCredit } = calLeftCredit(res.headers);
        handleChangeBGError(response.error.code, Number(leftCredit), prompt);
      }
    } catch (err) {
      resetPageState();
      errorHandle(err);
    }
  };

  return { goPromptPage, handleChangeBackground };
};
