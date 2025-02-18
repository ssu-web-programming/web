import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { css } from 'styled-components';

import { apiWrapper } from '../../../../../api/apiWrapper';
import { NOVA_VIDEO_GET_VOICES, NOVA_VIDEO_GET_VOICES_LANG } from '../../../../../api/constant';
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
import { lang } from '../../../../../locale';
import { selectPageResult } from '../../../../../store/slices/nova/pageStatusSlice';
import { screenModeSelector } from '../../../../../store/slices/screenMode';
import { themeInfoSelector } from '../../../../../store/slices/theme';
import { useAppSelector } from '../../../../../store/store';
import { isMobile } from '../../../../../util/bridge';
import Blanket from '../../../../Blanket';
import Button from '../../../../buttons/Button';
import { useGetAvatars } from '../../../../hooks/nova/use-get-avatars';
import { useGetVoices } from '../../../../hooks/nova/use-get-voices';
import SelectBox from '../../../../selectBox';

import * as S from './styles';

interface SelectAvatarProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  changeSelectedVoice: (voice: Voices) => void;
}

export default function SelectVoice({ setIsOpen, changeSelectedVoice }: SelectAvatarProps) {
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { screenMode } = useAppSelector(screenModeSelector);
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const [tempVoice, setTempVoice] = useState<Voices | null>(null);

  const genderMenu = [
    { key: 'all', title: '전체', value: 'all' },
    { key: 'male', title: '남성', value: 'male' },
    { key: 'female', title: '여성', value: 'female' }
  ];
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const { getVoices, hasMore, loading } = useGetVoices();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastVoiceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (result?.info.selectedAvatar.voice_id != '') {
      setTempVoice(result?.info.selectedAvatar.voice);
    }
  }, [result]);

  useEffect(() => {
    if (loading || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          getVoices(selectedGender, selectedLanguage);
        }
      },
      { threshold: 0.5 }
    );

    if (lastVoiceRef.current) {
      observerRef.current.observe(lastVoiceRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading, hasMore, selectedGender, selectedLanguage]);

  const handleVoiceClick = (voice: Voices) => {
    setTempVoice(voice);
  };

  const handleSelectVoice = () => {
    if (tempVoice) {
      changeSelectedVoice(tempVoice);
      setIsOpen(false);
    }
  };

  const handleGenderChange = (gender: string) => {
    const selected = genderMenu.find((item) => item.title === gender);
    if (selected) setSelectedGender(selected.value);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);

    const voiceList = result?.info.voices.filter((voice: Voices) => voice.language === language);
    if (voiceList.length <= 0) {
      getVoices(selectedGender, language);
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
        <S.SelectBoxWrap>
          <SelectBox
            menuItem={genderMenu}
            selectedItem={genderMenu.find((item) => item.value === selectedGender)?.title}
            setSelectedItem={handleGenderChange}
            placeHolder={'성별'}
            isMenuAbove={false}
            minWidth={160}
            maxWidth={160}
            paddingX={12}
            paddingY={16}
            gap={6}
            isSelectedHighlighted={false}
            isDriver={true}
            selectBoxCssExt={css`
              min-width: 80px;
              border: none;
              border-radius: 99px;
              background-color: ${isLightMode ? 'var(--gray-gray-10)' : 'var(--gray-gray-90)'};
            `}
            innerBoxCssExt={css`
              min-height: 24px;
            `}
          />
          {result?.info.languages && (
            <SelectBox
              menuItem={result?.info.languages?.map((lang: { id: string; name: string }) => ({
                key: lang.id,
                title: lang.name
              }))}
              selectedItem={selectedLanguage}
              setSelectedItem={handleLanguageChange}
              placeHolder={'국가'}
              isMenuAbove={false}
              minWidth={160}
              maxWidth={160}
              maxHeight={192}
              paddingX={12}
              paddingY={16}
              gap={6}
              isSelectedHighlighted={false}
              isDriver={true}
              selectBoxCssExt={css`
                min-width: 80px;
                border: none;
                border-radius: 99px;
                background-color: ${isLightMode ? 'var(--gray-gray-10)' : 'var(--gray-gray-90)'};
              `}
              innerBoxCssExt={css`
                min-height: 30px;
              `}
            />
          )}
        </S.SelectBoxWrap>
        <S.ListWrap>
          {result?.info.voices
            .filter(
              (voice: Voices) =>
                (selectedGender === 'all' || voice.gender.toLowerCase() === selectedGender) &&
                (selectedLanguage === 'all' ||
                  voice.language?.toLowerCase() === selectedLanguage?.toLowerCase())
            )
            .map((voice: Voices) => (
              <S.VoiceContainer
                key={voice.voice_id}
                isSelected={tempVoice?.voice_id === voice.voice_id}
                onClick={() => handleVoiceClick(voice)}
                ref={lastVoiceRef}>
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
