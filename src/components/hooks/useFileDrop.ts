import React, { useCallback, useState } from 'react';
import { getAccept } from '../nova/InputBar';
import { ClientType, getPlatform } from '../../util/bridge';
import { SUPPORT_DOCUMENT_TYPE, SUPPORT_IMAGE_TYPE } from '../../pages/Nova/Nova';
import { useTranslation } from 'react-i18next';
import { useConfirm } from '../Confirm';

export default function useFileDrop() {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, loadLocalFile: (files: File[]) => Promise<void>) => {
      event.preventDefault();
      event.stopPropagation();

      const files = Array.from(event.dataTransfer.files);
      const supportedExtensions = [
        ...SUPPORT_DOCUMENT_TYPE.map((type) => type.extensions),
        ...SUPPORT_IMAGE_TYPE.map((type) => type.extensions)
      ];

      const invalidFiles = files.filter((file) => {
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        return !supportedExtensions.includes(fileExtension);
      });
      const support = `Supported formats: ${supportedExtensions.join(', ')}`;

      if (invalidFiles.length > 0) {
        confirm({
          title: '',
          msg: t('Nova.Alert.CommonUnsupportFile', { support }),
          onOk: {
            text: t('Confirm'),
            callback: () => {}
          }
        });
        return;
      }
      loadLocalFile(files);
    },
    []
  );

  return {
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}
