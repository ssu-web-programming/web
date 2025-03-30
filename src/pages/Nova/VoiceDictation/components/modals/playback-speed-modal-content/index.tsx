import { useState } from 'react';
import { overlay } from 'overlay-kit';
import { useTranslation } from 'react-i18next';

import UseShowSurveyModal from '../../../../../../components/hooks/use-survey-modal';
import {
  selectPageCreditReceived,
  selectPageService
} from '../../../../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../../../../store/slices/tabSlice';
import { useAppSelector } from '../../../../../../store/store';
import { PlaybackSpeed } from '../../voice-audio-player';

import * as S from './style';

interface Props {
  onChangeSpeedOptions: (nextSpeed: PlaybackSpeed) => void;
  currentSpeed: PlaybackSpeed;
}

export default function PlaybackSpeedModalContent({ onChangeSpeedOptions, currentSpeed }: Props) {
  const [selectedSpeed, setSelectedSpeed] = useState<PlaybackSpeed>(currentSpeed);

  const speeds: PlaybackSpeed[] = [0.8, 1.0, 1.2, 1.5, 1.8, 2.0];

  const handleClose = () => {
    overlay.closeAll();
  };

  const handleSave = async () => {
    onChangeSpeedOptions(selectedSpeed);
    handleClose();
  };

  return (
    <S.ModalContainer>
      <S.ModalTitle>재생 속도</S.ModalTitle>

      <S.RadioGroup>
        {speeds.map((speed) => (
          <S.RadioLabel key={speed}>
            <S.RadioInput
              type="radio"
              name="playbackSpeed"
              value={speed}
              checked={selectedSpeed === speed}
              onChange={async () => {
                setSelectedSpeed(speed);
              }}
            />
            <S.RadioText>{speed.toFixed(1)}</S.RadioText>
          </S.RadioLabel>
        ))}
      </S.RadioGroup>

      <S.ButtonGroup>
        <S.Button onClick={handleClose}>취소</S.Button>
        <S.Button primary onClick={handleSave}>
          확인
        </S.Button>
      </S.ButtonGroup>
    </S.ModalContainer>
  );
}
