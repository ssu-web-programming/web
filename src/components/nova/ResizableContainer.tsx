import React, { useRef } from 'react';
import { ResizableBox } from 'react-resizable';
import styled from 'styled-components';

const StyledResizableBox = styled(ResizableBox)`
  touch-action: none;

  .react-resizable-handle {
    position: absolute;
    background-color: white;
    border: 2px solid #6f3ad0;
    border-radius: 999px;
    z-index: 10;
  }

  .react-resizable-handle:hover {
    background-color: #c6a9ff;
  }

  .react-resizable-handle-n {
    cursor: ns-resize;
    width: 48px;
    height: 8px;
    top: -3px;
    left: calc(50% - 24px);
  }

  .react-resizable-handle-s {
    cursor: ns-resize;
    width: 48px;
    height: 8px;
    bottom: -3px;
    left: calc(50% - 24px);
  }

  .react-resizable-handle-w {
    cursor: ew-resize;
    width: 8px;
    height: 48px;
    left: -3px;
    top: calc(50% - 24px);
  }

  .react-resizable-handle-e {
    cursor: ew-resize;
    width: 8px;
    height: 48px;
    right: -3px;
    top: calc(50% - 24px);
  }
`;

const InnerBox = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid #6f3ad0;
  background-color: transparent;
`;

const Overlay = styled.div`
  position: absolute;
  background-color: rgba(244, 246, 248, 0.8);
  z-index: 10;
  pointer-events: none;
`;

export type BoxInfo = { width: number; height: number; left: number; top: number };

interface ResizableProps {
  maxDimensions: number;
  guideBoxInfo: BoxInfo;
  boxInfo: BoxInfo;
  setBoxInfo: (info: BoxInfo) => void;
}

export default function ResizableContainer(props: ResizableProps) {
  const { boxInfo, setBoxInfo, guideBoxInfo } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = (e: any, data: any, direction: string) => {
    let newWidth = data.size.width;
    let newHeight = data.size.height;
    let newLeft = boxInfo.left;
    let newTop = boxInfo.top;
    const maxDimensions = props.maxDimensions;

    if (direction.includes('n')) {
      newTop = boxInfo.top + (boxInfo.height - newHeight);
      if (newTop < 0) {
        newTop = 0;
        newHeight = boxInfo.height + boxInfo.top;
      }
    }

    if (direction.includes('s')) {
      if (newTop + newHeight > maxDimensions) {
        newTop = guideBoxInfo.top;
        newHeight = guideBoxInfo.height;
      }
    }
    if (direction.includes('w')) {
      newLeft = boxInfo.left + (boxInfo.width - newWidth);
      if (newLeft < 0) {
        newLeft = 0;
      }
    }
    if (direction.includes('e')) {
      if (newLeft + newWidth > maxDimensions) {
        newLeft = guideBoxInfo.left;
        newWidth = guideBoxInfo.width;
      }
    }

    setBoxInfo({
      width: newWidth,
      height: newHeight,
      left: newLeft,
      top: newTop
    });
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Overlay
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: `${boxInfo.top}px`
        }}
      />
      <Overlay
        style={{
          top: `${boxInfo.top + boxInfo.height}px`,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
      <Overlay
        style={{
          top: `${boxInfo.top}px`,
          left: 0,
          width: `${boxInfo.left}px`,
          height: `${boxInfo.height}px`
        }}
      />
      <Overlay
        style={{
          top: `${boxInfo.top}px`,
          left: `${boxInfo.left + boxInfo.width}px`,
          right: 0,
          height: `${boxInfo.height}px`
        }}
      />
      <StyledResizableBox
        width={boxInfo.width}
        height={boxInfo.height}
        minConstraints={[100, 100]}
        maxConstraints={[props.maxDimensions, props.maxDimensions]}
        resizeHandles={['n', 'e', 's', 'w']}
        onResize={(e, data) => handleResize(e, data, data.handle)}
        style={{
          position: 'absolute',
          top: boxInfo.top,
          left: boxInfo.left,
          width: boxInfo.width,
          height: boxInfo.height
        }}>
        <InnerBox />
      </StyledResizableBox>
    </div>
  );
}
