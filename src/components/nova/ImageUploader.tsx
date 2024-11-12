import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { compressImage, isPixelLimitExceeded, SUPPORT_IMAGE_TYPE } from '../../constants/fileTypes';
import CreditIcon from '../../img/ico_credit_gray.svg';
import { ReactComponent as UploadIcon } from '../../img/ico_upload_img_plus.svg';
import {
  selectPageData,
  setPageData,
  setPageStatus
} from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from '../../store/slices/tabSlice';
import { getDriveFiles, getLocalFiles } from '../../store/slices/uploadFiles';
import { userInfoSelector } from '../../store/slices/userInfo';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { convertDriveFileToFile } from '../../util/files';
import { useConfirm } from '../Confirm';
import useErrorHandle from '../hooks/useErrorHandle';

import { FileUploader } from './FileUploader';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 206px;
  padding: 0 16px;
  border: 0.5px dashed #c9cdd2;
  border-radius: 8px;
  background-color: white;
`;

const ImageBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Icon = styled.div<{ disable: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    width: 48px;
    height: 48px;

    cursor: ${(props) => (props.disable ? 'initial' : 'pointer')};
    color: ${(props) => (props.disable ? '#454c5380' : 'var(--gray-gray-80-02)')};
  }

  span {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: #454c53;
  }
`;

const Credit = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px 2px 2px 12px;
  background: #f2f4f6;
  border-radius: 999px;

  .img {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    padding-bottom: 2px;
    color: #454c53;
  }
`;

const Guide = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: #9ea4aa;
  white-space: break-spaces;
  text-align: center;
`;

interface ImageUploaderProps {
  guideMsg: string;
  handleUploadComplete: () => void;
  curTab: NOVA_TAB_TYPE;
}

export default function ImageUploader(props: ImageUploaderProps) {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const inputImgFileRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const errorHandle = useErrorHandle();
  const { novaAgreement: isAgreed } = useAppSelector(userInfoSelector);
  const localFiles = useAppSelector(getLocalFiles);
  const driveFiles = useAppSelector(getDriveFiles);
  const currentFile = useAppSelector(selectPageData(props.curTab));
  const target = 'nova-image';

  const isSpecificFormat = (file: File) => {
    const extension = file?.name?.split('.').pop()?.toLowerCase();
    return extension === 'mp4' || extension === 'gif' || extension === 'bmp';
  };

  const getSelectedFile = async () => {
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
    dispatch(setPageStatus({ tab: props.curTab, status: 'progress' }));

    const selectedFile = await getSelectedFile();
    if (!selectedFile) {
      dispatch(setPageStatus({ tab: props.curTab, status: 'home' }));
      return;
    }

    try {
      let fileData: File = selectedFile;

      if (await isPixelLimitExceeded(selectedFile, props.curTab)) {
        if (isSpecificFormat(selectedFile)) {
          await confirm({
            title: '',
            msg: `${t('Nova.Confirm.OverMaxFilePixel')}\n\n${t(
              `Nova.${NOVA_TAB_TYPE.removeBG}.AllowImageSize`
            )}`,
            onOk: {
              text: t('OK'),
              callback: () => {}
            }
          });
        } else {
          fileData = await compressImage(selectedFile, props.curTab);
        }
      }

      dispatch(
        setPageData({
          tab: props.curTab,
          data: fileData
        })
      );
      dispatch(setPageStatus({ tab: props.curTab, status: 'home' }));
    } catch (err) {
      dispatch(setPageStatus({ tab: props.curTab, status: 'home' }));
      errorHandle(err);
    }
  };

  useEffect(() => {
    if (currentFile) {
      props.handleUploadComplete();
    } else {
      handleFileProcessing();
    }
  }, [localFiles, driveFiles, currentFile, props.curTab]);

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
        <ImageBox>
          <Icon disable={isAgreed === undefined}>
            <UploadIcon />
            <span>{t(`Nova.UploadTooltip.UploadImage`)}</span>
          </Icon>
          <Credit>
            <span>10</span>
            <div className="img">
              <img src={CreditIcon} alt="credit" />
            </div>
          </Credit>
          <Guide>{props.guideMsg}</Guide>
        </ImageBox>
      </FileUploader>
    </Wrap>
  );
}
