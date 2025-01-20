import { useState } from 'react';
import { ReactComponent as CloseLightIcon } from 'img/light/ico_nova_close.svg';
import { ReactComponent as ArrowIcon } from 'img/light/nova/translation/arrow_down.svg';
import { ReactComponent as DeepL } from 'img/light/nova/translation/deepl_logo.svg';
import { ReactComponent as Switch } from 'img/light/nova/translation/switch.svg';
import { useTranslation } from 'react-i18next';
import { NOVA_TAB_TYPE } from 'store/slices/tabSlice';
import { css } from 'styled-components';

import { useTranslationContext } from '../../provider/translation-provider';
import BgContainer from '../bg-container';
import DragAndDrop from '../drag-and-drop';
import Toggle, { ToggleOption } from '../toggle';
import TranslationFileUploader from '../translation-file-uploader';

import * as S from './style';

export default function TranslationIntro() {
  const { t } = useTranslation();

  const [type, setType] = useState<string>('text');
  const [translateInputValue, setTranslateInputValue] = useState('');
  const { setSharedTranslationInfo } = useTranslationContext();

  const options: ToggleOption[] = [
    {
      id: 'text',
      label: '텍스트 번역',
      icon: <S.StyledTransTxt $isActive={type === 'text'} />
    },
    { id: 'file', label: '파일 번역', icon: <S.StyledTransFile $isActive={type === 'file'} /> }
  ];

  const handleTranslate = () => {
    setSharedTranslationInfo((prevSharedTranslationInfo) => ({
      ...prevSharedTranslationInfo,
      componentType: 'TEXT_RESULT'
    }));
  };

  return (
    <BgContainer>
      <S.ToggleWrapper>
        <Toggle
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
        {type === 'text' ? (
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
          {type === 'text' && <span>{translateInputValue.length}자/40,000자</span>}
        </S.TextAreaBottom>
      </S.TextAreaWrapper>

      <S.TranslationButton isActive={translateInputValue.length > 0} onClick={handleTranslate}>
        <span>번역하기</span>
      </S.TranslationButton>
    </BgContainer>
  );
}
