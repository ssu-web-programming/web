import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import CustomIcon from '../../img/nova/expandImg/customization.png';
import HorizontalIcon from '../../img/nova/expandImg/horizontal.png';
import SqureIcon from '../../img/nova/expandImg/square.png';
import VerticalIcon from '../../img/nova/expandImg/vertical.png';
import MultiplyIcon from '../../img/nova/expandImg/xmark.png';
import { selectPageResult } from '../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
import { useExpandImage } from '../hooks/nova/useExpandImage';
import SelectBox from '../SelectBox';

import GoBackHeader from './GoBackHeader';
import ResizableContainer, { BoxInfo } from './ResizableContainer';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 16px;
  margin-top: 97px;
`;

const ImageBox = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 100%;
  border-radius: 8px;
  touch-action: none;
`;

const Box = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(244, 246, 248);

  img {
    position: absolute;
  }
`;

const CustomWrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 24px;
    height: 24px;
  }
`;

const InputBox = styled(TextField)`
  input {
    padding: 12px 16px;
    font-size: 16px;
    font-family: Pretendard, sans-serif;
    font-weight: 500;
    text-align: center;
    letter-spacing: -0.5px;
    color: #454c53;
  }

  legend {
    display: none;
  }

  .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    height: 48px;
    top: 0;
    border-color: #c9cdd2 !important;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #6f3ad0 !important;
    border-width: 1px;
  }
`;

const ButtonWrap = styled.div`
  width: 100%;
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6f3ad0;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: white;
  }

  img {
    position: absolute;
    right: 12px;
  }
`;

export default function Expand() {
  const { t } = useTranslation();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const { handleExpandImage } = useExpandImage();
  const result = useAppSelector(selectPageResult(selectedNovaTab));

  const imageBoxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [dimension, setDimensions] = useState<number | null>(null);
  const [boxInfo, setBoxInfo] = useState<BoxInfo>({ width: 0, height: 0, top: 0, left: 0 });
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [inputWidth, setInputWidth] = useState<number>(0);
  const [inputHeight, setInputHeight] = useState<number>(0);

  const SelectBoxItem = [
    { name: t(`Nova.expandImg.SelectBox.Custom`), icon: CustomIcon },
    { name: t(`Nova.expandImg.SelectBox.Horizontal`), icon: HorizontalIcon },
    { name: t(`Nova.expandImg.SelectBox.Vertical`), icon: VerticalIcon },
    { name: t(`Nova.expandImg.SelectBox.Square`), icon: SqureIcon }
  ];
  const [format, setFormat] = useState<string>(SelectBoxItem[2].name);

  useEffect(() => {
    if (dimension && format) selectBox(format);
  }, [dimension, format]);

  useEffect(() => {
    const element = imageBoxRef.current;
    if (element) {
      const resizeObserver = new ResizeObserver(
        debounce((entries) => {
          for (const entry of entries) setDimensions(entry.contentRect.width);
        }, 100)
      );
      resizeObserver.observe(element);
      return () => resizeObserver.unobserve(element);
    }
  }, [result]);

  useEffect(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setImgSize({ width: naturalWidth, height: naturalHeight });
    }
  }, [result]);

  const scale = useMemo(() => (dimension ? dimension / 2048 : 1), [dimension]);
  const rate = useMemo(() => (dimension ? 2048 / dimension : 1), [dimension]);

  const expandImage = () => {
    if (imageRef.current && boxInfo.width && boxInfo.height) {
      const imgElement = imageRef.current;
      const imgScaledWidth = imgElement.naturalWidth * scale;
      const imgScaledHeight = imgElement.naturalHeight * scale;

      const left = Math.round(((boxInfo.width - imgScaledWidth) / 2) * rate);
      const right = Math.round(((boxInfo.width - imgScaledWidth) / 2) * rate);
      const top = Math.round(((boxInfo.height - imgScaledHeight) / 2) * rate);
      const bottom = Math.round(((boxInfo.height - imgScaledHeight) / 2) * rate);

      // console.log('left:', left);
      // console.log('right:', right);
      // console.log('top:', top);
      // console.log('bottom:', bottom);

      handleExpandImage(left, right, top, bottom);
    }
  };

  const selectBox = (selectedItem: string) => {
    setFormat(selectedItem);
    if (!dimension) return;

    let newWidth = 100;
    let newHeight = 100;
    switch (selectedItem) {
      case '개인 맞춤':
        newWidth = inputWidth;
        newHeight = inputHeight;
        break;
      case '가로형':
        newWidth = 2048;
        newHeight = 1152;
        break;
      case '세로형':
        newWidth = 1152;
        newHeight = 2048;
        break;
      case '정사각형':
        newWidth = 2048;
        newHeight = 2048;
        break;
    }

    setInputWidth(Math.round(newWidth));
    setInputHeight(Math.round(newHeight));
    setBoxInfo({
      width: newWidth / rate,
      height: newHeight / rate,
      top: Math.max(0, (dimension - newHeight / rate) / 2),
      left: Math.max(0, (dimension - newWidth / rate) / 2)
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: 'width' | 'height'
  ) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 100 || value > 2048 || !dimension) return;

    setFormat('개인 맞춤');
    if (type === 'width') {
      setInputWidth(value);
      setBoxInfo((prev) => ({
        ...prev,
        width: value / rate,
        left: Math.max(0, (dimension - value / rate) / 2)
      }));
    } else if (type === 'height') {
      setInputHeight(value);
      setBoxInfo((prev) => ({
        ...prev,
        height: value / rate,
        top: Math.max(0, (dimension - value / rate) / 2)
      }));
    }
  };

  return (
    <Wrap>
      <GoBackHeader />
      <Body>
        <ImageBox ref={imageBoxRef}>
          {dimension && (
            <Box>
              <img
                ref={imageRef}
                src={`data:${result?.contentType};base64,${result?.data}`}
                style={{ transform: `scale(${scale})`, transition: 'transform 0.2s ease' }}
                onLoad={() => {
                  if (imageRef.current) {
                    const { naturalWidth, naturalHeight } = imageRef.current;
                    setImgSize({ width: naturalWidth, height: naturalHeight });
                  }
                }}
              />
              <ResizableContainer
                guideBoxInfo={{ width: dimension, height: dimension, top: 0, left: 0 }}
                boxInfo={boxInfo}
                setBoxInfo={setBoxInfo}
                maxDimensions={dimension}
              />
            </Box>
          )}
        </ImageBox>

        <CustomWrap>
          <SelectBox menuItem={SelectBoxItem} selectedItem={format} setSelectedItem={selectBox} />
          <InputWrap>
            <InputBox
              type="number"
              value={inputWidth}
              onChange={(e) => handleInputChange(e, 'width')}
            />
            <img src={MultiplyIcon} alt="multiply" />
            <InputBox
              type="number"
              value={inputHeight}
              onChange={(e) => handleInputChange(e, 'height')}
            />
          </InputWrap>
        </CustomWrap>

        <ButtonWrap onClick={expandImage}>
          <span>{t('Nova.expandImg.Button')}</span>
        </ButtonWrap>
      </Body>
    </Wrap>
  );
}
