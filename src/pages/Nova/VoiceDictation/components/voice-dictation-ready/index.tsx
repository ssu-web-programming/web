import { ChangeEvent, useState } from 'react';
import CheckDarkIcon from 'img/dark/nova/check_purple.svg';
import CreditColorIcon from 'img/light/ico_credit_color_outline.svg';
import CheckLightIcon from 'img/light/nova/check_purple.svg';
import { ReactComponent as AudioFile } from 'img/light/nova/voiceDictation/audio_file.svg';
import { ReactComponent as EditIcon } from 'img/light/nova/voiceDictation/edit.svg';
import { useTranslation } from 'react-i18next';
import { themeInfoSelector } from 'store/slices/theme';
import { useAppSelector } from 'store/store';

import { useVoiceDictationContext } from '../../provider/voice-dictation-provider';

import * as S from './style';

export default function VoiceDictationReady() {
  const {
    sharedVoiceDictationInfo: { componentType }
  } = useVoiceDictationContext();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('2024-12-25 01:11:22');
  const [isEditMode, setIsEditMode] = useState(false);

  const handleChangeEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleChangeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <S.Wrapper>
      <S.Container>
        <S.Header>
          <S.Title lang={'ko'}>
            <img src={isLightMode ? CheckLightIcon : CheckDarkIcon} alt="check" />
            <span>{t(`Nova.voiceDictation.Done.Title`)}</span>
          </S.Title>
        </S.Header>

        <S.Description>
          높은 파일을 번환할 준비가 완료되었어요.
          <br />
          변환하기 버튼을 눌러 텍스트로 변환해보세요.
        </S.Description>
        {componentType === 'FILE_READY' ? (
          <S.RecordingBox>
            <AudioFile />
            <S.FileTitle>기존 파일 제목</S.FileTitle>
            <S.Duration>1분 30초</S.Duration>

            <S.LanguageSelector>
              <S.LanguageLabel>인식 언어</S.LanguageLabel>
              <S.LanguageValue>
                한국어
                <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginLeft: '4px' }}>
                  <path fill="currentColor" d="M7 10l5 5 5-5z" />
                </svg>
              </S.LanguageValue>
            </S.LanguageSelector>
          </S.RecordingBox>
        ) : (
          <S.RecordingBox>
            <AudioFile />
            <S.InputFileWrapper>
              {isEditMode ? (
                <S.InputFileTitle value={inputValue} onChange={handleChangeInputValue} />
              ) : (
                <>
                  <S.FileTitle>{inputValue}</S.FileTitle>
                  <EditIcon onClick={handleChangeEditMode} />
                </>
              )}
            </S.InputFileWrapper>
            <S.Duration>오늘 오후 10:57 · 1분 30초</S.Duration>
          </S.RecordingBox>
        )}

        <S.ButtonWrap onClick={() => console.log('123')}>
          <span>변환하기</span>
          <div>
            <img src={CreditColorIcon} alt="credit" width={20} height={20} />
            <span>30</span>
          </div>
        </S.ButtonWrap>
      </S.Container>
    </S.Wrapper>
  );
}
