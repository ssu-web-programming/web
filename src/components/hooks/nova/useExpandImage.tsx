import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_EXPAND_IMAGE } from '../../../api/constant';
import { isPixelLimitExceeded } from '../../../constants/fileTypes';
import {
  resetPageData,
  selectPageData,
  setPageResult,
  setPageStatus
} from '../../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from '../../../store/slices/tabSlice';
import { setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { convertDriveFileToFile, createFormDataFromFiles, fileToBase64 } from '../../../util/files';
import { useConfirm } from '../../Confirm';

export const useExapandImage = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.expandImg));

  useEffect(() => {}, [currentFile]);

  const goExpandPage = async () => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'progress' }));
    const file = await convertDriveFileToFile(currentFile);
    if (!file) return;

    if (await isPixelLimitExceeded(file, NOVA_TAB_TYPE.expandImg)) {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.OverMaxFilePixel'),
        onOk: {
          text: t('OK'),
          callback: () => {}
        }
      });

      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'home' }));
      dispatch(resetPageData(NOVA_TAB_TYPE.expandImg));
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));

      return;
    }

    fileToBase64(file)
      .then((data) => {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.expandImg, result: data }));
      })
      .then(() => {
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'expand' }));
      });
  };

  const handleExpandImage = async (
    extend_left: number,
    extend_right: number,
    extend_up: number,
    extend_down: number
  ) => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'loading' }));
    try {
      const formData = await createFormDataFromFiles([currentFile]);
      formData.append('extend_left', String(extend_left));
      formData.append('extend_right', String(extend_right));
      formData.append('extend_up', String(extend_up));
      formData.append('extend_down', String(extend_down));

      const { res } = await apiWrapper().request(NOVA_EXPAND_IMAGE, {
        body: formData,
        method: 'POST'
      });

      const response = await res.json();
      if (response.success) {
        const image = response.data.image[0];
        dispatch(
          setPageResult({
            tab: NOVA_TAB_TYPE.expandImg,
            result: {
              contentType: image.contentType,
              data: image.data,
              info: prompt
            }
          })
        );
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'done' }));
      } else {
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'timeout' }));
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.expandImg, status: 'timeout' }));
    }
  };

  return { goExpandPage, handleExpandImage };
};
