import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FileUpladState } from '../../constants/fileTypes';
import BlurIcon from '../../img/nova/bg_blur_loading.png';
import Spinner from '../../img/nova/nova_spinner_2x.webp';

const FileUploadWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: absolute;
  left: 0;
  top: 0;
  background-color: white;
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${BlurIcon});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;

  img {
    transform: scale(0.5);
  }

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #6f3ad0;
    white-space: break-spaces;
  }
`;

interface FileUploadingProps extends FileUpladState {
  onClickBack: () => void;
  progress: number;
}

export const FileUploading = (props: FileUploadingProps) => {
  const { type, state } = props;
  const { t } = useTranslation();
  if (state === 'ready') return null;

  return (
    <FileUploadWrapper>
      <Background>
        <img src={Spinner} alt="spinner" />
        <span>
          {state === 'upload'
            ? t(`Nova.UploadState.${state}_${type}`)
            : t(`Nova.UploadState.${state}`)}
        </span>
      </Background>
    </FileUploadWrapper>
  );
};
