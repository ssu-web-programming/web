import { ChangeEvent, useEffect, useState } from 'react';
import voiceDictationHttp from 'api/voice-dictation';
import Select from 'components/select';
import CheckDarkIcon from 'img/dark/nova/check_purple.svg';
import CreditColorIcon from 'img/light/ico_credit_color_outline.svg';
import CheckLightIcon from 'img/light/nova/check_purple.svg';
import { ReactComponent as AudioFile } from 'img/light/nova/voiceDictation/audio_file.svg';
import { ReactComponent as EditIcon } from 'img/light/nova/voiceDictation/edit.svg';
import { useTranslation } from 'react-i18next';
import { setError } from 'store/slices/errorSlice';
import { themeInfoSelector } from 'store/slices/theme';
import { getLocalFiles } from 'store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from 'store/store';

import {
  LangOptionValues,
  useVoiceDictationContext,
  VoiceDictationResult
} from '../../provider/voice-dictation-provider';
import { langOptions } from '../recognized-lang';

import * as S from './style';

export default function VoiceDictationReady() {
  const {
    sharedVoiceDictationInfo: { componentType, audioDuration, fileName, selectedLangOption },
    setSharedVoiceDictationInfo,
    triggerLoading
  } = useVoiceDictationContext();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [isEditMode, setIsEditMode] = useState(false);
  const localFiles = useAppSelector(getLocalFiles);

  const handleChangeEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleChangeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      fileName: e.target.value
    }));
  };

  const handleMoveToResult = (result: VoiceDictationResult) => {
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      componentType: 'RESULT',
      voiceDictationResult: result
    }));
  };

  const handleErrorTrigger = () => {
    dispatch(
      setError({
        title:
          '변환된 받아쓰기 내용이 없어요.\n 음성 파일에 대화가 포함되어 있는지, 설정한 인식 언어가 음성과 같은 언어인지 확인해주세요.',
        onRetry: translationVoiceDictation // 재시도 시 실행할 함수 전달
      })
    );
  };

  const translationVoiceDictation = async () => {
    triggerLoading();

    try {
      const result = await voiceDictationHttp.postSpeechRecognize({
        file: localFiles[0],
        lang: selectedLangOption
      });

      if (result.data.segments.length === 0) {
        handleErrorTrigger();
        return;
      }

      handleMoveToResult(result);
    } catch (error) {
      handleErrorTrigger();
    }
  };
  useEffect(() => {
    if (localFiles.length) {
      setSharedVoiceDictationInfo((prev) => ({
        ...prev,
        fileName: localFiles[0].name
      }));
    }
  }, [localFiles]);

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
          녹음 파일을 번환할 준비가 완료되었어요.
          <br />
          변환하기 버튼을 눌러 텍스트로 변환해보세요.
        </S.Description>
        {componentType === 'FILE_READY' ? (
          <S.RecordingBox>
            <AudioFile />
            <S.FileTitle>{fileName}</S.FileTitle>
            <S.Duration>{audioDuration}</S.Duration>

            <S.LanguageSelector>
              <S.LanguageLabel>인식 언어</S.LanguageLabel>
              <S.LanguageValue>
                <Select<LangOptionValues>
                  options={langOptions}
                  value={selectedLangOption}
                  onChange={(result) => {
                    setSharedVoiceDictationInfo((prev) => ({
                      ...prev,
                      selectedLangOption: result
                    }));
                  }}
                  direction="up"
                />
              </S.LanguageValue>
            </S.LanguageSelector>
          </S.RecordingBox>
        ) : (
          <S.RecordingBox>
            <AudioFile />
            <S.InputFileWrapper>
              {isEditMode ? (
                <S.InputFileTitle value={fileName} onChange={handleChangeInputValue} />
              ) : (
                <>
                  <S.FileTitle>{fileName}</S.FileTitle>
                  <EditIcon onClick={handleChangeEditMode} />
                </>
              )}
            </S.InputFileWrapper>
            <S.Duration>오늘 오후 10:57 · {audioDuration}</S.Duration>
          </S.RecordingBox>
        )}

        <S.ButtonWrap onClick={translationVoiceDictation}>
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
