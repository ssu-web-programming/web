import { useTranslation } from 'react-i18next';

import { apiWrapper } from '../../../api/apiWrapper';
import { NOVA_REMOVE_BACKGROUND } from '../../../api/constant';
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
import { convertDriveFileToFile, createFormDataFromFiles } from '../../../util/files';
import { useConfirm } from '../../Confirm';

export const useRemoveBackground = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const currentFile = useAppSelector(selectPageData(NOVA_TAB_TYPE.removeBG));

  const handleRemoveBackground = async () => {
    if (!currentFile) return;

    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'loading' }));
    const file = await convertDriveFileToFile(currentFile);
    if (!file) return;

    if (await isPixelLimitExceeded(file, NOVA_TAB_TYPE.removeBG)) {
      await confirm({
        title: '',
        msg: t('Nova.Confirm.OverMaxFilePixel'),
        onOk: {
          text: t('OK'),
          callback: () => {}
        }
      });

      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'home' }));
      dispatch(resetPageData(NOVA_TAB_TYPE.removeBG));
      dispatch(setLocalFiles([]));
      dispatch(setDriveFiles([]));

      return;
    }

    try {
      const formData = await createFormDataFromFiles([currentFile]);
      const { res } = await apiWrapper().request(NOVA_REMOVE_BACKGROUND, {
        body: formData,
        method: 'POST'
      });
      const response = await res.json();
      if (response.success) {
        dispatch(setPageResult({ tab: NOVA_TAB_TYPE.removeBG, result: response.data.image[0] }));
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'done' }));
      } else {
        dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'timeout' }));
      }
    } catch (err) {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.removeBG, status: 'timeout' }));
    }
  };

  return { handleRemoveBackground };
};
