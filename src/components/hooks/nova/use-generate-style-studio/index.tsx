import { v4 } from 'uuid';

import { apiWrapper, sendNovaStatus } from '../../../../api/apiWrapper';
import { NOVA_CHANGE_STYLE, NOVA_GENERATE_STYLE } from '../../../../api/constant';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import { getServiceLoggingInfo, SERVICE_TYPE } from '../../../../constants/serviceType';
import {
  resetPageData,
  resetPageResult,
  selectPageData,
  setPageResult,
  setPageStatus
} from '../../../../store/slices/nova/pageStatusSlice';
import { getCurrentFile, setDriveFiles, setLocalFiles } from '../../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import Bridge from '../../../../util/bridge';
import { calLeftCredit } from '../../../../util/common';
import { createFormDataFromFiles, fileToBase64 } from '../../../../util/files';
import useErrorHandle from '../../useErrorHandle';

export const useGenerateStyleStudio = () => {
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const curPageFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.styleStudio));
  const currentFile = useAppSelector(getCurrentFile);

  const resetPageState = () => {
    dispatch(resetPageData(NOVA_TAB_TYPE.styleStudio));
    dispatch(resetPageResult(NOVA_TAB_TYPE.styleStudio));
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.styleStudio, status: 'home' }));
  };

  const handleGenerateStyleError = (errCode: string, leftCredit: number, style: string) => {
    if (errCode === 'Timeout') {
      dispatch(
        setPageResult({
          tab: NOVA_TAB_TYPE.styleStudio,
          result: {
            contentType: '',
            data: '',
            info: style
          }
        })
      );
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.styleStudio, status: 'timeout' }));
    } else {
      resetPageState();
    }
    errorHandle({ code: errCode, credit: leftCredit });
  };

  const goStylePage = async () => {
    if (!curPageFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.styleStudio, status: 'progress' }));
    try {
      fileToBase64(curPageFile)
        .then((data) => {
          dispatch(setPageResult({ tab: NOVA_TAB_TYPE.styleStudio, result: data }));
        })
        .then(() => {
          dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.styleStudio, status: 'theme' }));
        });
    } catch (err) {
      resetPageState();
      errorHandle(err);
    }
  };

  const handleGenerateStyle = async (style: string, prompt?: string) => {
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.styleStudio, status: 'loading' }));
    try {
      const formData = curPageFile
        ? await createFormDataFromFiles([curPageFile], 'image')
        : new FormData();
      formData.append('style', style);
      formData.append('prompt', prompt ?? '');
      const { res, logger } = await apiWrapper().request(
        NOVA_GENERATE_STYLE,
        {
          body: formData,
          method: 'POST'
        },
        { name: NOVA_TAB_TYPE.styleStudio, uuid: v4() }
      );
      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);

      const response = await res.json();
      if (response.success) {
        dispatch(
          setPageResult({
            tab: NOVA_TAB_TYPE.styleStudio,
            result: {
              contentType: '',
              data: '',
              link: response.data.imageUrl,
              info: {
                style: style,
                prompt: prompt ?? ''
              }
            }
          })
        );
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.styleStudio, status: 'done' }));

        const log_info = getServiceLoggingInfo(SERVICE_TYPE.NOVA_STYLE_STUDIO);
        await logger({
          dp: 'ai.nova',
          el: log_info.name,
          gpt_ver: log_info.detail,
          type: style
        });
        await Bridge.callBridgeApi('amplitudeData', {
          type: 'nova_image',
          props: {
            image_name: 'NOVA_STYLE_STUDIO',
            file_id: currentFile.id,
            document_format: currentFile.ext,
            credit: deductionCredit,
            function_result: true
          }
        });
      } else {
        handleGenerateStyleError(response.error.code, Number(leftCredit), style);
        await Bridge.callBridgeApi('amplitudeData', {
          type: 'nova_image',
          props: {
            image_name: 'NOVA_STYLE_STUDIO',
            file_id: currentFile.id,
            document_format: currentFile.ext,
            function_result: false
          }
        });
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.styleStudio, status: 'home' }));
      errorHandle(err);
    } finally {
      await sendNovaStatus({ name: NOVA_TAB_TYPE.styleStudio, uuid: '' }, 'finish');
    }
  };

  return { goStylePage, handleGenerateStyle };
};
