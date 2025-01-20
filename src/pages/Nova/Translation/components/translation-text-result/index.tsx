import { exampleText1, exampleText2 } from 'constants/translation-text';

import BgContainer from '../bg-container';
import TranslationResultAction from '../translation-result-action';

import * as S from './style';

export default function TranslationTextResult() {
  return (
    <BgContainer>
      <S.Title>번역 완료</S.Title>
      <TranslationResultAction translatedLang="한국어" value={exampleText1} />

      <S.Wrapper>
        <TranslationResultAction translatedLang="영어" isInsertDocAction value={exampleText2} />
      </S.Wrapper>
    </BgContainer>
  );
}
