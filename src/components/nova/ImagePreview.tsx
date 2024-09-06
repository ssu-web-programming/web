import { ReactComponent as xMarkIcon } from 'img/ico_xmark.svg';
import styled, { css } from 'styled-components';

import { NovaFileInfo } from '../../store/slices/novaHistorySlice';
import IconButton from '../buttons/IconButton';

const ImagePreviewWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
  padding: 10px;

  .btns {
    position: absolute;
    top: 12px;
    right: 16px;
    z-index: 1;
  }

  img {
    background-color: white;
    position: fixed;
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
`;

interface ImagePreviewProps extends NovaFileInfo {
  onClose: () => void;
}

export const ImagePreview = (props: ImagePreviewProps) => {
  return (
    <ImagePreviewWrapper>
      <div className="btns">
        <IconButton
          iconSize="lg"
          cssExt={css`
            color: #fff;
            padding: 0;
            width: 100%;
            display: flex;
            justify-content: flex-end;
          `}
          iconComponent={xMarkIcon}
          onClick={() => props.onClose()}
        />
      </div>
      <img src={URL.createObjectURL(props.file)} alt="preview" />
    </ImagePreviewWrapper>
  );
};
