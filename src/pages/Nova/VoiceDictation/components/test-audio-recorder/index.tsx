import React, { useEffect } from 'react';
import { useConfirm } from 'components/Confirm';
import ControlButton from 'components/nova/buttons/control-button';
import PlayPauseButton from 'components/nova/buttons/play-pause-button';
import { ReactComponent as DarkLang } from 'img/dark/nova/voice-dictation/lang.svg';
import { ReactComponent as DarkStop } from 'img/dark/nova/voice-dictation/stop.svg';
import { ReactComponent as Lang } from 'img/light/nova/voiceDictation/lang.svg';
import { ReactComponent as Stop } from 'img/light/nova/voiceDictation/stop.svg';
import { useTranslation } from 'react-i18next';
import { appStateSelector } from 'store/slices/appState';
import { useAppSelector } from 'store/store';

import { useAudioRecorder } from '../../provider/audio-recorder-provider';
import { LangOptionValues } from '../../provider/voice-dictation-provider';
import { getLangOptions } from '../recognized-lang';

import * as S from './style';

interface AudioRecorderProps {
  isInitRecording?: boolean;
  onRecordingFinish?: () => void;
  onStopConfirm?: () => Promise<boolean>;
  selectedLangOption?: LangOptionValues;
  openLangOverlay?: () => void;
}

const TestAudioRecorder: React.FC<AudioRecorderProps> = ({
  isInitRecording = false,
  onRecordingFinish,
  onStopConfirm,
  selectedLangOption,
  openLangOverlay
}) => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { isRecordState } = useAppSelector(appStateSelector);
  const {
    isPaused,
    recordingTime,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    canvasRef,
    mediaRecorderRef,
    startVisualization
  } = useAudioRecorder();

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopRecording = async () => {
    await stopRecording(async () => {
      const confirmed = await onStopConfirm?.();
      if (confirmed) {
        onRecordingFinish?.();
      }
      return !!confirmed;
    });
  };

  const filteredSelectedLangOptions = () => {
    return getLangOptions(t).find((langOption) => langOption.value === selectedLangOption);
  };

  useEffect(() => {
    if (isInitRecording) {
      if (!mediaRecorderRef.current) {
        startRecording();
      } else {
        startVisualization(mediaRecorderRef.current.stream);
      }
    }
  }, [isInitRecording]);

  useEffect(() => {
    if (isRecordState === 'pause') {
      pauseRecording();
    } else if (isRecordState === 'start') {
      resumeRecording();
    }
  }, [isRecordState]);

  useEffect(() => {
    if (recordingTime >= 30 * 60 && !isPaused) {
      pauseRecording();
      confirm({
        msg: t('Nova.voiceDictation.Alert.Overed30Minutes'),
        onOk: {
          text: t('Confirm'),
          callback: () => {
            stopRecording();
          }
        }
      });
    }
  }, [recordingTime, isPaused]);

  return (
    <S.Container>
      <S.Background>
        <S.CanvasWrapper>
          <S.StatusText $isPaused={isPaused}>
            {isPaused
              ? t('Nova.voiceDictation.Status.OnPause')
              : `${filteredSelectedLangOptions()?.label} ${t('Nova.voiceDictation.Status.Recognizing')}`}
          </S.StatusText>

          <S.Canvas ref={canvasRef} />

          <S.DurationText>{formatDuration(recordingTime)}</S.DurationText>
        </S.CanvasWrapper>
      </S.Background>
      <S.ButtonGroup>
        <ControlButton icon={Lang} darkIcon={DarkLang} onClick={openLangOverlay} />
        <PlayPauseButton isPaused={isPaused} onPlay={resumeRecording} onPause={pauseRecording} />
        <ControlButton icon={Stop} darkIcon={DarkStop} onClick={handleStopRecording} />
      </S.ButtonGroup>
    </S.Container>
  );
};

export default TestAudioRecorder;
