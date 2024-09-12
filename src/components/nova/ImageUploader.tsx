import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { SUPPORT_IMAGE_TYPE } from '../../constants/fileTypes';
import CreditIcon from '../../img/ico_credit_gray.svg';
import UploadIcon from '../../img/nova/upload_img.png';
import { getDriveFiles, getLocalFiles } from '../../store/slices/uploadFiles';
import { useAppSelector } from '../../store/store';

import { FileUploader } from './FileUploader';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 206px;
  margin: 0 16px;
  border: 1px dashed #c9cdd2;
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

const Icon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 48px;
    height: 48px;
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
}

export default function ImageUploader(props: ImageUploaderProps) {
  const { t } = useTranslation();
  const inputImgFileRef = useRef<HTMLInputElement | null>(null);
  const localFiles = useAppSelector(getLocalFiles);
  const driveFiles = useAppSelector(getDriveFiles);
  const target = 'nova-image';

  useEffect(() => {
    let file;
    if (localFiles.length > 0) file = localFiles[0];
    else if (driveFiles.length > 0) file = driveFiles[0];

    if (file) {
      props.handleUploadComplete();
    }
  }, [localFiles, driveFiles]);

  return (
    <Wrap>
      <FileUploader
        key={target}
        target={target}
        accept={SUPPORT_IMAGE_TYPE}
        inputRef={inputImgFileRef}
        tooltipStyle={{ inset: 'unset', top: '12px' }}>
        <ImageBox>
          <Icon>
            <img src={UploadIcon} alt="upload" />
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
