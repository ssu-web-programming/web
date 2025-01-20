import { useState } from 'react';
import NovaHeader from 'components/nova/Header';
import { ReactComponent as ArrowIcon } from 'img/light/nova/translation/arrow_down.svg';
import { ReactComponent as DeepL } from 'img/light/nova/translation/deepl_logo.svg';
import { ReactComponent as Switch } from 'img/light/nova/translation/switch.svg';
import { useTranslation } from 'react-i18next';
import { NOVA_TAB_TYPE } from 'store/slices/tabSlice';
import { css } from 'styled-components';

import BgContainer from './components/bg-container';
import DragAndDrop from './components/drag-and-drop';
import Toggle, { type ToggleOption } from './components/toggle';
import TranslationFileUploader from './components/translation-file-uploader';
import * as S from './style';

export default function Translation() {
  const { t } = useTranslation();
  const [type, setType] = useState<string>('text');
  const [translateInputValue, setTranslateInputValue] = useState('');

  const options: ToggleOption[] = [
    {
      id: 'text',
      label: '텍스트 번역',
      icon: <S.StyledTransTxt $isActive={type === 'text'} />
    },
    { id: 'file', label: '파일 번역', icon: <S.StyledTransFile $isActive={type === 'file'} /> }
  ];

  return (
    <S.TranslationWrapper>
      <NovaHeader />
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
            <S.TextArea
              placeholder="번역할 내용을 입력하세요."
              value={translateInputValue}
              onChange={(e) => setTranslateInputValue(e.target.value)}
            />
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

        <S.TranslationButton
          isActive={translateInputValue.length > 0}
          onClick={() => console.log('123')}>
          <span>번역하기</span>
        </S.TranslationButton>
      </BgContainer>
    </S.TranslationWrapper>
  );
}
