import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_CHANGE_BACKGROUND } from '../../../api/constant';
import { isPixelLimitExceeded } from '../../../constants/fileTypes';
import {
  resetPageData,
  selectPageData,
  selectPageStatus,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from '../../../store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { createFormDataFromFiles, fileToBase64 } from '../../../util/files';
import { useConfirm } from '../../Confirm';

export const useChangeBackground = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.changeBG));
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.changeBG));

  useEffect(() => {}, [currentFile]);

  const goPromptPage = async () => {
    if (!currentFile || status === 'progress') return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'progress' }));
    if (await isPixelLimitExceeded(currentFile, NOVA_TAB_TYPE.changeBG)) {
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

      return;
    }

    fileToBase64(currentFile)
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
      } else {
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'timeout' }));
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeBG, status: 'timeout' }));
    }
  };

  return { goPromptPage, handleChangeBackground };
};
