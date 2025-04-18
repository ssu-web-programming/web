import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Voices } from '../../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import { ReactComponent as PlayDarkIcon } from '../../../../../img/dark/nova/aiVideo/ico_play.svg';
import { ReactComponent as SoundDarkIcon } from '../../../../../img/dark/nova/aiVideo/ico_sound.svg';
import { ReactComponent as PlayLightIcon } from '../../../../../img/light/nova/aiVideo/ico_play.svg';
import { ReactComponent as SoundLightIcon } from '../../../../../img/light/nova/aiVideo/ico_sound.svg';
import {
  selectPageResult,
  selectPageStatus
} from '../../../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../../../store/slices/theme';
import { useAppSelector } from '../../../../../store/store';

// 스텝 순서 정의
const STEP_ORDER = ['avatar', 'voice', 'script'] as const;

const Container = styled.div<{ isActive?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Message = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  text-align: center;
  white-space: break-spaces;
  color: ${({ theme }) => theme.color.text.gray07};
`;

const VoiceName = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.color.text.main};
`;

const IconWrapper = styled.div`
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
    path {
      fill: ${({ theme }) => theme.color.text.main};
    }
  }
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FlagImage = styled.img`
  width: 16px;
  height: 12px;
  object-fit: cover;
`;

const FlagPlaceholder = styled.div`
  width: 16px;
  height: 12px;
  background-color: ${({ theme }) => theme.color.background.gray06};
`;

const Detail = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.color.text.gray07};
`;

const Divider = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.color.text.gray07};
`;

interface GuideMessageProps {
  audioRef?: React.MutableRefObject<HTMLAudioElement | null>;
}

function GuideMessage({ audioRef }: GuideMessageProps) {
  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.aiVideo));
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const [playingVoiceId, setPlayingVoiceId] = React.useState<string | null>(null);

  const selectedAvatar = result?.info?.selectedAvatar;
  const selectedVoice = selectedAvatar?.voice as Voices;
  const voiceName = selectedVoice?.name || '-';
  const voiceLanguage = selectedVoice?.language || '-';
  const voiceGender = selectedVoice?.gender || '-';
  const flagImage = selectedVoice?.flag || '';

  // 현재 단계 결정
  const currentStep = STEP_ORDER.includes(status as any) ? STEP_ORDER.indexOf(status as any) : 0;

  // 현재 단계가 '음성 설정' 단계인지 확인 (2단계 = 인덱스 1)
  const isVoiceStep = currentStep === 1;

  // 목소리 재생 함수
  const playVoice = () => {
    if (!selectedVoice || !selectedVoice.preview_audio || !audioRef?.current) return;

    const audioElement = audioRef.current;
    audioElement.src = selectedVoice.preview_audio;
    audioElement.play().then(() => setPlayingVoiceId(selectedVoice.voice_id));
    audioElement.onended = () => setPlayingVoiceId(null);
  };

  // 스피커 아이콘 렌더링
  const renderSoundIcon = () => {
    if (!selectedVoice?.voice_id) return null;

    if (playingVoiceId === selectedVoice.voice_id) {
      return (
        <IconWrapper onClick={playVoice}>
          {isLightMode ? <PlayLightIcon /> : <PlayDarkIcon />}
        </IconWrapper>
      );
    } else {
      return (
        <IconWrapper onClick={playVoice}>
          {isLightMode ? <SoundLightIcon /> : <SoundDarkIcon />}
        </IconWrapper>
      );
    }
  };

  // 아바타 선택 단계인 경우 가이드 메시지 표시
  if (currentStep === 0) {
    return (
      <Container>
        <Message>{t('Nova.aiVideo.avatarCard.guide')}</Message>
      </Container>
    );
  }

  // 나머지 단계에서는 아바타 정보 표시
  return (
    <Container isActive={isVoiceStep}>
      <InfoContainer>
        <VoiceName>{voiceName}</VoiceName>
        <Details>
          {voiceLanguage && (
            <>
              {flagImage ? <FlagImage src={flagImage} alt={voiceLanguage} /> : <FlagPlaceholder />}
              <Detail>{voiceLanguage}</Detail>
              {voiceGender && (
                <>
                  <Divider>|</Divider>
                  <Detail>{voiceGender}</Detail>
                </>
              )}
            </>
          )}
        </Details>
      </InfoContainer>
      {currentStep > 0 && renderSoundIcon()}
    </Container>
  );
}

export default GuideMessage;
