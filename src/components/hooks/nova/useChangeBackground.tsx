import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_CHANGE_BACKGROUND } from '../../../api/constant';
import { isPixelLimitExceeded } from '../../../constants/fileTypes';
import {
  resetPageData,
  resetPageResult,
  selectPageData,
  selectPageStatus,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from '../../../store/slices/tabSlice';
import { setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { calLeftCredit } from '../../../util/common';
import { convertDriveFileToFile, createFormDataFromFiles, fileToBase64 } from '../../../util/files';
import { useConfirm } from '../../Confirm';
import useErrorHandle from '../useErrorHandle';
import { useShowCreditToast } from '../useShowCreditToast';

export const useChangeBackground = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const showCreditToast = useShowCreditToast();
  const errorHandle = useErrorHandle();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.changeBG));
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.changeBG));

  useEffect(() => {}, [currentFile]);

  const goPromptPage = async () => {
    if (!currentFile || status === 'progress') return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'progress' }));
    const file = await convertDriveFileToFile(currentFile);
    if (!file) return;

    if (await isPixelLimitExceeded(file, NOVA_TAB_TYPE.changeBG)) {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.OverMaxFilePixel'),
        onOk: {
          text: t('OK'),
          callback: () => {}
        }
      });

      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'home' }));
      dispatch(resetPageData(NOVA_TAB_TYPE.changeBG));
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));

      return;
    }

    fileToBase64(file)
      .then((data) => {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.changeBG, result: data }));
      })
      .then(() => {
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'prompt' }));
      });
  };

  const handleChangeBackground = async (prompt: string) => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'loading' }));

    try {
      const formData = await createFormDataFromFiles([currentFile]);
      formData.append('prompt', prompt);
      const { res } = await apiWrapper().request(NOVA_CHANGE_BACKGROUND, {
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

        const { deductionCredit, leftCredit } = calLeftCredit(res.headers);
        showCreditToast(deductionCredit ?? '', leftCredit ?? '', 'credit');
      } else {
        const { leftCredit } = calLeftCredit(res.headers);
        handleChangeBGError(response.error.code, Number(leftCredit), prompt);
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'home' }));
      errorHandle(err);
    }
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
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));
      dispatch(resetPageData(NOVA_TAB_TYPE.changeBG));
      resetPageResult(NOVA_TAB_TYPE.changeBG);
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'home' }));
    }
    errorHandle({ code: errCode, credit: leftCredit });
  };

  return { goPromptPage, handleChangeBackground };
};
