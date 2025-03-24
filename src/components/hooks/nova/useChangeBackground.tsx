import { v4 } from 'uuid';

import { track } from '@amplitude/analytics-browser';

import { apiWrapper, sendNovaStatus } from '../../../api/apiWrapper';
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
import { getCurrentFile, setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { calLeftCredit } from '../../../util/common';
import { createFormDataFromFiles, fileToBase64 } from '../../../util/files';
import useErrorHandle from '../useErrorHandle';

export const useChangeBackground = () => {
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const curPageFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.changeBG));
  const currentFile = useAppSelector(getCurrentFile);
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
    if (!curPageFile || status === 'progress') return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'progress' }));
    try {
      fileToBase64(curPageFile)
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
    if (!curPageFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'loading' }));
    try {
      const formData = await createFormDataFromFiles([curPageFile]);
      formData.append('prompt', prompt);
      const { res, logger } = await apiWrapper().request(
        NOVA_CHANGE_BACKGROUND,
        {
          body: formData,
          method: 'POST'
        },
        { name: NOVA_TAB_TYPE.changeBG, uuid: v4() }
      );
      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);

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
        track('nova_image', {
          image_name: 'NOVA_REPLACE_BG_CLIPDROP',
          file_id: currentFile.id,
          document_format: currentFile.ext,
          credit: deductionCredit,
          function_result: true
        });
      } else {
        handleChangeBGError(response.error.code, Number(leftCredit), prompt);
        track('nova_image', {
          image_name: 'NOVA_REPLACE_BG_CLIPDROP',
          file_id: currentFile.id,
          document_format: currentFile.ext,
          function_result: false
        });
      }
    } catch (err) {
      resetPageState();
      errorHandle(err);
    } finally {
      await sendNovaStatus({ name: NOVA_TAB_TYPE.changeBG, uuid: '' }, 'finish');
    }
  };

  return { goPromptPage, handleChangeBackground };
};
