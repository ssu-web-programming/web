import styled from 'styled-components';

export const SheetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 0px 16px 40px 16px;
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

export const SpeedOptions = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  width: 100%;
`;

interface SpeedOptionProps {
  isSelected: boolean;
}

export const SpeedOption = styled.button<SpeedOptionProps>`
  background: none;
  border: none;
  font-family: 'Pretendard', sans-serif;
  font-weight: ${({ isSelected }) => (isSelected ? '600' : '400')};
  font-size: ${({ isSelected }) => (isSelected ? '20px' : '16px')};
  line-height: 1em;
  color: ${({ isSelected }) => (isSelected ? '#6F3AD0' : '#9EA4AA')};
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ isSelected }) => (isSelected ? '#6F3AD0' : '#454C53')};
  }
`;
