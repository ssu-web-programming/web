import * as React from 'react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { AudioContext } from '../../../../../components/nova/aiVideo';
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
const STEP_ORDER = ['avatar', 'voice', 'script', 'loading', 'saving', 'done'] as const;

const Container = styled.div<{ isCentered: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: ${({ isCentered }) => (isCentered ? 'center' : 'space-between')};
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

const VoiceName = styled.div<{ isCentered: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({ isCentered }) => (isCentered ? 'center' : 'flex-start')};
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 700;
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

function GuideMessage() {
  const { t } = useTranslation();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const status = useAppSelector(selectPageStatus(NOVA_TAB_TYPE.aiVideo));
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));

  const audioContext = useContext(AudioContext);

  const selectedAvatar = result?.info?.selectedAvatar;
  const selectedVoice = selectedAvatar?.voice as Voices;
  const voiceName = selectedVoice?.name || '-';
  const voiceLanguage = selectedVoice?.language || '-';
  const voiceGender = selectedVoice?.gender || '-';
  const flagImage = selectedVoice?.flag || '';

  const isRenderSound = status == 'voice' || status == 'script';
  const currentStep = STEP_ORDER.includes(status as any) ? STEP_ORDER.indexOf(status as any) : 0;

  const playVoice = () => {
    if (!selectedVoice || !selectedVoice.preview_audio || !audioContext) return;

    audioContext.playVoice(selectedVoice.preview_audio, selectedVoice.voice_id);
  };

  // 스피커 아이콘 렌더링
  const renderSoundIcon = () => {
    if (!selectedVoice?.voice_id || !audioContext) return null;

    // audioContext의 playingVoiceId 사용
    const isPlaying = audioContext.playingVoiceId === selectedVoice.voice_id;

    if (isPlaying) {
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
      <Container isCentered={!isRenderSound}>
        <Message>{t('Nova.aiVideo.avatarCard.guide')}</Message>
      </Container>
    );
  }

  // 나머지 단계에서는 아바타 정보 표시
  return (
    <Container isCentered={!isRenderSound}>
      <InfoContainer>
        <VoiceName isCentered={!isRenderSound}>{voiceName}</VoiceName>
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
      {isRenderSound && renderSoundIcon()}
    </Container>
  );
}

export default GuideMessage;
