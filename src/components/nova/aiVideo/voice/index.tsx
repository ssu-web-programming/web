import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';

import { Voices } from '../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import ArrowRightDarkIcon from '../../../../img/dark/ico_arrow_right.svg';
import InfoDarkIcon from '../../../../img/dark/ico_circle_info.svg';
import PlayDarkIcon from '../../../../img/dark/nova/aiVideo/ico_play.svg';
import SoundDarkIcon from '../../../../img/dark/nova/aiVideo/ico_sound.svg';
import HeyzenLogoDarkIcon from '../../../../img/dark/nova/logo/ico_heygen_name_logo.svg';
import ArrowRightLightIcon from '../../../../img/light/ico_arrow_right.svg';
import InfoLightIcon from '../../../../img/light/ico_circle_info.svg';
import CreditColorIcon from '../../../../img/light/ico_credit_color.svg';
import PlayLightIcon from '../../../../img/light/nova/aiVideo/ico_play.svg';
import SoundLightIcon from '../../../../img/light/nova/aiVideo/ico_sound.svg';
import HeyzenLogoLightIcon from '../../../../img/light/nova/logo/ico_heygen_name_logo.svg';
import {
  selectPageResult,
  setPageStatus,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import ArrowTooltips from '../../../ArrowTooltip';
import Button from '../../../buttons/Button';
import AvatarCard from '../component/AvatarCard';
import SelectVoice from '../component/SelectVoice';

import * as S from './style';

export default function Voice() {
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { t } = useTranslation();
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  useEffect(() => {
    if (result?.info.selectedAvatar.voice.voice_id === '' && result?.info.voices?.length > 0) {
      dispatch(
        updatePageResult({
          tab: NOVA_TAB_TYPE.aiVideo,
          result: {
            info: {
              ...result?.info,
              selectedAvatar: { ...result.info.selectedAvatar, voice: result.info.voices[0] }
            }
          }
        })
      );
    }
  }, [result?.info.voices]);

  const changeSelectedVoice = (voice: Voices) => {
    if (!result || !result.info.voices) return;

    const currentVoices = result.info.voices;
    const firstThreeVoices = currentVoices.slice(0, 3); // 앞의 3개 요소
    const remainingVoices = currentVoices.slice(3); // 나머지 요소

    // 선택한 보이스가 앞의 3개 중 하나라면 순서 변경 없이 유지
    if (firstThreeVoices.some((item: Voices) => item.voice_id === voice.voice_id)) {
      return dispatch(
        updatePageResult({
          tab: NOVA_TAB_TYPE.aiVideo,
          result: {
            info: {
              selectedAvatar: {
                ...result.info.selectedAvatar,
                voice: voice
              },
              voices: currentVoices // 순서 유지
            }
          }
        })
      );
    }

    // 선택한 보이스가 앞의 3개에 없으면 나머지 목록에서 필터링 후 맨 앞으로 이동
    const updatedVoices = [
      voice,
      ...firstThreeVoices,
      ...remainingVoices.filter((item: Voices) => item.voice_id !== voice.voice_id)
    ];

    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            selectedAvatar: {
              ...result.info.selectedAvatar,
              voice: voice
            },
            voices: updatedVoices
          }
        }
      })
    );
  };

  const playVoice = (voice: Voices) => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.src = voice.preview_audio;
      audioElement.play().then(() => setPlayingVoiceId(voice.voice_id));
      audioElement.onended = () => setPlayingVoiceId(null);
    }
  };

  return (
    <>
      <S.Container>
        <AvatarCard />
        <S.TitleWrap>
          <div className="wrap">
            <span className="title">{t('Nova.aiVideo.selectVoice.title')}</span>
            <ArrowTooltips message={t('Nova.aiVideo.tooltip.selectVoice')} placement="top-start">
              <img src={isLightMode ? InfoLightIcon : InfoDarkIcon} alt="info" />
            </ArrowTooltips>
          </div>
          <div className="show" onClick={() => setIsOpen(true)}>
            <span>{t('Nova.aiVideo.button.showMore')}</span>
            <img src={isLightMode ? ArrowRightLightIcon : ArrowRightDarkIcon} alt="show_more" />
          </div>
        </S.TitleWrap>
        <S.VoiceContainer>
          {result?.info.voices &&
            result?.info.voices.slice(0, 3).map((voice: Voices) => (
              <S.VoiceItem
                key={voice.voice_id}
                isSelected={result?.info.selectedAvatar?.voice.voice_id === voice.voice_id}
                onClick={() => changeSelectedVoice(voice)}>
                <S.VoiceInfo
                  isSelected={result?.info.selectedAvatar?.voice.voice_id === voice.voice_id}>
                  <span className="name">{voice.name}</span>
                  <S.IdentifyWrap
                    isSelected={result?.info.selectedAvatar?.voice.voice_id === voice.voice_id}>
                    <img src={voice.flag} alt="flag" />
                    <span>{`${voice.language} | ${voice.gender}`}</span>
                  </S.IdentifyWrap>
                </S.VoiceInfo>
                <img
                  src={
                    playingVoiceId === voice.voice_id
                      ? isLightMode
                        ? PlayLightIcon
                        : PlayDarkIcon
                      : isLightMode
                        ? SoundLightIcon
                        : SoundDarkIcon
                  }
                  alt="play"
                  onClick={() => playVoice(voice)}
                />
                <audio ref={audioRef} muted={false} />
              </S.VoiceItem>
            ))}
        </S.VoiceContainer>
        <Button
          variant="purple"
          width={'full'}
          height={48}
          disable={true}
          cssExt={css`
            display: flex;
            gap: 4px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px;
            position: relative;
          `}
          onClick={() => {
            dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'script' }));
          }}>
          <span>{t('Nova.aiVideo.button.makeVideo')}</span>
          <S.CreditInfo>
            <img src={CreditColorIcon} alt="credit" />
            <span>10</span>
          </S.CreditInfo>
        </Button>

        <img
          src={isLightMode ? HeyzenLogoLightIcon : HeyzenLogoDarkIcon}
          alt="logo"
          className="logo"
        />
      </S.Container>
      {isOpen && <SelectVoice setIsOpen={setIsOpen} changeSelectedVoice={changeSelectedVoice} />}
    </>
  );
}
