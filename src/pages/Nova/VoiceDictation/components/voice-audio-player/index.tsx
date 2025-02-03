import React, { useRef, useState } from 'react';
import Button from 'components/buttons/Button';
import DownloadIcon from 'img/light/ico_download_white.svg';
import { ReactComponent as GoBackward } from 'img/light/nova/voiceDictation/go_backward.svg';
import { ReactComponent as GoForward } from 'img/light/nova/voiceDictation/go_forward.svg';
import { ReactComponent as Pause } from 'img/light/nova/voiceDictation/pause.svg';
import { ReactComponent as Play } from 'img/light/nova/voiceDictation/play.svg';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import * as S from './style';

// 스타일드 컴포넌트 Props 타입

// 메인 컴포넌트 Props 타입
interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

// 재생 속도 타입
type PlaybackSpeed = 0.8 | 1.0 | 1.2 | 1.5 | 1.8 | 2.0;

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  onTimeUpdate,
  onDurationChange,
  onPlay,
  onPause
}) => {
  const { t } = useTranslation();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleLoadedMetadata = (): void => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration;
      setDuration(audioDuration);
      onDurationChange?.(audioDuration);
    }
  };

  const handleTimeUpdate = (): void => {
    if (audioRef.current) {
      const currentTimeValue = audioRef.current.currentTime;
      setCurrentTime(currentTimeValue);
      onTimeUpdate?.(currentTimeValue);
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

  const handlePlaybackSpeedChange = (): void => {
    if (audioRef.current) {
      const speeds: PlaybackSpeed[] = [0.8, 1.0, 1.2, 1.5, 1.8, 2.0];
      const currentIndex = speeds.indexOf(playbackSpeed);
      const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
      setPlaybackSpeed(nextSpeed);
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <S.Container>
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
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

        <S.PlayButton onClick={togglePlay}>{isPlaying ? <Pause /> : <Play />}</S.PlayButton>

        <S.SkipButton onClick={() => handleSkip(-5)}>
          <GoBackward />
        </S.SkipButton>

        <S.SkipButton onClick={() => handleSkip(5)}>
          <GoForward />
        </S.SkipButton>
      </S.ControlsContainer>

      <S.ButtonWrapper>
        <Button
          variant="purple"
          width={'full'}
          height={48}
          cssExt={css`
            display: flex;
            gap: 4px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px;
          `}
          onClick={() => console.log(123)}>
          <img src={DownloadIcon} alt="download" />
          <span>{t(`Nova.Result.Save`)}</span>
        </Button>
      </S.ButtonWrapper>

      {/* <S.BottomBar>
        <S.BottomIndicator />
      </S.BottomBar> */}
    </S.Container>
  );
};

export default AudioPlayer;
