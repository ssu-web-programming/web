import { ChangeEvent, useEffect, useRef, useState } from 'react';
import voiceDictationHttp from 'api/voice-dictation';
import ButtonWithCredit from 'components/buttons/button-with-credit';
import useErrorHandle from 'components/hooks/useErrorHandle';
import Select from 'components/select';
import CheckDarkIcon from 'img/dark/nova/check_purple.svg';
import CheckLightIcon from 'img/light/nova/check_purple.svg';
import { ReactComponent as AudioFile } from 'img/light/nova/voiceDictation/audio_file.svg';
import { ReactComponent as EditIcon } from 'img/light/nova/voiceDictation/edit.svg';
import { overlay } from 'overlay-kit';
import { useTranslation } from 'react-i18next';
import { setError } from 'store/slices/errorSlice';
import { themeInfoSelector } from 'store/slices/theme';
import { getLocalFiles } from 'store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from 'store/store';
import { formatCurrentTime } from 'util/getAudioDuration';

import SurveyModalContent from '../../../../../components/nova/satisfactionSurvey/survey-modal-content';
import OverlayModal from '../../../../../components/overlay-modal';
import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import { selectPageCreditReceived } from '../../../../../store/slices/nova/pageStatusSlice';
import { getCookie } from '../../../../../util/common';
import {
  LangOptionValues,
  useVoiceDictationContext,
  VoiceDictationResult
} from '../../provider/voice-dictation-provider';
import { getLangOptions } from '../recognized-lang';

import * as S from './style';

export default function VoiceDictationReady() {
  const {
    sharedVoiceDictationInfo: {
      componentType,
      audioDuration,
      fileName,
      selectedLangOption,
      currentTime
    },
    setSharedVoiceDictationInfo,
    triggerLoading
  } = useVoiceDictationContext();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const dispatch = useAppDispatch();
  const errorHandle = useErrorHandle();
  const { t } = useTranslation();
  const isCreditRecieved = useAppSelector(selectPageCreditReceived(NOVA_TAB_TYPE.translation));

  const [isEditMode, setIsEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // input에 대한 ref 추가
  const localFiles = useAppSelector(getLocalFiles);
  const langOptions = getLangOptions(t);

  const handleChangeEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleChangeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      fileName: e.target.value
    }));
  };

  const handleMoveToResult = async (result: VoiceDictationResult) => {
    await showSurveyModal();
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      componentType: 'RESULT',
      voiceDictationResult: result,
      currentTime: formatCurrentTime()
    }));
  };

  const showSurveyModal = async () => {
    // 만족도 이벤트
    if (!isCreditRecieved && !getCookie('dontShowSurvey')) {
      overlay.closeAll();

      overlay.open(({ isOpen, close }) => {
        return (
          <OverlayModal isOpen={isOpen} onClose={close} padding={'24px'}>
            <SurveyModalContent />
          </OverlayModal>
        );
      });
    }
  };

  const handleErrorTrigger = ({ title, onRetry }: { title: string; onRetry?: () => void }) => {
    dispatch(
      setError({
        title,
        onRetry // 재시도 시 실행할 함수 전달
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
        setSharedVoiceDictationInfo((prev) => ({
          ...prev,
          voiceDictationResult: result
        }));

        handleErrorTrigger({
          title:
            '변환된 받아쓰기 내용이 없어요.\n 음성 파일에 대화가 포함되어 있는지, 설정한 인식 언어가 음성과 같은 언어인지 확인해주세요.',
          onRetry: translationVoiceDictation
        });
        return;
      }

      await handleMoveToResult(result);
    } catch (error: any) {
      setSharedVoiceDictationInfo((prev) => ({
        ...prev,
        componentType: 'VOICE_READY'
      }));
      if (error.code === 'Timeout') {
        handleErrorTrigger({
          title: '작업 시간이 초과되었습니다. \n 다시 시도해 주세요.',
          onRetry: translationVoiceDictation
        });
      } else if (error.code === '400') {
        handleErrorTrigger({
          title:
            '변환된 받아쓰기 내용이 없어요.\n 음성 파일에 대화가 포함되어 있는지, 설정한 인식 언어가 음성과 같은 언어인지 확인해주세요.',
          onRetry: translationVoiceDictation
        });
      } else {
        errorHandle(error);
      }
    }
  };

  // localFiles가 변경될 때 파일 이름 업데이트
  useEffect(() => {
    if (localFiles.length) {
      setSharedVoiceDictationInfo((prev) => ({
        ...prev,
        fileName: localFiles[0].name
      }));
    }
  }, [localFiles]);

  // isEditMode가 변경될 때 focus 설정
  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <S.Wrapper>
      <S.Container>
        <S.Header>
          <S.Title lang={'ko'}>
            <img src={isLightMode ? CheckLightIcon : CheckDarkIcon} alt="check" />
            <span>{t(`Nova.voiceDictation.Done.Title`)}</span>
          </S.Title>
        </S.Header>

        <S.Description>{t(`Nova.voiceDictation.Done.Description`)}</S.Description>
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
                <S.InputFileTitle
                  ref={inputRef}
                  value={fileName}
                  onChange={handleChangeInputValue}
                />
              ) : (
                <>
                  <S.FileTitle>{fileName}</S.FileTitle>
                  <EditIcon onClick={handleChangeEditMode} />
                </>
              )}
            </S.InputFileWrapper>
            <S.Duration>
              {currentTime} · {audioDuration}
            </S.Duration>
          </S.RecordingBox>
        )}

        <ButtonWithCredit
          onClick={translationVoiceDictation}
          text={t('Nova.voiceDictation.Button.Convert')}
          isActive={fileName.length !== 0}
          creditAmount={50}
        />
      </S.Container>
    </S.Wrapper>
  );
}
