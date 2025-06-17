import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import {
  AUDIO_SUPPORT_TYPE,
  compressImage,
  isPixelLimitExceeded,
  SUPPORT_IMAGE_TYPE
} from '../../constants/fileTypes';
import { NOVA_TAB_TYPE } from '../../constants/novaTapTypes';
import {
  selectPageData,
  setPageData,
  setPageStatus
} from '../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { getDriveFiles, getLocalFiles } from '../../store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { convertDriveFileToFile } from '../../util/files';
import { useConfirm } from '../Confirm';
import useErrorHandle from '../hooks/useErrorHandle';

import { FileUploader } from './FileUploader';

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 24px 16px;
  border: 1px dashed ${({ theme }) => theme.color.border.gray01};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background.gray01};
`;

interface ImageUploaderProps {
  handleUploadComplete?: () => void;
  children: React.ReactNode;
}

export default function ImageUploader({ handleUploadComplete, children }: ImageUploaderProps) {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const inputImgFileRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const errorHandle = useErrorHandle();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const localFiles = useAppSelector(getLocalFiles);
  const driveFiles = useAppSelector(getDriveFiles);
  const currentFile = useAppSelector(selectPageData(selectedNovaTab));

  useEffect(() => {
    if (currentFile && handleUploadComplete) {
      handleUploadComplete();
    } else {
      handleFileProcessing();
    }
  }, [localFiles, driveFiles, currentFile, selectedNovaTab]);

  const target = 'nova-image';

  const isSpecificFormat = (file: File) => {
    const extension = file?.name?.split('.').pop()?.toLowerCase();
    return extension === 'mp4' || extension === 'gif' || extension === 'bmp';
  };

  const getSelectedFile = async () => {
    // localFiles에 Audio 관련 파일이 있을 경우에는 handleFileProcessing 실행하지 않는다.
    if (AUDIO_SUPPORT_TYPE.find((el) => el.mimeType === localFiles[0]?.type)) {
      return null;
    }

    if (localFiles[0]) return localFiles[0];
    if (driveFiles[0]) {
      try {
        return await convertDriveFileToFile(driveFiles[0]);
      } catch (err) {
        errorHandle(err);
        return null;
      }
    }
    return null;
  };

  const handleFileProcessing = async () => {
    const selectedFile = await getSelectedFile();
    if (!selectedFile) {
      return;
    }

    try {
      dispatch(setPageStatus({ tab: selectedNovaTab, status: 'progress' }));
      let fileData: File = selectedFile;
      console.log('image Uploader file Data: ', fileData);

      if (isSpecificFormat(selectedFile)) {
        if (await isPixelLimitExceeded(selectedFile, selectedNovaTab)) {
          await confirm({
            title: '',
            msg: `${t('Nova.Confirm.OverMaxFilePixel')}\n\n${t(
              `Nova.${NOVA_TAB_TYPE.removeBG}.AllowImageSize`
            )}`,
            onOk: {
              text: t('OK'),
              callback: () => {
                return;
              }
            }
          });
        }
      } else {
        fileData = await compressImage(selectedFile, selectedNovaTab);
      }

      dispatch(
        setPageData({
          tab: selectedNovaTab,
          data: { file: fileData, info: selectedFile.name }
        })
      );
      dispatch(setPageStatus({ tab: selectedNovaTab, status: 'home' }));
    } catch (err) {
      dispatch(setPageStatus({ tab: selectedNovaTab, status: 'home' }));
      errorHandle(err);
    }
  };

  return (
    <Wrap>
      <FileUploader
        key={target}
        target={target}
        accept={SUPPORT_IMAGE_TYPE}
        inputRef={inputImgFileRef}
        tooltipStyle={{
          minWidth: '165px',
          top: '12px',
          left: 'unset',
          right: 'unset',
          bottom: 'unset',
          padding: '12px 16px'
        }}>
        {children}
      </FileUploader>
    </Wrap>
  );
}
