import { track } from '@amplitude/analytics-browser';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_GENERATE_ANIMATION } from '../../../api/constant';
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
import { createFormDataFromFiles, fileToBase64 } from '../../../util/files';
import useErrorHandle from '../useErrorHandle';
import { useShowCreditToast } from '../useShowCreditToast';

export const useConvert2DTo3D = () => {
  const showCreditToast = useShowCreditToast();
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.convert2DTo3D));

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
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'progress' }));
    try {
      const base64Data = await fileToBase64(currentFile);
      dispatch(setPageResult({ tab: NOVA_TAB_TYPE.convert2DTo3D, result: base64Data }));
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'convert' }));
    } catch (err) {
      resetPageState();
      errorHandle(err);
    }
  };

  const handleConver2DTo3D = async (pattern: string, animationType: string) => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'loading' }));

    try {
      const formData = await createFormDataFromFiles([currentFile]);
      formData.append('pattern', pattern);
      formData.append('animationType', animationType);

      const { res, logger } = await apiWrapper().request(NOVA_GENERATE_ANIMATION, {
        body: formData,
        method: 'POST'
      });
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

        await logger({
          dp: 'ai.nova',
          el: 'transform_3d', // nova_transform_3d으로 바꾸기!!!!!
          gpt_ver: 'immersity'
        });
        track('click_nova_image', { image_name: 'Immersity' });

        const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
        showCreditToast(deductionCredit ?? '', leftCredit ?? '', 'credit');
      } else {
        const { leftCredit } = calLeftCredit(res.headers);
        handleExpandError(response.error.code, Number(leftCredit), pattern, animationType);
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.convert2DTo3D, status: 'home' }));
      errorHandle(err);
    }
  };

  return { goConvertPage, handleConver2DTo3D };
};
