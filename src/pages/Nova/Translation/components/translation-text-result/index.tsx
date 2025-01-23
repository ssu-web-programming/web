import { useTranslationContext } from '../../provider/translation-provider';
import TranslationResultAction from '../translation-result-action';

import * as S from './style';

export default function TranslationTextResult() {
  const {
    sharedTranslationInfo: { detectedSourceLanguage, translateInputValue, translatedText }
  } = useTranslationContext();

  return (
    <>
      <S.Title>번역 완료</S.Title>
      <TranslationResultAction translatedLang="한국어" translatedValue={translateInputValue} />

      <S.Wrapper>
        <TranslationResultAction
          translatedLang="영어"
          isInsertDocAction
          translatedValue={translatedText}
        />
      </S.Wrapper>
    </>
  );
}
