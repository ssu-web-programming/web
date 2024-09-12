import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { getMaxFileSize } from '../../constants/fileTypes';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
import DriveConfirm from '../DriveConfirm';
import useManageFile from '../hooks/nova/useManageFile';
import useUserInfoUtils from '../hooks/useUserInfoUtils';
import PoDrive, { DriveFileInfo } from '../PoDrive';

const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  margin-bottom: 24px;
`;

interface PODriveListProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  uploadTarget: string;
  setUploadTarget: (uploadTarget: string) => void;
}

export default function PODriveList(props: PODriveListProps) {
  const { isOpen, setIsOpen, uploadTarget, setUploadTarget } = props;
  const { t } = useTranslation();
  const { calcAvailableFileCnt } = useUserInfoUtils();
  const { loadDriveFile } = useManageFile();
  const [selectedFiles, setSelectedFiles] = useState<DriveFileInfo[]>([]);
  const { selectedNovaTab } = useAppSelector(selectTabSlice);

  const toggleDriveConfirm = () => {
    setIsOpen(!isOpen);
  };

  const handleDriveCancel = () => {
    toggleDriveConfirm();
    setUploadTarget('');
  };

  const getTranslationKey = (): string => {
    if (selectedNovaTab === NOVA_TAB_TYPE.aiChat) {
      if (calcAvailableFileCnt() >= 0) {
        return uploadTarget === 'nova-file' ? 'Nova.PoDrive.LimitDesc' : 'Nova.PoDrive.DescImg';
      } else {
        return 'Nova.PoDrive.Desc';
      }
    } else {
      return 'Nova.PoDrive.Desc';
    }
  };

  return (
    <DriveConfirm
      title={t('Nova.UploadTooltip.PolarisDrive')}
      msg={
        <>
          <SubTitle>
            {t(getTranslationKey(), {
              size: getMaxFileSize(selectedNovaTab),
              count: calcAvailableFileCnt()
            })}
          </SubTitle>

          <PoDrive
            max={calcAvailableFileCnt()}
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
