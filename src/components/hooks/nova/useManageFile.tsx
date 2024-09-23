import { Dispatch, SetStateAction } from 'react';
import { useConfirm } from 'components/Confirm';
import { useTranslation } from 'react-i18next';

import { apiWrapper } from '../../../api/apiWrapper';
import { PO_DRIVE_FILEINFO, PO_DRIVE_LIST } from '../../../api/constant';
import {
  getMaxFileSize,
  isValidFileSize,
  MIN_FILE_UPLOAD_SIZE_KB,
  SUPPORT_DOCUMENT_TYPE,
  SUPPORT_IMAGE_TYPE,
  SupportFileType
} from '../../../constants/fileTypes';
import { novaHistorySelector } from '../../../store/slices/nova/novaHistorySlice';
import { selectTabSlice } from '../../../store/slices/tabSlice';
import { DriveFileInfo, setDriveFiles, setLocalFiles } from '../../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { getFileExtension } from '../../../util/common';
import { useChatNova } from '../useChatNova';
import useUserInfoUtils from '../useUserInfoUtils';

export function useManageFile() {
  const { t } = useTranslation();
  const chatNova = useChatNova();
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const novaHistory = useAppSelector(novaHistorySelector);
  const { getAvailableFileCnt } = useUserInfoUtils();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  const loadLocalFile = async (files: File[]) => {
    dispatch(setDriveFiles([]));

    const uploadLimit = getAvailableFileCnt();
    if (uploadLimit !== -1) {
      const invalidSize = files.filter((file) => !isValidFileSize(file.size, selectedNovaTab));
      if (invalidSize.length > 0) {
        confirm({
          title: '',
          msg: t('Nova.Alert.OverFileUploadSize', {
            max: getMaxFileSize(selectedNovaTab),
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

  interface getFileListProps {
    target: string;
    setState?: Dispatch<SetStateAction<'none' | 'request'>>;
    fileId?: DriveFileInfo['fileId'];
  }

  const getFileList = async (props: getFileListProps) => {
    const { target, setState, fileId } = props;

    try {
      if (setState) setState('request');
      const { res } = await apiWrapper().request(PO_DRIVE_LIST, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ fileId: fileId })
      });
      console.log('res: ', res);

      const {
        success,
        data: { list }
      } = await res.json();
      if (!success) throw new Error('failed to get file list');
      return list
        .filter(
          (item: DriveFileInfo) =>
            isValidFileSize(item.size, selectedNovaTab) || item.fileType === 'DIR'
        )
        .sort((l: DriveFileInfo, r: DriveFileInfo) =>
          l.fileType < r.fileType ? -1 : l.fileType > r.fileType ? 1 : 0
        )
        .map((item: DriveFileInfo) => {
          const ext = getFileExtension(item.fileName).toLowerCase();
          const supports = target === 'nova-image' ? SUPPORT_IMAGE_TYPE : SUPPORT_DOCUMENT_TYPE;
          const type = supports.find((type: SupportFileType) => type.extensions === ext)?.mimeType;

          return {
            ...item,
            name: item.fileName,
            type: type
          };
        })
        .filter((item: DriveFileInfo) => item.fileType === 'DIR' || !!item.type);
    } catch (err) {
      console.log(err);
      return []; // TODO : error handling
    } finally {
      if (setState) setState('none');
    }
  };

  const getFileInfo = async (fileId: string) => {
    try {
      const { res } = await apiWrapper().request(PO_DRIVE_FILEINFO, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ fileId: fileId })
      });

      const {
        success,
        data: { file }
      } = await res.json();
      if (!success) throw new Error('failed to get file list');
      return file;
    } catch (err) {
      return [];
    }
  };

  return {
    loadLocalFile,
    loadDriveFile,
    getFileList,
    getFileInfo
  };
}

export default useManageFile;
