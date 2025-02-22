import { track } from '@amplitude/analytics-browser';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_CHANGE_STYLE } from '../../../api/constant';
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

export const useChangeStyle = () => {
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.changeStyle));

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
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'progress' }));
    try {
      fileToBase64(currentFile)
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
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'loading' }));
    try {
      const formData = await createFormDataFromFiles([currentFile]);
      formData.append('style', style);
      const { res, logger } = await apiWrapper().request(NOVA_CHANGE_STYLE, {
        body: formData,
        method: 'POST'
      });
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

        await logger({
          dp: 'ai.nova',
          el: 'nova_style_change',
          gpt_ver: 'NOVA_PO_STYLE_TRANSFER'
        });
        track('click_nova_image', { image_name: 'NOVA_PO_STYLE_TRANSFER' });
      } else {
        const { leftCredit } = calLeftCredit(res.headers);
        handleChangeStyleError(response.error.code, Number(leftCredit), style);
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'home' }));
      errorHandle(err);
    }
  };

  return { goThemePage, handleChangeStyle };
};
