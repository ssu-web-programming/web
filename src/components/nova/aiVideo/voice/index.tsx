import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-components';
import styled from 'styled-components';

import { Voices } from '../../../../constants/heygenTypes';
import { NOVA_TAB_TYPE } from '../../../../constants/novaTapTypes';
import InfoDarkIcon from '../../../../img/dark/ico_circle_info.svg';
import { ReactComponent as PlayDarkIcon } from '../../../../img/dark/nova/aiVideo/ico_play.svg';
import { ReactComponent as SoundDarkIcon } from '../../../../img/dark/nova/aiVideo/ico_sound.svg';
import InfoLightIcon from '../../../../img/light/ico_circle_info.svg';
import { ReactComponent as PlayLightIcon } from '../../../../img/light/nova/aiVideo/ico_play.svg';
import { ReactComponent as SoundLightIcon } from '../../../../img/light/nova/aiVideo/ico_sound.svg';
import {
  selectPageResult,
  setPageStatus,
  updatePageResult
} from '../../../../store/slices/nova/pageStatusSlice';
import { themeInfoSelector } from '../../../../store/slices/theme';
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import ArrowTooltips from '../../../ArrowTooltip';
import Button from '../../../buttons/Button';
import { useGetVoices } from '../../../hooks/nova/use-get-voices';
import Radio from '../../../radio';
import SelectBox from '../../../selectBox';
import AvatarCard from '../component/AvatarCard';
import HeygenLogo from '../component/HeygenLogo';
import VoiceSkeleton from '../component/VoiceSkeleton';

import * as S from './style';

const IconWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
    fill: ${({ theme }) => theme.color.text.gray03};
  }
