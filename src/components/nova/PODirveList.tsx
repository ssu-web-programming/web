import { useState } from 'react';
import PoDrive from 'components/po-drive';
import { useTranslation } from 'react-i18next';

import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
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
}

export default function PODriveList(props: PODriveListProps) {
  const { isOpen, setIsOpen, uploadTarget, setUploadTarget } = props;
  const { t } = useTranslation();
  const { getMaxFilesPerUpload } = useUserInfoUtils();
  const { loadDriveFile } = useManageFile();
  const [selectedFiles, setSelectedFiles] = useState<DriveFileInfo[]>([]);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  const toggleDriveConfirm = () => {
    setIsOpen(!isOpen);
    console.log('toggle - isOpen', isOpen);
  };

  const handleDriveCancel = () => {
    toggleDriveConfirm();
    setUploadTarget('');
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
        callback: () => {
          toggleDriveConfirm();
          loadDriveFile(selectedFiles);
        },
        disable: selectedFiles.length <= 0
      }}
      onCancel={{ text: t('Cancel'), callback: handleDriveCancel }}
    />
  );
}
