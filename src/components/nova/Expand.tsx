import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { useTranslation } from 'react-i18next';
import { Group, Image, Layer, Stage, Transformer } from 'react-konva';
import styled from 'styled-components';

import { ReactComponent as HorizontalIcon } from '../../img/nova/expandImg/horizontal_n.svg';
import { ReactComponent as HorizontalIconSelected } from '../../img/nova/expandImg/horizontal_s.svg';
import { ReactComponent as SquareIcon } from '../../img/nova/expandImg/square_n.svg';
import { ReactComponent as SquareIconSelected } from '../../img/nova/expandImg/square_s.svg';
import { ReactComponent as VerticalIcon } from '../../img/nova/expandImg/vertical_n.svg';
import { ReactComponent as VerticalIconSelected } from '../../img/nova/expandImg/vertical_s.svg';
import { selectPageResult } from '../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../store/slices/tabSlice';
import { useAppSelector } from '../../store/store';
import { useConfirm } from '../Confirm';
import { useExpandImage } from '../hooks/nova/useExpandImage';

import GoBackHeader from './GoBackHeader';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: center;
  justify-content: safe center;
  padding: 0 16px 16px 16px;
  overflow-y: auto;
`;

const GuideBox = styled.div`
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
`;

const ImageBox = styled.div<{ height: number; width: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  background: #e8ebed;
  border: 1px solid #c9cdd2;
`;

const StyledStage = styled(Stage)<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonWrap = styled.div`
  width: 100%;
  display: grid;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
`;

const CanvasSizeButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 78px);
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const RatioButton = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5.5px 22px;
  background-color: ${({ selected }) => (selected ? '#ede5fe' : '#ffffff')};
  color: ${({ selected }) => (selected ? '#ffffff' : '#6f3ad0')};
  border: 1px solid ${({ selected }) => (selected ? '#6f3ad0' : 'none')};
  border-radius: 8px;
  box-sizing: border-box;

  span {
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: ${({ selected }) => (selected ? '#6f3ad0' : '#454c53')};
  }
`;

const CurSizeBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #26282b;
  }
`;

const ExpandButton = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6f3ad0;
  padding: 12px 0;
  border-radius: 8px;

  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: white;
  }
