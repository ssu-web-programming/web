import { useCallback } from 'react';
import { FileRejection } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import {
  isPixelLimitExceeded,
  SUPPORT_DOCUMENT_TYPE,
  SUPPORT_IMAGE_TYPE
} from '../../constants/fileTypes';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
import { useConfirm } from '../Confirm';

import useManageFile from './nova/useManageFile';
import useUserInfoUtils from './useUserInfoUtils';

export default function useFileDrop() {
  const { t } = useTranslation();
  const confirm = useConfirm();
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

      const supportedExtensions =
        selectedNovaTab === 'aiChat'
          ? [
              ...SUPPORT_DOCUMENT_TYPE.flatMap((type) => type.extensions),
              ...SUPPORT_IMAGE_TYPE.flatMap((type) => type.extensions)
            ]
          : [...SUPPORT_IMAGE_TYPE.flatMap((type) => type.extensions)];

      const invalidFiles = acceptedFiles.filter((file) => {
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        return !supportedExtensions.includes(fileExtension);
      });
      const support = `${supportedExtensions.join(', ')}`;

      if (invalidFiles.length > 0) {
        await confirm({
          title: '',
          msg: t('Nova.Alert.UnsupportFile', { support }),
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