`;

export default function Voice() {
  const dispatch = useAppDispatch();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { t } = useTranslation();
  const result = useAppSelector(selectPageResult(NOVA_TAB_TYPE.aiVideo));

  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [filteredVoices, setFilteredVoices] = useState<Voices[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastVoiceRef = useRef<HTMLDivElement | null>(null);

  const { getVoices, loading } = useGetVoices();

  const genderMenu = [
    { key: 'all', title: t('Nova.aiVideo.selectVoice.selectBox.gender'), value: 'all' },
    { key: 'male', title: t('Nova.aiVideo.selectVoice.selectBox.male'), value: 'male' },
    { key: 'female', title: t('Nova.aiVideo.selectVoice.selectBox.female'), value: 'female' }
  ];

  useEffect(() => {
    if (!result?.info?.voices || result.info.voices.length === 0) {
      getVoices('all', 'all');
    }

    // 오디오 요소 clean-up
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    // selectedAvatar나 voice가 undefined인 경우를 체크
    if (
      result?.info?.voices?.length > 0 &&
      result?.info?.selectedAvatar?.avatar?.avatar_id &&
      (!result?.info?.selectedAvatar?.voice || result?.info?.selectedAvatar?.voice?.voice_id === '')
    ) {
      // 기본 음성 선택
      dispatch(
        updatePageResult({
          tab: NOVA_TAB_TYPE.aiVideo,
          result: {
            info: {
              ...result?.info,
              selectedAvatar: {
                ...result.info.selectedAvatar,
                voice: result.info.voices[0]
              }
            }
          }
        })
      );
    }
  }, [result?.info?.voices, result?.info?.selectedAvatar]);

  useEffect(() => {
    // 선택된 아바타나 아바타 목록이 없으면 처리하지 않음
    if (!result?.info?.voices || !result?.info?.selectedAvatar?.avatar) return;

    // 중복 제거 및 필터링
    const uniqueVoices = new Map<string, Voices>();
    result.info.voices.forEach((voice: Voices) => {
      uniqueVoices.set(voice.voice_id, voice);
    });

    const newFilteredVoices = Array.from(uniqueVoices.values()).filter(
      (voice: Voices) =>
        (selectedGender === 'all' || voice.gender.toLowerCase() === selectedGender) &&
        (selectedLanguage === 'all' ||
          voice.language?.toLowerCase() === selectedLanguage?.toLowerCase())
    );

    setFilteredVoices(newFilteredVoices);

    // 필터링된 결과가 적으면 추가 데이터 로드
    if (selectedLanguage !== 'all' && newFilteredVoices.length < 5 && !loading) {
      getVoices(selectedGender, selectedLanguage);
    }
  }, [result?.info?.voices, selectedGender, selectedLanguage, result?.info?.selectedAvatar]);

  // 무한 스크롤 설정
  useEffect(() => {
    // 마지막 요소 참조 설정
    if (filteredVoices.length > 0) {
      lastVoiceRef.current = document.getElementById(
        filteredVoices[filteredVoices.length - 1].voice_id
      ) as HTMLDivElement;
    }

    if (loading) return;

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
  }, [loading, selectedGender, selectedLanguage, filteredVoices]);

  // 목소리 선택 핸들러
  const changeSelectedVoice = (voice: Voices) => {
    // 선택된 아바타가 없으면 변경하지 않음
    if (!result || !result.info.voices || !result?.info?.selectedAvatar?.avatar) return;

    dispatch(
      updatePageResult({
        tab: NOVA_TAB_TYPE.aiVideo,
        result: {
          info: {
            selectedAvatar: {
              ...result.info.selectedAvatar,
              voice: voice
            }
          }
        }
      })
    );
  };

  // 음성 재생 핸들러
  const playVoice = (voice: Voices) => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.src = voice.preview_audio;
      audioElement.play().then(() => setPlayingVoiceId(voice.voice_id));
      audioElement.onended = () => setPlayingVoiceId(null);
    }
  };

  // 성별 필터 변경 핸들러
  const handleGenderChange = (gender: string) => {
    const selected = genderMenu.find((item) => item.key === gender);
    if (selected) {
      setSelectedGender(selected.value);

      // 언어가 선택된 상태라면 해당 성별+언어 조합으로 새 데이터 로드
      if (selectedLanguage !== 'all') {
        getVoices(selected.value, selectedLanguage);
      }
    }
  };

  // 언어 필터 변경 핸들러
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);

    // 언어가 선택된 경우 데이터 로드
    if (language !== 'all') {
      getVoices(selectedGender, language);
    }
  };

  const handleNextClick = () => {
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'script' }));
  };

  const handlePrevClick = () => {
    dispatch(setPageStatus({ tab: NOVA_TAB_TYPE.aiVideo, status: 'avatar' }));
  };

  const renderPlayIcon = (voiceId: string) => {
    return playingVoiceId === voiceId ? (
      isLightMode ? (
        <PlayLightIcon />
      ) : (
        <PlayDarkIcon />
      )
    ) : isLightMode ? (
      <SoundLightIcon />
    ) : (
      <SoundDarkIcon />
    );
  };

  return (
    <>
      <S.Container>
        <AvatarCard isHideColorPicker={true} />
        <S.VoiceContainer>
          <S.VoiceListContainer>
            <S.FilterRow>
              {/* 성별 필터 */}
              <SelectBox
                menuItem={genderMenu}
                selectedItem={selectedGender}
                setSelectedItem={handleGenderChange}
                placeHolder={t('Nova.aiVideo.selectVoice.selectBox.gender') || ''}
                isMenuAbove={false}
                minWidth={128}
                maxHeight={120}
                paddingX={12}
                paddingY={16}
                gap={6}
                isSelectedHighlighted={false}
                isDriver={true}
                selectBoxCssExt={css`
                  min-width: auto;
                  max-width: 60px;
                  padding: 0 !important;
                  justify-content: flex-start;
                  border: none;
                  border-radius: 99px;
                  background-color: ${isLightMode ? 'var(--gray-gray-10)' : 'var(--gray-gray-90)'};

                  div {
                    font-size: 16px !important;
                  }
                `}
                innerBoxCssExt={css`
                  min-height: 24px;
                `}
              />

              {/* 언어 필터 */}
              {result?.info.languages && (
                <SelectBox
                  menuItem={[
                    { key: 'all', title: t('Nova.aiVideo.selectVoice.selectBox.language') },
                    ...(result?.info.languages ?? []).map((lang: { id: string; name: string }) => ({
                      key: lang.id,
                      title: lang.name
                    }))
                  ]}
                  selectedItem={selectedLanguage}
                  setSelectedItem={handleLanguageChange}
                  placeHolder={t('Nova.aiVideo.selectVoice.selectBox.language') || ''}
                  isMenuAbove={false}
                  minWidth={128}
                  maxHeight={228}
                  paddingX={12}
                  paddingY={16}
                  isSelectedHighlighted={false}
                  isDriver={true}
                  selectBoxCssExt={css`
                    min-width: auto;
                    padding: 0 !important;
                    justify-content: flex-start;
                    border: none;
                    border-radius: 99px;
                    background-color: ${isLightMode
                      ? 'var(--gray-gray-10)'
                      : 'var(--gray-gray-90)'};

                    div {
                      font-size: 16px !important;
                    }
                  `}
                  innerBoxCssExt={css`
                    min-height: 30px;
                  `}
                />
              )}

              <ArrowTooltips
                message={t('Nova.aiVideo.tooltip.selectVoice')}
                placement="top-start"
                cssExt={css`
                  margin-bottom: 4px;
                  right: -3px;
                `}>
                <img
                  src={isLightMode ? InfoLightIcon : InfoDarkIcon}
                  alt="info"
                  className="info-icon"
                />
              </ArrowTooltips>
            </S.FilterRow>

            {/* 음성 목록 */}
            <S.VoiceListWrap>
              {filteredVoices.length > 0 ? (
                filteredVoices.map((voice: Voices, index: number) => {
                  const isSelected = result?.info.selectedAvatar?.voice.voice_id === voice.voice_id;
                  return (
                    <S.VoiceItem
                      key={voice.voice_id}
                      id={voice.voice_id}
                      isSelected={isSelected}
                      onClick={() => changeSelectedVoice(voice)}
                      ref={index === filteredVoices.length - 1 ? lastVoiceRef : null}>
                      <S.VoiceInfoWrap>
                        <Radio
                          checked={isSelected}
                          onChange={() => changeSelectedVoice(voice)}
                          size={16}
                        />
                        <S.VoiceInfo isSelected={isSelected}>
                          <span className="name">{voice.name}</span>
                          <S.IdentifyWrap isSelected={isSelected}>
                            <img src={voice.flag} alt="flag" />
                            <span>{`${voice.language} | ${voice.gender}`}</span>
                          </S.IdentifyWrap>
                        </S.VoiceInfo>
                      </S.VoiceInfoWrap>
                      <IconWrapper
                        onClick={(e) => {
                          e.stopPropagation();
                          playVoice(voice);
                        }}>
                        {renderPlayIcon(voice.voice_id)}
                      </IconWrapper>
                    </S.VoiceItem>
                  );
                })
              ) : (
                <S.NoVoicesMessage>
                  {loading ? '' : '해당하는 목소리가 없습니다.'}
                </S.NoVoicesMessage>
              )}
              {loading && (
                <S.SkeletonWrap>
                  <VoiceSkeleton count={10} />
                </S.SkeletonWrap>
              )}
            </S.VoiceListWrap>
          </S.VoiceListContainer>
        </S.VoiceContainer>

        <S.Footer>
          <S.ButtonGroup>
            <Button
              variant="white"
              width={'full'}
              height={48}
              disable={loading}
              cssExt={css`
                display: flex;
                gap: 4px;
                font-size: 16px;
                font-weight: 500;
                border-radius: 8px;
                border: 1px solid var(--gray-gray-30);
              `}
              onClick={handlePrevClick}>
              <span>{t('Nova.aiVideo.button.prev')}</span>
            </Button>
            <Button
              variant="purple"
              width={'full'}
              height={48}
              disable={loading}
              cssExt={css`
                display: flex;
                gap: 4px;
                font-size: 16px;
                font-weight: 500;
                border-radius: 8px;
              `}
              onClick={handleNextClick}>
              <span>{t('Nova.aiVideo.button.next')}</span>
            </Button>
          </S.ButtonGroup>
          <HeygenLogo />
        </S.Footer>
      </S.Container>
      <audio ref={audioRef} muted={false} />
    </>
  );
}