`;

const SIZES = {
  square: { width: 2048, height: 2048 },
  horizontal: { width: 2048, height: 1152 },
  vertical: { width: 1152, height: 2048 }
};

export default function Expand() {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const result = useAppSelector(selectPageResult(selectedNovaTab));
  const { handleExpandImage } = useExpandImage();

  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [canvasDiff, setCanvasDiff] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
  const [scaleRatio, setScaleRatio] = useState({ widthRatio: 1, heightRatio: 1 });
  const stageRef = useRef<Konva.Stage | null>(null);
  const imageRef = useRef<Konva.Image | null>(null);
  const imageTrRef = useRef<Konva.Transformer | null>(null);

  const [selectedRatio, setSelectedRatio] = useState<'square' | 'horizontal' | 'vertical'>(
    'square'
  );

  useEffect(() => {
    if (result) {
      const img = new window.Image();
      img.src = `data:${result.contentType};base64,${result.data}`;
      img.onload = () => setImageObj(img);
    }
  }, [result]);

  useEffect(() => {
    if (imageTrRef.current && imageRef.current) {
      imageTrRef.current.nodes([imageRef.current]);
      imageTrRef.current.getLayer()?.batchDraw();
    }
  }, [imageObj]);

  useEffect(() => {
    const handleResize = () => {
      handleCanvasSizeChange(selectedRatio);
      calculateImageBounds();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedRatio]);

  useEffect(() => {
    handleCanvasSizeChange('square');
  }, [imageObj]);

  useEffect(() => {
    calculateImageBounds();
  }, [canvasSize]);

  const calculateImageBounds = () => {
    if (!stageRef.current || !imageRef.current || !imageObj) return;

    const imageNode = imageRef.current;
    const boundingBox = imageNode.getClientRect();

    const widthRatio = canvasSize.width / SIZES[selectedRatio].width;
    const heightRatio = canvasSize.height / SIZES[selectedRatio].height;

    setCanvasDiff({
      top: boundingBox.y / heightRatio,
      bottom: (canvasSize.height - (boundingBox.y + boundingBox.height)) / heightRatio,
      left: boundingBox.x / widthRatio,
      right: (canvasSize.width - (boundingBox.x + boundingBox.width)) / widthRatio
    });

    setImageSize({
      width: boundingBox.width / widthRatio,
      height: boundingBox.height / heightRatio
    });

    stageRef.current?.batchDraw();
  };

  const handleCanvasSizeChange = (ratio: 'square' | 'horizontal' | 'vertical') => {
    let actualCanvasWidth = window.innerWidth - 32;
    let actualCanvasHeight;
    let virtualBoxWidth, virtualBoxHeight;

    switch (ratio) {
      case 'square':
        actualCanvasHeight = actualCanvasWidth;
        virtualBoxWidth = 2048;
        virtualBoxHeight = 2048;
        break;
      case 'horizontal':
        actualCanvasHeight = (actualCanvasWidth / 16) * 9;
        virtualBoxWidth = 2048;
        virtualBoxHeight = 1152;
        break;
      case 'vertical':
        actualCanvasHeight = actualCanvasWidth;
        actualCanvasWidth = (actualCanvasHeight * 9) / 16;
        virtualBoxWidth = 1152;
        virtualBoxHeight = 2048;
        break;
      default:
        actualCanvasHeight = actualCanvasWidth;
        virtualBoxWidth = 2048;
        virtualBoxHeight = 2048;
    }

    setCanvasSize({ width: actualCanvasWidth, height: actualCanvasHeight });
    setSelectedRatio(ratio);

    const widthScale = actualCanvasWidth / virtualBoxWidth;
    const heightScale = actualCanvasHeight / virtualBoxHeight;

    if (imageRef.current && imageObj) {
      const imageNode = imageRef.current;
      const { naturalWidth: imageWidth, naturalHeight: imageHeight } = imageObj;

      const scaledImageWidth = imageWidth * widthScale;
      const scaledImageHeight = imageHeight * heightScale;

      const xPos = (actualCanvasWidth - scaledImageWidth) / 2;
      const yPos = (actualCanvasHeight - scaledImageHeight) / 2;

      imageNode.width(scaledImageWidth);
      imageNode.height(scaledImageHeight);
      imageNode.position({ x: xPos, y: yPos });
      imageNode.scale({ x: 1, y: 1 });
      imageNode.rotation(0);

      stageRef.current?.batchDraw();
    }
  };

  const checkImageOutOfBounds = () => {
    if (!stageRef.current || !imageRef.current) return;

    const stage = stageRef.current;
    const imageNode = imageRef.current;

    const imageBoundaries = imageNode.getClientRect();
    const topLeft = { x: imageBoundaries.x, y: imageBoundaries.y };
    const topRight = { x: imageBoundaries.x + imageBoundaries.width, y: imageBoundaries.y };
    const bottomLeft = { x: imageBoundaries.x, y: imageBoundaries.y + imageBoundaries.height };
    const bottomRight = {
      x: imageBoundaries.x + imageBoundaries.width,
      y: imageBoundaries.y + imageBoundaries.height
    };

    const canvasSize = { width: stage.width(), height: stage.height() };
    const allOutOfBounds =
      (topLeft.x < 0 ||
        topLeft.x > canvasSize.width ||
        topLeft.y < 0 ||
        topLeft.y > canvasSize.height) &&
      (topRight.x < 0 ||
        topRight.x > canvasSize.width ||
        topRight.y < 0 ||
        topRight.y > canvasSize.height) &&
      (bottomLeft.x < 0 ||
        bottomLeft.x > canvasSize.width ||
        bottomLeft.y < 0 ||
        bottomLeft.y > canvasSize.height) &&
      (bottomRight.x < 0 ||
        bottomRight.x > canvasSize.width ||
        bottomRight.y < 0 ||
        bottomRight.y > canvasSize.height);

    return allOutOfBounds;
  };

  return (
    <Wrap>
      <GoBackHeader />
      <Body>
        <GuideBox>
          <ImageBox width={canvasSize.width} height={canvasSize.height}>
            <StyledStage width={canvasSize.width} height={canvasSize.height} ref={stageRef}>
              <Layer>
                {imageObj && (
                  <Group>
                    <Image
                      image={imageObj}
                      draggable
                      ref={imageRef}
                      onDragMove={calculateImageBounds}
                      onTransformEnd={calculateImageBounds}
                    />
                    <Transformer
                      ref={imageTrRef}
                      resizeEnabled={true}
                      rotateEnabled={false}
                      anchorSize={10}
                      anchorCornerRadius={10}
                      borderStroke="#6f3ad0"
                      borderStrokeWidth={2}
                      anchorStroke="#6f3ad0"
                      anchorFill="#6f3ad0"
                      anchorStrokeWidth={2}
                      enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                    />
                  </Group>
                )}
              </Layer>
            </StyledStage>
          </ImageBox>
        </GuideBox>

        <ButtonWrap>
          <CanvasSizeButtonGroup>
            <RatioButton
              selected={selectedRatio === 'square'}
              onClick={() => handleCanvasSizeChange('square')}>
              {selectedRatio === 'square' ? <SquareIconSelected /> : <SquareIcon />}
              <span>1:1</span>
            </RatioButton>
            <RatioButton
              selected={selectedRatio === 'horizontal'}
              onClick={() => handleCanvasSizeChange('horizontal')}>
              {selectedRatio === 'horizontal' ? <HorizontalIconSelected /> : <HorizontalIcon />}
              <span>16:9</span>
            </RatioButton>
            <RatioButton
              selected={selectedRatio === 'vertical'}
              onClick={() => handleCanvasSizeChange('vertical')}>
              {selectedRatio === 'vertical' ? <VerticalIconSelected /> : <VerticalIcon />}
              <span>9:16</span>
            </RatioButton>
          </CanvasSizeButtonGroup>

          <CurSizeBox>
            <span>
              {selectedRatio === 'square' && '2048 x 2048'}
              {selectedRatio === 'horizontal' && '2048 x 1152'}
              {selectedRatio === 'vertical' && '1152 x 2048'}
            </span>
          </CurSizeBox>

          <ExpandButton
            onClick={async () => {
              if (!checkImageOutOfBounds()) {
                handleExpandImage(
                  Math.round(canvasDiff.left * scaleRatio.widthRatio),
                  Math.round(canvasDiff.right * scaleRatio.widthRatio),
                  Math.round(canvasDiff.top * scaleRatio.heightRatio),
                  Math.round(canvasDiff.bottom * scaleRatio.heightRatio)
                );
              } else {
                await confirm({
                  title: '',
                  msg: t('Nova.Alert.MoveImageInBox'),
                  onOk: {
                    text: t('Confirm'),
                    callback: () => {
                      handleCanvasSizeChange(selectedRatio);
                      calculateImageBounds();
                    }
                  }
                });
              }
            }}>
            <span>{t(`Nova.expandImg.Button`)}</span>
          </ExpandButton>
        </ButtonWrap>
      </Body>
    </Wrap>
  );
}
