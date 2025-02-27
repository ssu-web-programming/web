import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { ReactComponent as DarkGoBackward } from 'img/dark/nova/voice-dictation/go_backward.svg';
import { ReactComponent as DarkGoForward } from 'img/dark/nova/voice-dictation/go_forward.svg';
import { ReactComponent as GoBackward } from 'img/light/nova/voiceDictation/go_backward.svg';
import { ReactComponent as GoForward } from 'img/light/nova/voiceDictation/go_forward.svg';

import * as S from './style';

// 메인 컴포넌트 Props 타입
interface AudioPlayerProps extends PropsWithChildren {
  audioSource: string | File;
  onDurationChange?: (duration: number) => void;
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
  onDurationChange,
  onPlay,
  onPause,
  children,
  isLightMode,
  openSpeedbackPopup
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1.0);
  const [audioUrl, setAudioUrl] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleLoadedMetadata = (): void => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration;
      console.log('audioDuration', audioDuration);
      setDuration(audioDuration);
      onDurationChange?.(audioDuration);
    }
  };

  const handleTimeUpdate = (): void => {
    if (audioRef.current) {
      const currentTimeValue = audioRef.current.currentTime;
      console.log('currentTimeValue', currentTimeValue);
      setCurrentTime(currentTimeValue);
    }
  };

  const togglePlay = (): void => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        onPause?.();
      } else {
        audioRef.current.play();
        onPlay?.();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (seconds: number): void => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime + seconds;
      audioRef.current.currentTime = Math.min(Math.max(0, newTime), audioRef.current.duration);
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
      setPlaybackSpeed(nextSpeed);
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handlePlaybackSpeedChange = (): void => {
    openSpeedbackPopup?.(handleChangeSpeedOtions, playbackSpeed);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  // File 객체를 URL로 변환
  useEffect(() => {
    if (audioSource instanceof File) {
      const url = URL.createObjectURL(audioSource);
      setAudioUrl(url);

      // cleanup function
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setAudioUrl(audioSource);
    }
  }, [audioSource]);

  return (
    <S.Container>
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      <S.ProgressBarContainer onClick={handleProgressBarClick}>
        <S.ProgressBar progress={`${progress}%`} />
      </S.ProgressBarContainer>

      <S.TimeDisplay>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
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
