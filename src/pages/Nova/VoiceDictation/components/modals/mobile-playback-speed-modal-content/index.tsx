import React, { useEffect, useState } from 'react';
import ModalSheet from 'components/modalSheet';
import Slider from 'rc-slider';

import * as S from './style';

import 'rc-slider/assets/index.css';

export type PlaybackSpeed = 0.8 | 1.0 | 1.2 | 1.5 | 1.8 | 2.0;

interface PlaybackSpeedBottomSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentSpeed: PlaybackSpeed;
  onSelectSpeed: (speed: PlaybackSpeed) => void;
}

const MobilePlaybackSpeedModalContent: React.FC<PlaybackSpeedBottomSheetProps> = ({
  isOpen,
  setIsOpen,
  currentSpeed,
  onSelectSpeed
}) => {
  const speeds: PlaybackSpeed[] = [0.8, 1.0, 1.2, 1.5, 1.8, 2.0];

  const [currentSpeedIndex, setCurrentSpeedIndex] = useState(speeds.indexOf(currentSpeed));
  const [selectedSpeed, setSelectedSpeed] = useState(currentSpeed);

  useEffect(() => {
    setCurrentSpeedIndex(speeds.indexOf(selectedSpeed));
  }, [selectedSpeed]);

  const handleSliderChange = (index: number | any) => {
    const roundedIndex = Math.round(index);
    const newSpeed = speeds[roundedIndex];
    onSelectSpeed(newSpeed);
    setSelectedSpeed(newSpeed);
    setCurrentSpeedIndex(roundedIndex);
  };

  const handleSpeedOptionClick = (speed: PlaybackSpeed) => {
    onSelectSpeed(speed);
    setSelectedSpeed(speed);
    setCurrentSpeedIndex(speeds.indexOf(speed));
  };

  return (
    <ModalSheet isOpen={isOpen} setIsOpen={setIsOpen} detent="content-height">
      <S.SheetContainer>
        <S.Title>재생 속도</S.Title>

        <S.SliderContainerRC>
          <Slider
            min={0}
            max={speeds.length - 1}
            step={1}
            value={currentSpeedIndex}
            onChange={handleSliderChange}
            styles={{
              rail: {
                backgroundColor: '#E8EBED',
                height: 4
              },
              track: {
                backgroundColor: '#6F3AD0',
                height: 4
              },
              handle: {
                borderColor: '#6F3AD0',
                height: 16,
                width: 16,
                marginTop: -6,
                backgroundColor: '#6F3AD0',
                boxShadow: 'none',
                opacity: 1
              }
            }}
          />
        </S.SliderContainerRC>

        <S.SpeedOptions>
          {speeds.map((speed) => (
            <S.SpeedOption
              key={speed}
              isSelected={selectedSpeed === speed}
              onClick={() => handleSpeedOptionClick(speed)}>
              {speed.toFixed(1)}
            </S.SpeedOption>
          ))}
        </S.SpeedOptions>
      </S.SheetContainer>
    </ModalSheet>
  );
};

export default MobilePlaybackSpeedModalContent;
