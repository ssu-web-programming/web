import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import * as React from 'react';
import { css } from 'styled-components';

import { AvatarInfo, Voices } from '../../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import CircleSelectedDarkIcon from '../../../../../img/dark/ico_check_circle.svg';
import CircleDarkIcon from '../../../../../img/dark/ico_circle.svg';
import CloseDarkIcon from '../../../../../img/dark/ico_nova_close.svg';
import PlayDarkIcon from '../../../../../img/dark/nova/aiVideo/ico_play.svg';
import SoundDarkIcon from '../../../../../img/dark/nova/aiVideo/ico_sound.svg';
import CircleSelectedLightIcon from '../../../../../img/light/ico_check_circle.svg';
import CircleLightIcon from '../../../../../img/light/ico_circle.svg';
import CloseLightIcon from '../../../../../img/light/ico_nova_close.svg';
import PlayLightIcon from '../../../../../img/light/nova/aiVideo/ico_play.svg';
import SoundLightIcon from '../../../../../img/light/nova/aiVideo/ico_sound.svg';
import { selectPageResult } from '../../../../../store/slices/nova/pageStatusSlice';
import { screenModeSelector } from '../../../../../store/slices/screenMode';
import { themeInfoSelector } from '../../../../../store/slices/theme';
import { useAppSelector } from '../../../../../store/store';
import { isMobile } from '../../../../../util/bridge';
import Blanket from '../../../../Blanket';
import Button from '../../../../buttons/Button';

import * as S from './styles';
import { VoiceInfo, VoiceInfoWrap } from './styles';

interface SelectAvatarProps {
  voiceList: Voices[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  changeSelectedVoice: (voice: Voices) => void;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  playingVoiceId: string | null;
  setPlayingVoiceId: Dispatch<SetStateAction<string | null>>;
  playVoice: (voice: Voices) => void;
}

enum ETabType {
  all,
  male,
  female
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function SelectVoice({
  voiceList,
  setIsOpen,
  changeSelectedVoice,
  audioRef,
  playingVoiceId,
  setPlayingVoiceId,
  playVoice
}: SelectAvatarProps) {
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { screenMode } = useAppSelector(screenModeSelector);
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const [tempVoice, setTempVoice] = useState<Voices | null>(null);

  useEffect(() => {
    if (result?.info) setTempVoice(result.info.selectedAvatar.voice);
  }, [result]);

  const handleVoiceClick = (voice: Voices) => {
    setTempVoice(voice);
  };

  const handleSelectVoice = () => {
    if (tempVoice) {
      changeSelectedVoice(tempVoice);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Blanket />
      <S.Container $isMobile={isMobile} $isMin={screenMode === 'min'}>
        <S.TitleWrap>
          <div>목소리 선택</div>
          <img
            src={isLightMode ? CloseLightIcon : CloseDarkIcon}
            alt="close"
            onClick={() => setIsOpen(false)}
          />
        </S.TitleWrap>
        <S.ListWrap>
          {voiceList.map((voice) => (
            <S.VoiceContainer
              key={voice.voice_id}
              isSelected={tempVoice?.voice_id === voice.voice_id}
              onClick={() => handleVoiceClick(voice)}>
              <S.VoiceInfoWrap>
                <img
                  src={
                    tempVoice?.voice_id === voice.voice_id
                      ? isLightMode
                        ? CircleSelectedLightIcon
                        : CircleSelectedDarkIcon
                      : isLightMode
                        ? CircleLightIcon
                        : CircleDarkIcon
                  }
                  alt="play"
                  className="radio"
                />
                <S.VoiceInfo>
                  <span className="name">{voice.name}</span>
                  <S.IdentifyWrap>
                    <img src={voice?.flag} alt="flag" />
                    <span>{`${voice?.language} | ${voice?.gender}`}</span>
                  </S.IdentifyWrap>
                </S.VoiceInfo>
              </S.VoiceInfoWrap>
              <img
                src={isLightMode ? SoundLightIcon : SoundDarkIcon}
                alt="play"
                // onClick={() => playVoice(voice)}
              />
              {/*<audio ref={audioRef} muted={false} />*/}
            </S.VoiceContainer>
          ))}
        </S.ListWrap>
        <S.ButtonWrap>
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
              position: relative;
            `}
            onClick={handleSelectVoice}>
            <span>{'선택하기'}</span>
          </Button>
        </S.ButtonWrap>
      </S.Container>
    </>
  );
}
