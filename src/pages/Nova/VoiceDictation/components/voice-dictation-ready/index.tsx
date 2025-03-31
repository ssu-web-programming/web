import { ChangeEvent, useEffect, useRef, useState } from 'react';
import voiceDictationHttp from 'api/voice-dictation';
import ButtonWithCredit from 'components/buttons/button-with-credit';
import useErrorHandle from 'components/hooks/useErrorHandle';
import Select from 'components/select';
import CheckDarkIcon from 'img/dark/nova/check_purple.svg';
import CheckLightIcon from 'img/light/nova/check_purple.svg';
import { ReactComponent as AudioFile } from 'img/light/nova/voiceDictation/audio_file.svg';
import { ReactComponent as EditIcon } from 'img/light/nova/voiceDictation/edit.svg';
import { useTranslation } from 'react-i18next';
import { setError } from 'store/slices/errorSlice';
import { themeInfoSelector } from 'store/slices/theme';
import { getCurrentFile, getLocalFiles } from 'store/slices/uploadFiles';
import { useAppDispatch, useAppSelector } from 'store/store';
import { css } from 'styled-components';
import { formatCurrentTime } from 'util/getAudioDuration';

import { track } from '@amplitude/analytics-browser';

import { sendNovaStatus } from '../../../../../api/apiWrapper';
import { NOVA_TAB_TYPE } from '../../../../../constants/novaTapTypes';
import { calLeftCredit } from '../../../../../util/common';
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
      currentTime,
      voiceFile
    },
    setSharedVoiceDictationInfo,
    triggerLoading
  } = useVoiceDictationContext();
  const { isLightMode } = useAppSelector(themeInfoSelector);
  const dispatch = useAppDispatch();
  const errorHandle = useErrorHandle();
  const { t } = useTranslation();
  const currentFile = useAppSelector(getCurrentFile);

  const [isEditMode, setIsEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // input에 대한 ref 추가
  const localFiles = useAppSelector(getLocalFiles);
  const langOptions = getLangOptions(t);

  const handleChangeEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleChangeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    const extension = fileName.substring(fileName.lastIndexOf('.'));

    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      fileName: e.target.value + extension
    }));
  };

  const handleMoveToResult = async (result: VoiceDictationResult) => {
    setSharedVoiceDictationInfo((prev) => ({
      ...prev,
      componentType: 'RESULT',
      voiceDictationResult: result,
      currentTime: formatCurrentTime()
    }));
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
      const { result, headers } = await voiceDictationHttp.postSpeechRecognize({
        file: localFiles[0] || voiceFile,
        lang: selectedLangOption
      });

      if (result.data.segments.length === 0) {
        setSharedVoiceDictationInfo((prev) => ({
          ...prev,
          voiceDictationResult: result
        }));

        handleErrorTrigger({
          title: t('Nova.voiceDictation.Status.NoContent'),
          onRetry: translationVoiceDictation
        });
        return;
      }

      const { deductionCredit } = calLeftCredit(headers);
      track('nova_dictation', {
        file_id: currentFile.id,
        document_format: currentFile.ext,
        credit: deductionCredit,
        dictation_type: voiceFile ? 'record' : 'file',
        function_result: true
      });

      await handleMoveToResult(result);
    } catch (error: any) {
      if (error.code === 'Timeout') {
        handleErrorTrigger({
          title: t('Nova.TimeOut.Title'),
          onRetry: translationVoiceDictation
        });
        return;
      } else if (error.code === 'damage') {
        handleErrorTrigger({
          title: t('Nova.voiceDictation.Status.NoContent'),
          onRetry: translationVoiceDictation
        });
      } else {
        errorHandle(error);
      }

      setSharedVoiceDictationInfo((prev) => ({
        ...prev,
        componentType: 'VOICE_READY'
      }));

      track('nova_dictation', {
        file_id: currentFile.id,
        document_format: currentFile.ext,
        dictation_type: voiceFile ? 'record' : 'file',
        function_result: false
      });
    } finally {
      await sendNovaStatus({ name: NOVA_TAB_TYPE.voiceDictation, uuid: '' }, 'finish');
    }
  };

  const getFileNameWithoutExtension = (fileName: string) => {
    return fileName.substring(0, fileName.lastIndexOf('.'));
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
            <S.FileTitle>{getFileNameWithoutExtension(fileName)}</S.FileTitle>
            <S.Duration>{audioDuration}</S.Duration>

            <S.LanguageSelector>
              <S.LanguageLabel>{t('Nova.voiceDictation.Button.Recognition')}</S.LanguageLabel>
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
                  $selectButtonStyle={css`
                    color: #6f3ad0;
                  `}
                  $selectTextStyles={css`
                    font-size: 16px;
                  `}
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
                  value={getFileNameWithoutExtension(fileName)}
                  onChange={handleChangeInputValue}
                />
              ) : (
                <>
                  <S.FileTitle>{getFileNameWithoutExtension(fileName)}</S.FileTitle>
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
          isActive={getFileNameWithoutExtension(fileName).trim().length !== 0}
          creditAmount={50}
        />
      </S.Container>
    </S.Wrapper>
  );
}
