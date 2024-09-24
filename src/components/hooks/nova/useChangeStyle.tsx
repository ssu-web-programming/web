import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_CHANGE_STYLE } from '../../../api/constant';
import { isPixelLimitExceeded } from '../../../constants/fileTypes';
import {
  resetPageData,
  selectPageData,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from '../../../store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { createFormDataFromFiles, fileToBase64 } from '../../../util/files';
import { useConfirm } from '../../Confirm';

export const useChangeStyle = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.changeStyle));

  useEffect(() => {}, [currentFile]);

  const goThemePage = async () => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'progress' }));
    if (await isPixelLimitExceeded(currentFile, NOVA_TAB_TYPE.changeStyle)) {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.OverMaxFilePixel'),
        onOk: {
          text: t('OK'),
          callback: () => {}
        }
      });

      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'home' }));
      dispatch(resetPageData(NOVA_TAB_TYPE.changeStyle));

      return;
    }

    fileToBase64(currentFile)
      .then((data) => {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.changeStyle, result: data }));
      })
      .then(() => {
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'theme' }));
      });
  };

  const handleChangeStyle = async (style: string) => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'loading' }));

    try {
      const formData = await createFormDataFromFiles([currentFile]);
      formData.append('style', style);
      const { res } = await apiWrapper().request(NOVA_CHANGE_STYLE, {
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
              info: prompt
            }
          })
        );
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'done' }));
      } else {
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'timeout' }));
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.changeStyle, status: 'timeout' }));
    }
  };

  return { goThemePage, handleChangeStyle };
};
