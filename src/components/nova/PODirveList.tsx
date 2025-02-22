import { useState } from 'react';
import { useConfirm } from 'components/Confirm';
import PoDrive from 'components/po-drive';
import { ALLOWED_MIME_TYPES, TRANSLATION_SUPPORT_TYPE } from 'constants/fileTypes';
import { useTranslation } from 'react-i18next';

import { NOVA_TAB_TYPE } from '../../constants/novaTapTypes';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { DriveFileInfo } from '../../store/slices/uploadFiles';
import { useAppSelector } from '../../store/store';
import DriveConfirm from '../DriveConfirm';
import useManageFile from '../hooks/nova/useManageFile';
import useUserInfoUtils from '../hooks/useUserInfoUtils';

interface PODriveListProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  uploadTarget: string;
  setUploadTarget: (uploadTarget: string) => void;
  onClearPastedImages?: () => void;
}

export default function PODriveList(props: PODriveListProps) {
  const { isOpen, setIsOpen, uploadTarget, setUploadTarget, onClearPastedImages } = props;
  const { t } = useTranslation();
  const { getMaxFilesPerUpload } = useUserInfoUtils();
  const { loadDriveFile } = useManageFile({ onClearPastedImages });
  const [selectedFiles, setSelectedFiles] = useState<DriveFileInfo[]>([]);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const confirm = useConfirm();

  const toggleDriveConfirm = () => {
    setIsOpen(!isOpen);
  };

  const handleDriveCancel = () => {
    toggleDriveConfirm();
    setUploadTarget('');
  };

  const validateTranslationFile = async (files: DriveFileInfo[]) => {
    if (!ALLOWED_MIME_TYPES.includes(files[0].type)) {
      await confirm({
        title: '',
        msg: t(`Nova.translation.Alert.CommonUnsupportFile`),
        onOk: {
          text: t('Confirm'),
          callback: () => {
            return;
          }
        }
      });

      return false;
    }

    if (files[0].size > 30 * 1024 * 1024) {
      await confirm({
        msg: `파일의 크기가 너무 큽니다. 30MB 이하의 파일만 선택해주세요.`
      });

      return false;
    }

    return true;
  };

  return (
    <DriveConfirm
      title={t('Nova.UploadTooltip.PolarisDrive')}
      msg={
        <>
          <PoDrive
            max={getMaxFilesPerUpload(selectedNovaTab)}
            target={uploadTarget}
            selectedFiles={selectedFiles}
            handleSelectedFiles={(files: DriveFileInfo[]) => {
              setSelectedFiles(files);
            }}
            isSingleFileSelection={selectedNovaTab != NOVA_TAB_TYPE.aiChat}
          />
        </>
      }
      onOk={{
        text: selectedFiles.length > 0 ? t('SelectionComplete') : t('Select'),
        callback: async () => {
          if (uploadTarget === 'nova-translation') {
            const isValid = await validateTranslationFile(selectedFiles);
            if (!isValid) {
              return;
            }
          }

          toggleDriveConfirm();
          loadDriveFile(selectedFiles);
        },
        disable: selectedFiles.length <= 0
      }}
      onCancel={{ text: t('Cancel'), callback: handleDriveCancel }}
    />
  );
}
