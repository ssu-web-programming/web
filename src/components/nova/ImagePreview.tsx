import { useEffect, useState } from 'react';
import { ReactComponent as xMarkIcon } from 'img/ico_xmark.svg';
import styled, { css } from 'styled-components';

import { NovaFileInfo } from '../../store/slices/nova/novaHistorySlice';
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
  z-index: 10;

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
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (props.file) {
      console.log('luna preview: ', props.file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.onerror = (error) => {
        console.error('파일을 읽는 중 오류가 발생했습니다:', error);
      };
      reader.readAsDataURL(props.file);
    } else {
      setImageSrc(null);
    }
  }, [props.file]);

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
      {imageSrc && <img src={imageSrc} alt="preview" />}
    </ImagePreviewWrapper>
  );
};
