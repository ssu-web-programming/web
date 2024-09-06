import { useConfirm } from 'components/Confirm';
import { useTranslation } from 'react-i18next';

import {
  isValidFileSize,
  MAX_FILE_UPLOAD_SIZE_MB,
  MIN_FILE_UPLOAD_SIZE_KB
} from '../../../constants/fileTypes';
import { novaHistorySelector } from '../../../store/slices/novaHistorySlice';
import { setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { DriveFileInfo } from '../../PoDrive';
import { useChatNova } from '../useChatNova';
import useUserInfoUtils from '../useUserInfoUtils';

export function useManageFile() {
  const { t } = useTranslation();
  const chatNova = useChatNova();
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);
  const { getAvailableFileCnt } = useUserInfoUtils();

  const loadLocalFile = async (files: File[]) => {
    dispatch(setDriveFiles([])); // Redux 상태를 업데이트

    const uploadLimit = getAvailableFileCnt();
    if (uploadLimit !== -1) {
      const invalidSize = files.filter((file) => !isValidFileSize(file.size));
      if (invalidSize.length > 0) {
        confirm({
          title: '',
          msg: t('Nova.Alert.OverFileUploadSize', {
            max: MAX_FILE_UPLOAD_SIZE_MB,
            min: MIN_FILE_UPLOAD_SIZE_KB
          })!,
          onOk: {
            text: t('Confirm'),
            callback: () => {}
          }
        });
        return;
      }

      const uploadCnt = novaHistory.reduce((acc, cur) => {
        const len = cur.files?.length;
        if (len) return acc + len;
        else return acc;
      }, 0);

      if (files.length > uploadLimit) {
        await confirm({
          title: '',
          msg: t('Nova.Confirm.OverMaxFileUploadCntOnce', { max: uploadLimit })!,
          onOk: {
            text: t('Confirm'),
            callback: () => {}
          }
        });
        return;
      }

      if (uploadCnt + files.length > 3) {
        await confirm({
          title: '',
          msg: t('Nova.Confirm.OverMaxFileUploadCnt', { max: 3 })!,
          onOk: { text: t('Nova.Confirm.NewChat.StartNewChat'), callback: chatNova.newChat },
          onCancel: {
            text: t('Cancel'),
            callback: () => {}
          }
        });
        return;
      }
    }
    dispatch(setLocalFiles(files));
  };

  const loadDriveFile = (files: DriveFileInfo[]) => {
    dispatch(setLocalFiles([]));
    dispatch(setDriveFiles(files));
  };

  return {
    loadLocalFile,
    loadDriveFile
  };
}

export default useManageFile;
