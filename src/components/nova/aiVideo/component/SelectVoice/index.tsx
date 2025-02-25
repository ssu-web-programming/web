import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';
import { css } from 'styled-components';

import { Voices } from '../../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import CircleSelectedDarkIcon from '../../../../../img/dark/ico_check_circle.svg';
import CircleDarkIcon from '../../../../../img/dark/ico_circle.svg';
import CloseDarkIcon from '../../../../../img/dark/ico_nova_close.svg';
import SoundDarkIcon from '../../../../../img/dark/nova/aiVideo/ico_sound.svg';
import SkeletonDark from '../../../../../img/dark/nova/aiVideo/skeleton_voice.json';
import SpinnerDark from '../../../../../img/dark/nova/nova_spinner.json';
import CircleSelectedLightIcon from '../../../../../img/light/ico_check_circle.svg';
import CircleLightIcon from '../../../../../img/light/ico_circle.svg';
import CloseLightIcon from '../../../../../img/light/ico_nova_close.svg';
import SoundLightIcon from '../../../../../img/light/nova/aiVideo/ico_sound.svg';
import SkeletonLight from '../../../../../img/light/nova/aiVideo/skeleton_voice.json';
import SpinnerLight from '../../../../../img/light/nova/nova_spinner.json';
import { selectPageResult } from '../../../../../store/slices/nova/pageStatusSlice';
import { screenModeSelector } from '../../../../../store/slices/screenMode';
import { themeInfoSelector } from '../../../../../store/slices/theme';
import { useAppSelector } from '../../../../../store/store';
import { isMobile } from '../../../../../util/bridge';
import Blanket from '../../../../Blanket';
import Button from '../../../../buttons/Button';
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
  const { t } = useTranslation();
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));
  const [tempVoice, setTempVoice] = useState<Voices | null>(null);

  const genderMenu = [
    { key: 'all', title: t('Nova.aiVideo.selectAvatar.tabs.all'), value: 'all' },
    { key: 'male', title: t('Nova.aiVideo.selectAvatar.tabs.male'), value: 'male' },
    { key: 'female', title: t('Nova.aiVideo.selectAvatar.tabs.female'), value: 'female' }
  ];
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const { getVoices, hasMore, loading } = useGetVoices();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastVoiceRef = useRef<HTMLDivElement | null>(null);
  const [filteredVoices, setFilteredVoices] = useState<Voices[]>([]);

  useEffect(() => {
    if (result?.info.selectedAvatar.voice_id != '') {
      setTempVoice(result?.info.selectedAvatar.voice);
    }
  }, [result]);

  useEffect(() => {
    if (!result?.info?.voices) return;

    const newFilteredVoices = result.info.voices.filter(
      (voice: Voices) =>
        (selectedGender === 'all' || voice.gender.toLowerCase() === selectedGender) &&
        (selectedLanguage === 'all' ||
          voice.language?.toLowerCase() === selectedLanguage?.toLowerCase())
    );

    setFilteredVoices(newFilteredVoices);
  }, [result?.info?.voices, selectedGender, selectedLanguage]);

  useEffect(() => {
    if (filteredVoices.length > 0) {
      lastVoiceRef.current = document.getElementById(
        filteredVoices[filteredVoices.length - 1].voice_id
      ) as HTMLDivElement;
    }
  }, [filteredVoices]);

  useEffect(() => {
    if (loading || !hasMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          getVoices(selectedGender, selectedLanguage);
        }
      },
      { threshold: 1 }
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
    const selected = genderMenu.find((item) => item.key === gender);
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
          <div>{t('Nova.aiVideo.selectVoice.title')}</div>
          <img
            src={isLightMode ? CloseLightIcon : CloseDarkIcon}
            alt="close"
            onClick={() => setIsOpen(false)}
          />
        </S.TitleWrap>
        <S.SelectBoxWrap>
          <SelectBox
            menuItem={genderMenu}
            selectedItem={selectedGender}
            setSelectedItem={handleGenderChange}
            placeHolder={t('Nova.aiVideo.selectVoice.selectBox.gender') || ''}
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
              placeHolder={t('Nova.aiVideo.selectVoice.selectBox.country') || ''}
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
          {filteredVoices.length > 0 ? (
            filteredVoices.map((voice: Voices, index) => (
              <S.VoiceContainer
                key={voice.voice_id}
                id={voice.voice_id} // ✅ 요소를 식별할 수 있도록 ID 추가
                isSelected={tempVoice?.voice_id === voice.voice_id}
                onClick={() => handleVoiceClick(voice)}
                ref={index === filteredVoices.length - 1 ? lastVoiceRef : null} // ✅ 마지막 요소만 lastVoiceRef에 저장
              >
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
                <img src={isLightMode ? SoundLightIcon : SoundDarkIcon} alt="play" />
              </S.VoiceContainer>
            ))
          ) : (
            <Lottie animationData={isLightMode ? SkeletonLight : SkeletonDark} loop play />
          )}
          {loading && (
            <Lottie animationData={isLightMode ? SkeletonLight : SkeletonDark} loop play />
          )}
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
            <span>{t('Nova.aiVideo.button.select')}</span>
          </Button>
        </S.ButtonWrap>
      </S.Container>
    </>
  );
}
