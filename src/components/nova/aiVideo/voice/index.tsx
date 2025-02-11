import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { css } from 'styled-components';

import { apiWrapper } from '../../../../api/apiWrapper';
import { NOVA_VIDEO_GET_VOICES } from '../../../../api/constant';
import { AvatarInfo, Avatars, InitAvatarInfo, Voices } from '../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import PlayDarkIcon from '../../../../img/dark/nova/aiVideo/ico_play.svg';
import SoundDarkIcon from '../../../../img/dark/nova/aiVideo/ico_sound.svg';
import ArrowRightIcon from '../../../../img/light/ico_arrow_right.svg';
import CreditColorIcon from '../../../../img/light/ico_credit_color.svg';
import PlayLightIcon from '../../../../img/light/nova/aiVideo/ico_play.svg';
import SoundLightIcon from '../../../../img/light/nova/aiVideo/ico_sound.svg';
import {
  selectPageResult,
  setPageStatus,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import Button from '../../../buttons/Button';
import AvatarCard from '../component/AvatarCard';
import SelectVoice from '../component/SelectVoice';

import * as S from './style';

interface VoiceProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function Voice({ activeStep, setActiveStep }: VoiceProps) {
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const [voiceList, setVoiceList] = useState<Voices[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  useEffect(() => {
    getVoiceList();
  }, []);

  useEffect(() => {
    if (result?.info.selectedAvatar.voice.voice_id === '' && voiceList.length > 0) {
      dispatch(
        updatePageResult({
          tab: NOVA_TAB_TYPE.aiVideo,
          result: {
            info: { selectedAvatar: { ...result.info.selectedAvatar, voice: voiceList[0] } }
          }
        })
      );
    }
  }, [voiceList]);

  const getVoiceList = async () => {
    const { res } = await apiWrapper().request(NOVA_VIDEO_GET_VOICES, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });

    const { data } = await res.json();
    setVoiceList(data.voices);
  };

  const changeSelectedVoice = (voice: Voices) => {
    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            selectedAvatar: {
              ...result?.info?.selectedAvatar,
              voice: voice
            }
          }
        }
      })
    );
    setVoiceList(
      voice ? [voice, ...voiceList.filter((item) => item.voice_id !== voice.voice_id)] : voiceList
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
          <span className="title">아바타 목소리</span>
          <div className="show" onClick={() => setIsOpen(true)}>
            <span>더 보기</span>
            <img src={ArrowRightIcon} alt="show_more" />
          </div>
        </S.TitleWrap>
        <S.VoiceContainer>
          {voiceList.slice(0, 3).map((voice) => (
            <S.VoiceItem
              key={voice.voice_id}
              isSelected={result?.info.selectedAvatar?.voice.voice_id === voice.voice_id}
              onClick={() => changeSelectedVoice(voice)}>
              <S.VoiceInfo
                isSelected={result?.info.selectedAvatar?.voice.voice_id === voice.voice_id}>
                <span className="name">{voice.name}</span>
                <S.IdentifyWrap
                  isSelected={result?.info.selectedAvatar?.voice.voice_id === voice.voice_id}>
                  <img src={result?.info.selectedAvatar?.voice.flag} alt="flag" />
                  <span>{`${result?.info.selectedAvatar?.voice.language} | ${result?.info.selectedAvatar?.voice.gender}`}</span>
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
          cssExt={css`
            display: flex;
            gap: 4px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px;
            position: relative;
          `}
          onClick={() => {
            setActiveStep(activeStep + 1);
            dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'script' }));
          }}>
          <span>{'AI 비디오 만들기'}</span>
          <S.CreditInfo>
            <img src={CreditColorIcon} alt="credit" />
            <span>10</span>
          </S.CreditInfo>
        </Button>
      </S.Container>
      {isOpen && (
        <SelectVoice
          voiceList={voiceList}
          setIsOpen={setIsOpen}
          changeSelectedVoice={changeSelectedVoice}
          audioRef={audioRef}
          playingVoiceId={playingVoiceId}
          setPlayingVoiceId={setPlayingVoiceId}
          playVoice={playVoice}
        />
      )}
    </>
  );
}
