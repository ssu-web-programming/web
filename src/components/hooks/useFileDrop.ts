import { useCallback } from 'react';
import { FileRejection } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import {
  getMaxFileSize,
  getValidExt,
  isPixelLimitExceeded,
  isValidFileSize,
  MIN_FILE_UPLOAD_SIZE_KB,
  SUPPORT_DOCUMENT_TYPE
} from '../../constants/fileTypes';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useConfirm } from '../Confirm';

import useManageFile from './nova/useManageFile';
import useUserInfoUtils from './useUserInfoUtils';
import { setPageStatus } from '../../store/slices/nova/pageStatusSlice';

export default function useFileDrop() {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const { loadLocalFile } = useManageFile();
  const { getAvailableFileCnt, calcAvailableFileCnt } = useUserInfoUtils();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  const handleDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > calcAvailableFileCnt()) {
        await confirm({
          title: '',
          msg: t('Nova.Confirm.OverMaxFileUploadCntOnce', { max: getAvailableFileCnt() })!,
          onOk: {
            text: t('Confirm'),
            callback: () => {
              return;
            }
          }
        });
        return;
      }

      const invalidSize = acceptedFiles.filter(
        (file) => !isValidFileSize(file.size, selectedNovaTab)
      );
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

      const supportedExtensions =
        selectedNovaTab === 'aiChat'
          ? [
              ...SUPPORT_DOCUMENT_TYPE.flatMap((type) => type.extensions),
              ...getValidExt(selectedNovaTab).flatMap((type) => type.extensions)
            ]
          : [...getValidExt(selectedNovaTab).flatMap((type) => type.extensions)];

      const invalidFiles = acceptedFiles.filter((file) => {
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        return !supportedExtensions.includes(fileExtension);
      });

      if (invalidFiles.length > 0) {
        await confirm({
          title: '',
          msg: t('Nova.Alert.CommonUnsupportFile'),
          onOk: {
            text: t('Confirm'),
            callback: () => {
              return;
            }
          }
        });
        return;
      }

      acceptedFiles.map(async (file) => {
        if (await isPixelLimitExceeded(file, selectedNovaTab)) {
          await confirm({
            title: '',
            msg: t('Nova.Confirm.OverMaxFilePixel'),
            onOk: {
              text: t('OK'),
              callback: () => {
                dispatch(setPageStatus({ tab: selectedNovaTab, status: 'home' }));
                return;
              }
            }
          });
          return;
        }
      });

      loadLocalFile(acceptedFiles);
    },
    [confirm, t, loadLocalFile]
  );

  return {
    handleDrop
  };
}
