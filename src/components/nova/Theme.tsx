import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { ReactComponent as CheckIcon } from '../../img/light/ico_check.svg';
import Composition from '../../img/light/nova/changeStyle/change_style_composition.png';
import Mosaic from '../../img/light/nova/changeStyle/change_style_mosaic.png';
import Scream from '../../img/light/nova/changeStyle/change_style_scream.png';
import Starry from '../../img/light/nova/changeStyle/change_style_starry.png';
import Wave from '../../img/light/nova/changeStyle/change_style_wave.png';
import { selectPageResult } from '../../store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE, selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
import { useChangeStyle } from '../hooks/nova/useChangeStyle';

import GoBackHeader from './GoBackHeader';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex: 1 1 0;
  background: ${({ theme }) => theme.color.bg};
  overflow-y: auto;
`;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  width: 100%;
  padding: 0 16px;
  margin: auto;
  overflow-y: auto;
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
  margin-bottom: 16px;

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
    border-radius: 8px;
  }
`;

const ThemeSelectionWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;

  span {
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
    color: ${({ theme }) => theme.color.text.subGray03};
  }
`;

const ThemeWrap = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 60px);
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
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ isActive, theme }) =>
    isActive ? 'var(--ai-purple-50-main)' : theme.color.subBgGray06};
  border-radius: 8px;
  cursor: ${(props) => (props.isActive ? 'pointer' : 'default')};
  -webkit-tap-highlight-color: transparent;
  margin-bottom: 16px;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme, isActive }) => (isActive ? 'var(--white)' : theme.color.text.subGray08)};
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
      <Container>
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
            onClick={() =>
              selectedImage ? handleChangeStyle(selectedImage?.alt ?? '') : undefined
            }>
            <span>{t(`Nova.Theme.Button`)}</span>
          </Button>
        </Body>
      </Container>
    </Wrap>
  );
}
