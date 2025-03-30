import React, { useEffect, useRef, useState } from 'react';
import ModalSheet from 'components/modalSheet';

import * as S from './style';

export type PlaybackSpeed = 0.8 | 1.0 | 1.2 | 1.5 | 1.8 | 2.0;

interface PlaybackSpeedBottomSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedSpeed: PlaybackSpeed;
  onSelectSpeed: (speed: PlaybackSpeed) => void;
}

const MobilePlaybackSpeedModalContent: React.FC<PlaybackSpeedBottomSheetProps> = ({
  isOpen,
  setIsOpen,
  selectedSpeed,
  onSelectSpeed
}) => {
  const speeds: PlaybackSpeed[] = [0.8, 1.0, 1.2, 1.5, 1.8, 2.0];
  const minSpeed = speeds[0];
  const maxSpeed = speeds[speeds.length - 1];
  const range = maxSpeed - minSpeed;

  // 속도에 해당하는 정확한 슬라이더 위치 계산 함수
  const calculateNormalizedPosition = (speed: PlaybackSpeed) => {
    // 속도 인덱스 찾기
    const speedIndex = speeds.indexOf(speed);

    // 전체 범위에서의 비율 계산 (0에서 1 사이의 값으로)
    // 속도 인덱스가 정확하게 슬라이더 위치에 맵핑되도록 함
    return speedIndex / (speeds.length - 1);
  };

  const [sliderPosition, setSliderPosition] = useState(calculateNormalizedPosition(selectedSpeed));
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // 선택된 속도가 변경될 때 슬라이더 위치 업데이트
  useEffect(() => {
    setSliderPosition(calculateNormalizedPosition(selectedSpeed));
  }, [selectedSpeed]);

  const handleSelectSpeed = (speed: PlaybackSpeed) => {
    onSelectSpeed(speed);
    setSliderPosition(calculateNormalizedPosition(speed));
  };

  // 슬라이더 위치에 가장 가까운 속도 값 찾기
  const getClosestSpeed = (position: number): PlaybackSpeed => {
    // 위치를 인덱스로 변환 (0-1 사이의 위치를 0-(speeds.length-1) 사이의 값으로)
    const exactIndex = position * (speeds.length - 1);

    // 가장 가까운 인덱스 찾기
    const index = Math.round(exactIndex);

    // 인덱스가 범위를 벗어나지 않도록 보정
    const safeIndex = Math.max(0, Math.min(index, speeds.length - 1));

    return speeds[safeIndex];
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    updateSliderPosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    document.addEventListener('touchmove', handleTouchMove as any);
    document.addEventListener('touchend', handleTouchEnd as any);
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingRef.current) {
      updateSliderPosition(e.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDraggingRef.current) {
      updateSliderPosition(e.touches[0].clientX);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    updateSelectedSpeed();
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    document.removeEventListener('touchmove', handleTouchMove as any);
    document.removeEventListener('touchend', handleTouchEnd as any);
    updateSelectedSpeed();
  };

  const updateSliderPosition = (clientX: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      let position = (clientX - rect.left) / rect.width;

      // 0과 1 사이로 값 제한
      position = Math.max(0, Math.min(position, 1));
      setSliderPosition(position);
    }
  };

  const updateSelectedSpeed = () => {
    const newSpeed = getClosestSpeed(sliderPosition);
    onSelectSpeed(newSpeed);

    // 슬라이더 위치를 정확한 속도 단계에 맞게 조정
    setSliderPosition(calculateNormalizedPosition(newSpeed));
  };

  // 트랙 클릭 시 위치로 점프
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      let position = (e.clientX - rect.left) / rect.width;

      // 0과 1 사이로 값 제한
      position = Math.max(0, Math.min(position, 1));

      // 가장 가까운 속도 값 찾기
      const newSpeed = getClosestSpeed(position);
      onSelectSpeed(newSpeed);

      // 슬라이더를 정확한 위치로 조정
      setSliderPosition(calculateNormalizedPosition(newSpeed));
    }
  };

  return (
    <ModalSheet isOpen={isOpen} setIsOpen={setIsOpen} detent="content-height">
      <S.SheetContainer>
        <S.Title>재생 속도</S.Title>

        <S.SliderContainer ref={sliderRef} onClick={handleTrackClick}>
          <S.SliderTrack>
            <S.ActiveTrack progress={sliderPosition} />
          </S.SliderTrack>
          <S.SliderThumb
            position={sliderPosition}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        </S.SliderContainer>

        <S.SpeedOptions>
          {speeds.map((speed) => (
            <S.SpeedOption
              key={speed}
              isSelected={selectedSpeed === speed}
              onClick={() => handleSelectSpeed(speed)}>
              {speed.toFixed(1)}
            </S.SpeedOption>
          ))}
        </S.SpeedOptions>
      </S.SheetContainer>
    </ModalSheet>
  );
};

export default MobilePlaybackSpeedModalContent;
