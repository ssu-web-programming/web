import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Composition from '../../img/nova/changeStyle/change_style_composition.png';
import Mosaic from '../../img/nova/changeStyle/change_style_mosaic.png';
import Scream from '../../img/nova/changeStyle/change_style_scream.png';
import Starry from '../../img/nova/changeStyle/change_style_starry.png';
import Wave from '../../img/nova/changeStyle/change_style_wave.png';
import { selectPageResult } from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
import { useChangeStyle } from '../hooks/nova/useChangeStyle';
import { ReactComponent as CheckIcon } from '../../img/ico_check.svg';

import GoBackHeader from './GoBackHeader';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  margin-top: 48px;
`;

const ImageBox = styled.div<{ isBordered: boolean }>`
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${(props) => (props.isBordered ? '1px solid #c9cdd2' : 'none')};
  border-radius: 8px;
  margin-top: 24px;

  div {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
  }
`;

const ThemeSelectionWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  span {
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
    color: #454c53;
  }
`;

const ThemeWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 7px;
  box-sizing: border-box;
`;

const ImageContainer = styled.div<{ isSelected: boolean }>`
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OuterBorder = styled.div<{ isSelected: boolean }>`
  display: ${(props) => (props.isSelected ? 'flex' : 'none')};
  width: 60px;
  height: 60px;
  position: absolute;
  border: 2px solid #6f3ad0;
  border-radius: 6px;
  pointer-events: none;
  z-index: 1;
`;

const InnerBorder = styled.div<{ isSelected: boolean }>`
  display: ${(props) => (props.isSelected ? 'flex' : 'none')};
  position: absolute;
  inset: 1px;
  border: 2px solid white;
  border-radius: 4px;
  pointer-events: none;
  z-index: 0;
`;

const Image = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
`;

const CheckBox = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 2px;
  left: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6f3ad0;

  svg {
    width: 13px;
    height: 14px;
    margin-left: -1px;
  }
`;

const Button = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.isActive ? '#6f3ad0' : '#f7f8f9')};
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${(props) => (props.isActive ? '#ffffff' : '#c9cdd2')};
  }
`;

const images = [
  { src: Composition, alt: 'composition' },
  { src: Mosaic, alt: 'mosaic' },
  { src: Starry, alt: 'starry-night' },
  { src: Scream, alt: 'the-scream' },
  { src: Wave, alt: 'the-wave' }
];

export default function Theme() {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const result = useAppSelector(selectPageResult(selectedNovaTab));
  const { handleChangeStyle } = useChangeStyle();

  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
  };

  return (
    <Wrap>
      <GoBackHeader />
      <Body>
        <ImageBox isBordered={selectedNovaTab === NOVA_TAB_TYPE.removeBG}>
          <div>
            <img src={`data:${result?.contentType};base64,${result?.data}`} alt="result" />
          </div>
        </ImageBox>
        <ThemeSelectionWrap>
          <span>{t(`Nova.Theme.Guide`)}</span>
          <ThemeWrap>
            {images.map((image) => (
              <ImageContainer key={image.src} isSelected={selectedImage?.src === image.src}>
                <OuterBorder isSelected={selectedImage?.src === image.src} />
                <InnerBorder isSelected={selectedImage?.src === image.src} />
                {selectedImage?.src === image.src && (
                  <CheckBox>
                    <CheckIcon />
                  </CheckBox>
                )}
                <Image
                  src={image.src}
                  alt={image.alt}
                  onClick={() => handleImageClick(image.src, image.alt)}
                />
              </ImageContainer>
            ))}
          </ThemeWrap>
        </ThemeSelectionWrap>
        <Button
          isActive={!!selectedImage}
          onClick={() => (selectedImage ? handleChangeStyle(selectedImage?.alt ?? '') : undefined)}>
          <span>{t(`Nova.Theme.Button`)}</span>
        </Button>
      </Body>
    </Wrap>
  );
}
