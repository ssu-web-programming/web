import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { ReactComponent as DarkGoBackward } from 'img/dark/nova/voice-dictation/go_backward.svg';
import { ReactComponent as DarkGoForward } from 'img/dark/nova/voice-dictation/go_forward.svg';
import { ReactComponent as GoBackward } from 'img/light/nova/voiceDictation/go_backward.svg';
import { ReactComponent as GoForward } from 'img/light/nova/voiceDictation/go_forward.svg';
import AudioPlayer from 'react-h5-audio-player';

import UseShowSurveyModal from '../../../../../components/hooks/use-survey-modal';
import {
  selectPageCreditReceived,
  selectPageService
} from '../../../../../store/slices/nova/pageStatusSlice';
import { selectTabSlice } from '../../../../../store/slices/tabSlice';
import { useAppSelector } from '../../../../../store/store';

import * as S from './style';

import 'react-h5-audio-player/lib/styles.css';

// 메인 컴포넌트 Props 타입
interface CustomAudioPlayerProps extends PropsWithChildren {
  audioUrl?: string;
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

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({
  audioUrl,
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
  // const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const playerRef = useRef<any>(null);

  const { selectedNovaTab } = useAppSelector(selectTabSlice);
  const service = useAppSelector(selectPageService(selectedNovaTab));
  const isCreditRecieved = useAppSelector(selectPageCreditReceived(selectedNovaTab));
  const showSurveyModal = UseShowSurveyModal();

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // 재생 속도 변경 핸들러
  const handleChangeSpeedOptions = useCallback((nextSpeed: PlaybackSpeed) => {
    if (playerRef.current && playerRef.current.audio.current) {
      setPlaybackSpeed(nextSpeed);
      playerRef.current.audio.current.playbackRate = nextSpeed;
    }
  }, []);

  // 재생 속도 버튼 클릭 핸들러
  const handlePlaybackSpeedChange = useCallback((): void => {
    openSpeedbackPopup?.(handleChangeSpeedOptions, playbackSpeed);
  }, [openSpeedbackPopup, handleChangeSpeedOptions, playbackSpeed]);

  // 재생 시작 함수
  const startPlayback = useCallback(() => {
    if (playerRef.current && playerRef.current.audio && playerRef.current.audio.current) {
      const audioElement = playerRef.current.audio.current;

      if (audioElement.paused) {
        audioElement
          .play()
          .then(() => {
            setIsPlaying(true);
            onPlay?.();
          })
          .catch((err: Error) => {
            console.error('Error playing audio:', err);
          });
      }
    }
  }, [onPlay]);

  // 앞/뒤로 이동 함수 - react-h5-audio-player에서는 직접 건너뛰기 기능을 제공하지만
  // 기존 UI를 유지하기 위해 커스텀 기능으로 구현
  const handleSkip = useCallback(async (seconds: number): Promise<void> => {
    const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
    if (isShowModal) return;

    if (playerRef.current && playerRef.current.audio.current) {
      const audioElement = playerRef.current.audio.current;
      const wasPlaying = !audioElement.paused;

      // 정확한 시간 계산 및 제한
      const newTime = Math.max(
        0,
        Math.min(audioElement.currentTime + seconds, audioElement.duration || 0)
      );

      // 시간 설정
      audioElement.currentTime = newTime;
      setCurrentTime(newTime);

      // 재생 중이었다면 재생 상태 유지
      if (wasPlaying && audioElement.paused) {
        audioElement.play().catch((err: Error) => {
          console.error('Error playing audio after skip:', err);
        });
      }
    }
  }, []);

  // progress bar 클릭 핸들러
  // const handleProgressBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>): void => {
  //   if (playerRef.current && playerRef.current.audio.current) {
  //     const audioElement = playerRef.current.audio.current;
  //     console.log('audioElement', audioElement);
  //     const progressBar = e.currentTarget;
  //     console.log('progressBar', progressBar);
  //     const rect = progressBar.getBoundingClientRect();
  //     console.log('rect', rect);
  //     const clickPosition = e.clientX - rect.left;
  //     console.log('clickPosition', clickPosition);
  //     const totalWidth = rect.width;
  //     const percentage = clickPosition / totalWidth;
  //     const newTime = percentage * audioElement.duration;

  //     // 시간 변경
  //     audioElement.currentTime = Math.max(0, Math.min(newTime, audioElement.duration));
  //     setCurrentTime(audioElement.currentTime);

  //     // 바로 재생 시작
  //     startPlayback();
  //   }
  // }, []);

  // 재생/일시정지 토글 핸들러
  const handleTogglePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // 이벤트 버블링 방지

      if (playerRef.current) {
        if (playerRef.current.audio && playerRef.current.audio.current) {
          const audioElement = playerRef.current.audio.current;

          if (audioElement.paused) {
            audioElement
              .play()
              .then(() => {
                setIsPlaying(true);
                onPlay?.();
              })
              .catch((err: Error) => {
                console.error('Error playing audio:', err);
              });
          } else {
            audioElement.pause();
            setIsPlaying(false);
            onPause?.();
          }
        }
      }
    },
    [onPlay, onPause]
  );

  // 진행률 계산
  const progress = duration ? (currentTime / duration) * 100 : 0;

  // useEffect(() => {
  //   console.log('audioSource', audioSource);
  //   if (audioSource instanceof File) {
  //     const url = URL.createObjectURL(audioSource);
  //     setAudioUrl(url);

  //     return () => {
  //       URL.revokeObjectURL(url);
  //     };
  //   } else {
  //     setAudioUrl(audioSource);
  //   }
  // }, [audioSource]);

  // 오디오 상태 감시
  useEffect(() => {
    const updateCurrentTime = () => {
      if (playerRef.current && playerRef.current.audio.current) {
        setCurrentTime(playerRef.current.audio.current.currentTime);
      }
    };

    // 100ms마다 현재 시간 업데이트
    const timeUpdateInterval = setInterval(updateCurrentTime, 100);

    return () => {
      clearInterval(timeUpdateInterval);
    };
  }, []);

  console.log('audioUrl', audioUrl);

  return (
    <S.Container>
      <AudioPlayer
        ref={playerRef}
        src={audioUrl}
        autoPlay={false}
        preload="metadata"
        customControlsSection={[]} // 모든 기본 컨트롤 숨기기
        customProgressBarSection={[]} // 기본 프로그레스 바 숨기기
        style={{ display: 'none' }} // 전체 플레이어 UI 숨기기
        onLoadedMetaData={(e: any) => {
          const audioElement = e.target as HTMLAudioElement;
          const audioDuration = audioElement.duration;
          setDuration(audioDuration);
          onDurationChange?.(audioDuration);
        }}
        onPlay={async () => {
          const isShowModal = await showSurveyModal(selectedNovaTab, service, isCreditRecieved);
          if (isShowModal) return;

          setIsPlaying(true);
          onPlay?.();
        }}
        onPause={() => {
          setIsPlaying(false);
          onPause?.();
        }}
        onEnded={() => {
          setIsPlaying(false);
        }}
      />

      <S.ProgressBarContainer>
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

        <S.PlayButton onClick={handleTogglePlay}>
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

export default CustomAudioPlayer;
