import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
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
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1.0);
  const [audioUrl, setAudioUrl] = useState<string>('');
  // 컴포넌트 리렌더링을 위한 상태
  const [, forceUpdate] = useState<any>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isPlaying = useCallback(() => {
    return audioRef.current ? !audioRef.current.paused : false;
  }, []);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleLoadedMetadata = useCallback((): void => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration;
      setDuration(audioDuration);
      onDurationChange?.(audioDuration);
    }
  }, [onDurationChange]);

  const handleTimeUpdate = useCallback((): void => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const togglePlay = useCallback((): void => {
    if (audioRef.current) {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.error('Error playing audio:', err);
        });
      }
    }
  }, []);

  // 앞/뒤로 이동 함수
  const handleSkip = useCallback((seconds: number): void => {
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;

      // 정확한 시간 계산 및 제한
      const newTime = Math.max(
        0,
        Math.min(audioRef.current.currentTime + seconds, audioRef.current.duration || 0)
      );

      // 시간 설정
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);

      // 재생 중이었다면 재생 상태 유지
      if (wasPlaying && audioRef.current.paused) {
        audioRef.current.play().catch((err) => {
          console.error('Error playing audio after skip:', err);
        });
      }
    }
  }, []);

  const handleProgressBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const totalWidth = rect.width;
      const percentage = clickPosition / totalWidth;
      const newTime = percentage * audioRef.current.duration;

      // 시간 변경
      audioRef.current.currentTime = Math.max(0, Math.min(newTime, audioRef.current.duration));
      setCurrentTime(audioRef.current.currentTime);

      setTimeout(() => {
        audioRef.current?.play().catch((err) => {
          console.error('Error playing audio after progress click:', err);
        });
      }, 10);
    }
  }, []);

  // 재생 속도 변경 핸들러
  const handleChangeSpeedOptions = useCallback((nextSpeed: PlaybackSpeed) => {
    if (audioRef.current) {
      setPlaybackSpeed(nextSpeed);
      audioRef.current.playbackRate = nextSpeed;
    }
  }, []);

  // 재생 속도 버튼 클릭 핸들러
  const handlePlaybackSpeedChange = useCallback((): void => {
    openSpeedbackPopup?.(handleChangeSpeedOptions, playbackSpeed);
  }, [openSpeedbackPopup, handleChangeSpeedOptions, playbackSpeed]);

  // 진행률 계산
  const progress = duration ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleAudioPlay = () => {
      forceUpdate({});
      onPlay?.();
    };

    const handleAudioPause = () => {
      forceUpdate({});
      onPause?.();
    };

    const handleAudioEnded = () => {
      forceUpdate({});
    };

    // 이벤트 리스너 등록
    audio.addEventListener('play', handleAudioPlay);
    audio.addEventListener('pause', handleAudioPause);
    audio.addEventListener('ended', handleAudioEnded);

    // 클린업 함수
    return () => {
      audio.removeEventListener('play', handleAudioPlay);
      audio.removeEventListener('pause', handleAudioPause);
      audio.removeEventListener('ended', handleAudioEnded);
    };
  }, [onPlay, onPause]);

  useEffect(() => {
    if (audioSource instanceof File) {
      const url = URL.createObjectURL(audioSource);
      setAudioUrl(url);

      if (audioRef.current) {
        audioRef.current.load();
      }

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setAudioUrl(audioSource);

      if (audioRef.current) {
        audioRef.current.load();
      }
    }
  }, [audioSource]);

  return (
    <S.Container>
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
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
          {isPlaying() ? <S.StyledPause /> : <S.StyledPlay />}
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
