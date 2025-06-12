import { v4 } from 'uuid';

import { track } from '@amplitude/analytics-browser';

import { apiWrapper, sendNovaStatus } from '../../../api/apiWrapper';
import { NOVA_CHANGE_STYLE } from '../../../api/constant';
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
import { createFormDataFromFiles, fileToBase64 } from '../../../util/files';
import useErrorHandle from '../useErrorHandle';

export const useChangeStyle = () => {
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const curPageFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.changeStyle));
  const currentFile = useAppSelector(getCurrentFile);

  const resetPageState = () => {
    dispatch(resetPageData(NOVA_TAB_TYPE.changeStyle));
    dispatch(resetPageResult(NOVA_TAB_TYPE.changeStyle));
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'home' }));
  };

  const handleChangeStyleError = (errCode: string, leftCredit: number, style: string) => {
    if (errCode === 'Timeout') {
      dispatch(
        setPageResult({
          tab: NOVA_TAB_TYPE.changeStyle,
          result: {
            contentType: '',
            data: '',
            info: style
          }
        })
      );
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'timeout' }));
    } else {
      resetPageState();
    }
    errorHandle({ code: errCode, credit: leftCredit });
  };

  const goThemePage = async () => {
    if (!curPageFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'progress' }));
    try {
      fileToBase64(curPageFile)
        .then((data) => {
          dispatch(setPageResult({ tab: NOVA_TAB_TYPE.changeStyle, result: data }));
        })
        .then(() => {
          dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'theme' }));
        });
    } catch (err) {
      resetPageState();
      errorHandle(err);
    }
  };

  const handleChangeStyle = async (style: string) => {
    if (!curPageFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'loading' }));
    try {
      const formData = await createFormDataFromFiles([curPageFile]);
      formData.append('style', style);
      const { res, logger } = await apiWrapper().request(
        NOVA_CHANGE_STYLE,
        {
          body: formData,
          method: 'POST'
        },
        { name: NOVA_TAB_TYPE.changeStyle, uuid: v4() }
      );
      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);

      const response = await res.json();
      if (response.success) {
        const image = response.data.image[0];
        dispatch(
          setPageResult({
            tab: NOVA_TAB_TYPE.changeStyle,
            result: {
              contentType: image.contentType,
              data: image.data,
              info: style
            }
          })
        );
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'done' }));

        const log_info = getServiceLoggingInfo(SERVICE_TYPE.NOVA_PO_STYLE_TRANSFER);
        await logger({
          dp: 'ai.nova',
          el: log_info.name,
          gpt_ver: log_info.detail
        });
        await Bridge.callBridgeApi('amplitudeData', {
          type: 'nova_image',
          props: {
            image_name: 'NOVA_PO_STYLE_TRANSFER',
            file_id: currentFile.id,
            document_format: currentFile.ext,
            credit: deductionCredit,
            function_result: true
          }
        });
      } else {
        handleChangeStyleError(response.error.code, Number(leftCredit), style);
        await Bridge.callBridgeApi('amplitudeData', {
          type: 'nova_image',
          props: {
            image_name: 'NOVA_PO_STYLE_TRANSFER',
            file_id: currentFile.id,
            document_format: currentFile.ext,
            function_result: false
          }
        });
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'home' }));
      errorHandle(err);
    } finally {
      await sendNovaStatus({ name: NOVA_TAB_TYPE.changeStyle, uuid: '' }, 'finish');
    }
  };

  return { goThemePage, handleChangeStyle };
};
