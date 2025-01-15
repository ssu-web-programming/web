import { useState } from 'react';
import NovaHeader from 'components/nova/Header';
import { ReactComponent as DeepL } from 'img/light/nova/translation/deepl_logo.svg';
import { ReactComponent as TransFile } from 'img/light/nova/translation/trans_file.svg';
import { ReactComponent as TransTxt } from 'img/light/nova/translation/trans_txt.svg';
import styled from 'styled-components';

import BgContainer from './components/bg-container';
import Toggle, { type ToggleOption } from './components/toggle';
import * as S from './style';

const StyledTransTxt = styled(TransTxt)<{
  $isActive?: boolean;
}>`
  & path {
    fill: ${({ $isActive }) => ($isActive ? '#6F3AD0' : '')};
  }
`;

const StyledTransFile = styled(TransFile)<{
  $isActive?: boolean;
}>`
  & path {
    fill: ${({ $isActive }) => ($isActive ? '#6F3AD0' : '')};
  }
`;

export default function Translation() {
  const [activeId, setActiveId] = useState<string>('text');
  const [translateInputValue, setTranslateInputValue] = useState('');

  const options: ToggleOption[] = [
    { id: 'text', label: '텍스트 번역', icon: <StyledTransTxt $isActive={activeId === 'text'} /> },
    { id: 'file', label: '파일 번역', icon: <StyledTransFile $isActive={activeId === 'file'} /> }
  ];

  return (
    <>
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
      </BgContainer>
    </>
  );
}
