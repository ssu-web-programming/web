import React from 'react';
import IconButton from 'components/buttons/IconButton';
import IconTextButton from 'components/buttons/IconTextButton';
import { ReactComponent as closeIcon } from 'img/light/ico_ai_close.svg';
import ico_download from 'img/light/ico_download.svg';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

type OverlayProps = {
  image?: string;
  onClose?: () => void;
  onSave?: () => void;
};

const OverlayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 24px;
  background: #fff linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ImageModal = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 12px 0px #00000026;

  > img {
    width: 100%;
    height: 100%;
    display: block;
  }

  button {
    width: 100%;
    height: 48px;
    background: #fff;
    border: none;
    border-radius: 0;

    position: absolute;
    bottom: 0;

    span {
      font-size: 15px;
      font-weight: 500;
      line-height: 16px;
      color: var(--gray-gray-80-02);
    }
  }
`;

const Overlay: React.FC<OverlayProps> = ({ image, onClose, onSave }) => {
  const { t } = useTranslation();
  return (
    <OverlayWrapper>
      <IconButton
        iconSize="lg"
        cssExt={css`
          color: #fff;
          padding: 0;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        `}
        iconComponent={closeIcon}
        onClick={onClose}
      />

      <ImageModal>
        <img src={image} alt="Modal" />
        <IconTextButton iconSize={24} iconSrc={ico_download} iconPos="left" onClick={onSave}>
          <span>{t('Save')}</span>
        </IconTextButton>
      </ImageModal>
    </OverlayWrapper>
  );
};

export default Overlay;
