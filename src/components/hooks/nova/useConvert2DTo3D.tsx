import { v4 } from 'uuid';

import { track } from '@amplitude/analytics-browser';

import { apiWrapper, sendNovaStatus } from '../../../api/apiWrapper';
import { NOVA_GENERATE_ANIMATION } from '../../../api/constant';
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
import Bridge from "../../../util/bridge";

export const useConvert2DTo3D = () => {
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const curPageFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.convert2DTo3D));
  const currentFile = useAppSelector(getCurrentFile);

  const resetPageState = () => {
    dispatch(resetPageData(NOVA_TAB_TYPE.convert2DTo3D));
    dispatch(resetPageResult(NOVA_TAB_TYPE.convert2DTo3D));
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles([]));
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'home' }));
  };

  const handleExpandError = (
    errCode: string,
    leftCredit: number,
    pattern: string,
    animationType: string
  ) => {
    if (errCode === 'Timeout') {
      dispatch(
        setPageResult({
          tab: NOVA_TAB_TYPE.convert2DTo3D,
          result: {
            contentType: '',
            data: '',
            info: { pattern, animationType }
          }
        })
      );
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'timeout' }));
    } else {
      resetPageState();
    }
    errorHandle({ code: errCode, credit: leftCredit });
  };

  const goConvertPage = async () => {
    if (!curPageFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'progress' }));
    try {
      const base64Data = await fileToBase64(curPageFile);
      dispatch(setPageResult({ tab: NOVA_TAB_TYPE.convert2DTo3D, result: base64Data }));
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'convert' }));
    } catch (err) {
      resetPageState();
      errorHandle(err);
    }
  };

  const handleConver2DTo3D = async (pattern: string, animationType: string) => {
    if (!curPageFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'loading' }));

    try {
      const formData = await createFormDataFromFiles([curPageFile]);
      formData.append('pattern', pattern);
      formData.append('animationType', animationType);

      const { res, logger } = await apiWrapper().request(
        NOVA_GENERATE_ANIMATION,
        {
          body: formData,
          method: 'POST'
        },
        { name: NOVA_TAB_TYPE.convert2DTo3D, uuid: v4() }
      );
      const { deductionCredit, leftCredit } = calLeftCredit(res.headers);

      const response = await res.json();
      if (response.success) {
        dispatch(
          setPageResult({
            tab: NOVA_TAB_TYPE.convert2DTo3D,
            result: {
              contentType: '',
              data: '',
              link: response.data.animationUrl,
              info: { pattern, animationType }
            }
          })
        );
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'done' }));

        const log_info = getServiceLoggingInfo(SERVICE_TYPE.NOVA_ANIMATION_3D_IMMERSITY);
        await logger({
          dp: 'ai.nova',
          el: log_info.name,
          gpt_ver: log_info.detail
        });
        await Bridge.callBridgeApi('amplitudeData', {
          type: 'nova_image',
          props: {
            image_name: 'Immersity',
            file_id: currentFile.id,
            document_format: currentFile.ext,
            credit: deductionCredit,
            function_result: true
          }
        });
      } else {
        handleExpandError(response.error.code, Number(leftCredit), pattern, animationType);
        await Bridge.callBridgeApi('amplitudeData', {
          type: 'nova_image',
          props: {
            image_name: 'Immersity',
            file_id: currentFile.id,
            document_format: currentFile.ext,
            function_result: false
          }
        });
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'home' }));
      errorHandle(err);
    } finally {
      await sendNovaStatus({ name: NOVA_TAB_TYPE.convert2DTo3D, uuid: '' }, 'finish');
    }
  };

  return { goConvertPage, handleConver2DTo3D };
};
