import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_REMAKE_IMAGE } from '../../../api/constant';
import {
  resetPageData,
  resetPageResult,
  selectPageData,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from '../../../store/slices/tabSlice';
import { setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { calLeftCredit } from '../../../util/common';
import { createFormDataFromFiles } from '../../../util/files';
import useErrorHandle from '../useErrorHandle';
import { useShowCreditToast } from '../useShowCreditToast';

export const useRemakeImage = () => {
  const showCreditToast = useShowCreditToast();
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

        await logger({
          dp: 'ai.nova',
          el: 'nova_image_remake',
          gpt_ver: 'NOVA_REIMAGE_CLIPDROP'
        });

        const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
        showCreditToast(deductionCredit ?? '', leftCredit ?? '', 'credit');
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
