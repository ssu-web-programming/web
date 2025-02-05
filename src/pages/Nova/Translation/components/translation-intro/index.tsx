import { useState } from 'react';
import translationHttp from 'api/translation';
import { ReactComponent as CloseLightIcon } from 'img/light/ico_nova_close.svg';
import { ReactComponent as ArrowIcon } from 'img/light/nova/translation/arrow_down.svg';
import { ReactComponent as DeepL } from 'img/light/nova/translation/deepl_logo.svg';
import { ReactComponent as Switch } from 'img/light/nova/translation/switch.svg';
import { useTranslation } from 'react-i18next';
import { selectPageData } from 'store/slices/nova/pageStatusSlice';
import { NOVA_TAB_TYPE } from 'store/slices/tabSlice';
import { getDriveFiles, getLocalFiles } from 'store/slices/uploadFiles';
import { useAppSelector } from 'store/store';
import { css } from 'styled-components';
import { downloadFiles } from 'util/files';

import { TranslateResult, useTranslationContext } from '../../provider/translation-provider';
import DragAndDrop from '../drag-and-drop';
import Toggle, { ToggleOption } from '../toggle';
import TranslationFileUploader from '../translation-file-uploader';

import * as S from './style';

type TranslateType = 'TEXT' | 'FILE';

export default function TranslationIntro() {
  const { t } = useTranslation();
  const localFiles = useAppSelector(getLocalFiles);
  const driveFiles = useAppSelector(getDriveFiles);
  const currentFile = useAppSelector(selectPageData('translation'));

  const [type, setType] = useState<TranslateType>('TEXT');
  const [translateInputValue, setTranslateInputValue] = useState('');
  const { setSharedTranslationInfo, triggerLoading } = useTranslationContext();

  const options: ToggleOption<TranslateType>[] = [
    {
      id: 'TEXT',
      label: '텍스트 번역',
      icon: <S.StyledTransTxt $isActive={type === 'TEXT'} />
    },
    { id: 'FILE', label: '파일 번역', icon: <S.StyledTransFile $isActive={type === 'FILE'} /> }
  ];

  const handleMoveToTextResult = ({ detectedSourceLanguage, translatedText }: TranslateResult) => {
    setSharedTranslationInfo((prevSharedTranslationInfo) => ({
      ...prevSharedTranslationInfo,
      componentType: 'TEXT_RESULT',
      detectedSourceLanguage,
      translatedText,
      translateInputValue
    }));
  };

  const handleMoveToFileResult = () => {
    setSharedTranslationInfo((prevSharedTranslationInfo) => ({
      ...prevSharedTranslationInfo,
      componentType: 'FILE_RESULT'
    }));
  };

  const convertFileObject = async () => {
    // driveFiles의 경우에는 id를 파일객체로 변환해야함
    if (driveFiles.length) {
      const results = await downloadFiles(driveFiles);
      return results[0].file;
    }

    if (currentFile) {
      return currentFile;
    }

    return localFiles[0];
  };

  const submitTextTranslate = async () => {
    triggerLoading();

    const response = await translationHttp.postTranslateText({
      text: translateInputValue,
      sourceLang: 'KO',
      targetLang: 'EL'
    });

    const {
      result: { detectedSourceLanguage, translatedText }
    } = response;

    handleMoveToTextResult({ detectedSourceLanguage, translatedText });
  };

  const submitFileTranslate = async () => {
    triggerLoading();

    const response = await translationHttp.postTranslateDocument({
      file: await convertFileObject(),
      sourceLang: 'KO',
      targetLang: 'EL'
    });

    handleMoveToFileResult();
    console.log('submitFileTranslate-response', response);
  };

  const handleTranslate = () => {
    if (type === 'TEXT') {
      submitTextTranslate();
      return;
    }
    // File 번역일때 타는 로직!
    submitFileTranslate();
  };

  // console.log('translateInputValue', translateInputValue);

  return (
    <>
      <S.ToggleWrapper>
        <Toggle<TranslateType>
          options={options}
          type={type}
          onToggle={setType}
          buttonStyle={css`
            width: 136px;
            justify-content: center;
          `}
        />
      </S.ToggleWrapper>

      <S.TextAreaWrapper>
        <S.TextAreaHeader>
          <div>
            <span>한국어</span>
            <ArrowIcon />
          </div>
          <div>
            <Switch />
          </div>
          <div>
            <span>나우아틀어</span>
            <ArrowIcon />
          </div>
        </S.TextAreaHeader>
        {type === 'TEXT' ? (
          <S.TextInputWrapper>
            <S.TextArea
              placeholder="번역할 내용을 입력하세요."
              value={translateInputValue}
              onChange={(e) => setTranslateInputValue(e.target.value)}
            />
            <S.CloseIconWrapper onClick={() => setTranslateInputValue('')}>
              <CloseLightIcon width={24} height={24} />
            </S.CloseIconWrapper>
          </S.TextInputWrapper>
        ) : (
          <S.FileUploaderWrapper>
            <DragAndDrop onDrop={() => console.log('여기!')}>
              <TranslationFileUploader
                guideMsg={t('Nova.Translate.UploadGuide')}
                creditCount={20}
                curTab={NOVA_TAB_TYPE.convert2DTo3D}
                handleUploadComplete={() => console.log('123')}
              />
            </DragAndDrop>
          </S.FileUploaderWrapper>
        )}

        <S.TextAreaBottom>
          <DeepL />
          {type === 'TEXT' && <span>{translateInputValue.length}자/10,000자</span>}
        </S.TextAreaBottom>
      </S.TextAreaWrapper>

      <S.TranslationButton
        isActive={
          translateInputValue.length > 0 ||
          localFiles.length > 0 ||
          driveFiles.length > 0 ||
          !!currentFile
        }
        onClick={handleTranslate}>
        <span>번역하기</span>
      </S.TranslationButton>
    </>
  );
}
