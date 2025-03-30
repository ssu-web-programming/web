import React, { PropsWithChildren, useRef, useState } from 'react';
import { ReactComponent as DarkGoBackward } from 'img/dark/nova/voice-dictation/go_backward.svg';
import { ReactComponent as DarkGoForward } from 'img/dark/nova/voice-dictation/go_forward.svg';
import { ReactComponent as GoBackward } from 'img/light/nova/voiceDictation/go_backward.svg';
import { ReactComponent as GoForward } from 'img/light/nova/voiceDictation/go_forward.svg';

import * as S from './style';

interface AudioPlayerProps extends PropsWithChildren {
  audioSource: string;
  endDuration: number;
  onPlay?: () => void;
  onPause?: () => void;
  isLightMode?: boolean;
  openSpeedbackPopup?: (
    handleChangeSpeedOptions: (nextSpeed: PlaybackSpeed) => void,
    currentSpeed: PlaybackSpeed
  ) => void;
}

// 재생 속도 타입
export type PlaybackSpeed = 0.8 | 1.0 | 1.2 | 1.5 | 1.8 | 2.0;

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSource,
  endDuration,
  onPlay,
  onPause,
  children,
  isLightMode,
  openSpeedbackPopup
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1.0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleTimeUpdate = (): void => {
    if (audioRef.current) {
      const currentTimeValue = audioRef.current.currentTime;
      setCurrentTime(currentTimeValue);

      // 오디오가 거의 끝에 도달했는지 확인
      const isNearEnd =
        currentTimeValue >= endDuration - 0.2 ||
        currentTimeValue >= audioRef.current.duration - 0.2;

      // 재생 중이고 거의 끝에 도달했다면 재생 종료 처리
      if (isPlaying && isNearEnd) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const togglePlay = (): void => {
    if (audioRef.current) {
      // 현재 위치가 끝에 가까운지 확인
      const isNearEnd =
        audioRef.current.currentTime >= endDuration - 0.2 ||
        audioRef.current.currentTime >= audioRef.current.duration - 0.2;

      if (isPlaying) {
        audioRef.current.pause();
        onPause?.();
        setIsPlaying(false);
      } else if (!isNearEnd) {
        // 끝 부분이 아닌 경우에만 재생 시작
        audioRef.current.play();
        onPlay?.();
        setIsPlaying(true);
      } else {
        console.log('end');
        // 끝 부분인 경우 처음으로 되돌리고 재생 시작 (선택 사항)
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        onPlay?.();
        setIsPlaying(true);
      }
    }
  };

  const handleSkip = (seconds: number): void => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime + seconds;
      const limitedTime = Math.min(Math.max(0, newTime), endDuration);
      const finalTime = Math.min(limitedTime, audioRef.current.duration);
      audioRef.current.currentTime = finalTime;
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = e.nativeEvent.offsetX;
      const totalWidth = progressBar.offsetWidth;
      const percentage = clickPosition / totalWidth;
      const newTime = percentage * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleChangeSpeedOtions = (nextSpeed: PlaybackSpeed) => {
    if (audioRef.current) {
      console.log('여기도냐?', nextSpeed);
      setPlaybackSpeed(nextSpeed);
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handlePlaybackSpeedChange = (): void => {
    openSpeedbackPopup?.(handleChangeSpeedOtions, playbackSpeed);
  };

  const progress = endDuration ? Math.min((currentTime / endDuration) * 100, 100) : 0;

  return (
    <S.Container>
      <audio ref={audioRef} src={audioSource as string} onTimeUpdate={handleTimeUpdate} />

      <S.ProgressBarContainer onClick={handleProgressBarClick}>
        <S.ProgressBar progress={`${progress}%`} />
      </S.ProgressBarContainer>

      <S.TimeDisplay>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(endDuration)}</span>
      </S.TimeDisplay>

      <S.ControlsContainer>
        <S.PlaybackSpeedButton onClick={handlePlaybackSpeedChange}>
          <span>{playbackSpeed}</span>
          <span>x</span>
        </S.PlaybackSpeedButton>

        <S.PlayButton onClick={togglePlay}>
          {isPlaying ? <S.StyledPause /> : <S.StyledPlay />}
        </S.PlayButton>

        <S.SkipButton onClick={() => handleSkip(-5)}>
          {isLightMode ? <GoBackward /> : <DarkGoBackward />}
        </S.SkipButton>

        <S.SkipButton onClick={() => handleSkip(5)}>
          {isLightMode ? <GoForward /> : <DarkGoForward />}
        </S.SkipButton>
      </S.ControlsContainer>

      {children}
    </S.Container>
  );
};

export default AudioPlayer;
