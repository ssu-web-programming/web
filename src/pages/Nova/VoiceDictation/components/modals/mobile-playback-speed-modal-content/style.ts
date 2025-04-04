import styled from 'styled-components';

export const SheetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0px 16px 70px 16px;
`;

export const Title = styled.h2`
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 1.5em;
  letter-spacing: -0.4px;
  color: #454c53;
  margin: 0;
`;

export const SliderContainerRC = styled.div`
  width: 100%;
  padding: 16px 0;

  /* rc-slider 관련 커스텀 스타일 오버라이드 */
  .rc-slider {
    padding: 8px 0;
  }

  .rc-slider-dot {
    visibility: hidden;
  }

  .rc-slider-mark .rc-slider-mark-text:nth-child(1) {
    padding-left: 20px;
  }

  .rc-slider-mark .rc-slider-mark-text:nth-child(6) {
    padding-right: 20px;
  }

  .rc-slider-rail {
    background-color: #e8ebed;
    height: 4px;
  }

  .rc-slider-track {
    background-color: #6f3ad0;
    height: 4px;
  }

  .rc-slider-handle {
    border-color: #6f3ad0;
    background-color: #6f3ad0;
    width: 12px;
    height: 12px;
    margin-top: -4px;
    opacity: 1;
    box-shadow: none;

    &:hover {
      border-color: #6f3ad0;
    }

    &:active {
      border-color: #6f3ad0;
      box-shadow: 0 0 0 3px rgba(111, 58, 208, 0.2);
    }

    &:focus {
      border-color: #6f3ad0;
      box-shadow: 0 0 0 3px rgba(111, 58, 208, 0.2);
    }
  }
`;

// 기존 슬라이더 관련 스타일 유지 (필요시)
export const SliderContainer = styled.div`
  width: 100%;
  padding: 8px 0;
  position: relative;
  height: 25px;
  display: flex;
  align-items: center;
`;

export const SliderTrack = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e8ebed;
  border-radius: 2px;
  position: relative;
`;

interface ActiveTrackProps {
  progress: number;
}

export const ActiveTrack = styled.div<ActiveTrackProps>`
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background-color: #6f3ad0;
  border-radius: 2px;
  width: ${({ progress }) => `${progress * 100}%`};
`;

interface ThumbProps {
  position: number;
}

export const SliderThumb = styled.div<ThumbProps>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #6f3ad0;
  position: absolute;
  top: 50%;
  left: ${({ position }) => `${position * 100}%`};
  transform: translate(-50%, -50%);
  cursor: pointer;
`;
