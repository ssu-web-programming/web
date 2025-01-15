import { useState } from 'react';
import NovaHeader from 'components/nova/Header';
import { ReactComponent as DeepL } from 'img/light/nova/translation/deepl_logo.svg';

import BgContainer from './components/bg-container';
import Toggle, { type ToggleOption } from './components/toggle';
import * as S from './style';

export default function Translation() {
  const [activeId, setActiveId] = useState<string>('text');
  const [translateInputValue, setTranslateInputValue] = useState('');

  const options: ToggleOption[] = [
    {
      id: 'text',
      label: '텍스트 번역',
      icon: <S.StyledTransTxt $isActive={activeId === 'text'} />
    },
    { id: 'file', label: '파일 번역', icon: <S.StyledTransFile $isActive={activeId === 'file'} /> }
  ];

  return (
    <S.TranslationWrapper>
      <NovaHeader />
      <BgContainer>
        <S.ToggleWrapper>
          <Toggle options={options} activeId={activeId} onToggle={setActiveId} />
        </S.ToggleWrapper>
        <S.TextAreaWrapper>
          <S.TextAreaHeader>
            <div>한국어</div>
            <div>나우아틀어</div>
          </S.TextAreaHeader>
          <S.TextArea
            value={translateInputValue}
            onChange={(e) => setTranslateInputValue(e.target.value)}
          />
          <S.TextAreaBottom>
            <DeepL />
            <span>{translateInputValue.length}자/40,000자</span>
          </S.TextAreaBottom>
        </S.TextAreaWrapper>

        <S.TranslationButton onClick={() => console.log('123')}>
          <span>번역하기</span>
        </S.TranslationButton>
      </BgContainer>
    </S.TranslationWrapper>
  );
}
