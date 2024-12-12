import React from 'react';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';
import styled from 'styled-components';

import { FileUpladState } from '../../constants/fileTypes';
import BlurDarkIcon from '../../img/dark/nova/bg_blur_loading.svg';
import SpinnerDark from '../../img/dark/nova/nova_spinner.json';
import BlurLightIcon from '../../img/light/nova/bg_blur_loading.png';
import SpinnerLight from '../../img/light/nova/nova_spinner.json';
import { themeInfoSelector } from '../../store/slices/theme';
import { useAppSelector } from '../../store/store';

const FileUploadWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: absolute;
  left: 0;
  top: 0;
  background: ${({ theme }) => theme.color.bg};
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: ${({ theme }) =>
    theme.mode === 'light' ? `url(${BlurLightIcon})` : `url(${BlurDarkIcon})`};
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  gap: 8px;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.color.text.main02};
    white-space: break-spaces;
    text-align: center;
  }
`;

interface FileUploadingProps extends FileUpladState {
  progress: number;
}

export const FileUploading = (props: FileUploadingProps) => {
  const { type, state } = props;
  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);

  if (state === 'ready') return null;

  return (
    <FileUploadWrapper>
      <Background>
        <Lottie
          animationData={isLightMode ? SpinnerLight : SpinnerDark}
          loop
          play
          style={{ width: 56, height: 56 }}
        />
        <span>
          {state === 'upload'
            ? t(`Nova.UploadState.${state}_${type}`)
            : t(`Nova.UploadState.${state}`)}
        </span>
      </Background>
    </FileUploadWrapper>
  );
};
