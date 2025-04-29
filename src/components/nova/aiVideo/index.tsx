import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { NOVA_TAB_TYPE } from '../../../constants/novaTapTypes';
import {
  selectPageResult,
  selectPageStatus,
  setPageStatus,
  updatePageResult
} from '../../../store/slices/nova/pageStatusSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useGetAvatars } from '../../hooks/nova/use-get-avatars';
import { useGetLanguages } from '../../hooks/nova/use-get-languages';
import { useGetVoices } from '../../hooks/nova/use-get-voices';
import Result from '../result/index';
import TimeOut from '../TimeOut';

import AvatarCard from './component/AvatarCard';
import CustomStepper from './component/stepper';
import Avatar from './avatar';
import Loading from './loading';
import Script from './script';
import * as S from './styles';
import Voice from './voice';

export const stepOrder = ['avatar', 'voice', 'script'] as const;

// 오디오 컨텍스트 생성
interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  playVoice: (audioUrl: string, voiceId: string, onEnd?: () => void) => void;
  stopAllVoices: () => void;
  playingVoiceId: string | null;
}

export const AudioContext = React.createContext<AudioContextType | null>(null);

export default function AIVideo() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.aiVideo));
  const activeStep = stepOrder.includes(status as any) ? stepOrder.indexOf(status as any) : 0;
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const { getAvatars } = useGetAvatars();
  const { getVoices } = useGetVoices();
  const { getLanguages } = useGetLanguages();

  // 공유 오디오 객체 생성
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playingVoiceId, setPlayingVoiceId] = React.useState<string | null>(null);

  // 오디오 재생 중지 함수
  const stopAllVoices = React.useCallback(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    audioElement.pause();
    audioElement.currentTime = 0;
    setPlayingVoiceId(null);
  }, []);

  // 오디오 재생 함수 (참조값과 선언이 겹치지 않도록 수정)
  const playAudio = React.useCallback(
    (audioUrl: string, voiceId: string, onEnd?: () => void) => {
      const audioElement = audioRef.current;
      if (!audioElement) return;

      // 오디오가 재생 중이라면 멈춤
      if (!audioElement.paused) {
        audioElement.pause();
        audioElement.currentTime = 0;
        // 현재 재생 중인 오디오를 다시 재생하려고 한다면 중단하고 반환
        if (playingVoiceId === voiceId) {
          setPlayingVoiceId(null);
          return;
        }
      }

      audioElement.src = audioUrl;
      audioElement.onended = () => {
        setPlayingVoiceId(null);
        onEnd?.();
      };
      audioElement
        .play()
        .then(() => {
          setPlayingVoiceId(voiceId);
        })
        .catch((error) => {
          console.error('오디오 재생 실패:', error);
        });
    },
    [playingVoiceId]
  );

  // 오디오 컨텍스트 값
  const audioContextValue = React.useMemo(
    () => ({
      audioRef,
      playVoice: playAudio,
      stopAllVoices,
      playingVoiceId
    }),
    [playAudio, stopAllVoices, playingVoiceId]
  );

  const stepLabels = [
    t('Nova.aiVideo.selectAvatar.stepTitle'),
    t('Nova.aiVideo.selectVoice.stepTitle'),
    t('Nova.aiVideo.addScript.stepTitle')
  ];

  const fetchInitialData = async () => {
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'progress' }));

    try {
      if (!result?.info.avatars) {
        await getAvatars();
      }

      if (!result?.info.voices) {
        await getVoices('all', 'all');
      }

      if (!result?.info.languages) {
        await getLanguages();
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  useEffect(() => {
    fetchInitialData().then(() => {
      dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: status }));
    });
  }, []);

  // 아바타 로드 완료 시 첫 번째 아바타 자동 선택
  useEffect(() => {
    if (
      result?.info?.avatars &&
      result.info.avatars.length > 0 &&
      (!result?.info?.selectedAvatar?.avatar || !result?.info?.selectedAvatar?.avatar?.avatar_id)
    ) {
      dispatch(
        updatePageResult({
          tab: NOVA_TAB_TYPE.aiVideo,
          result: {
            info: {
              ...result?.info,
              selectedAvatar: {
                ...(result?.info?.selectedAvatar || {}),
                avatar: result.info.avatars[0],
                voice: { voice_id: '' },
                input_text: ''
              }
            }
          }
        })
      );
    }
  }, [result?.info?.avatars]);

  const renderStepContent = () => {
    if (activeStep === 0) {
      return <Avatar />;
    } else if (activeStep === 1) {
      return <Voice />;
    } else {
      return <Script />;
    }
  };

  const renderContent = () => {
    if (status === 'done' || status === 'saving') {
      return (
        <Result>
          <AvatarCard isHideColorPicker={true} />
        </Result>
      );
    } else if (status === 'loading') {
      return <Loading />;
    } else if (status === 'timeout') {
      return <TimeOut />;
    } else {
      return (
        <S.Container>
          <CustomStepper currentStep={activeStep} steps={stepLabels.map((label) => ({ label }))} />
          {renderStepContent()}
        </S.Container>
      );
    }
  };

  return (
    <AudioContext.Provider value={audioContextValue}>
      <S.Container>
        {renderContent()}
        <audio ref={audioRef} />
      </S.Container>
    </AudioContext.Provider>
  );
}

export { AvatarCard };
