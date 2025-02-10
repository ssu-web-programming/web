import { getLangFromLangCode } from 'util/translation';

import { useTranslationContext } from '../../provider/translation-provider';
import TranslationResultAction from '../translation-result-action';

import * as S from './style';

export default function TranslationTextResult() {
  const {
    sharedTranslationInfo: {
      detectedSourceLanguage,
      translateInputValue,
      translatedText,
      sourceLang,
      targetLang
    }
  } = useTranslationContext();

  console.log('detectedSourceLanguage', detectedSourceLanguage);
  console.log('sourceLang', sourceLang);

  return (
    <>
      <S.Title>번역 완료</S.Title>
      <TranslationResultAction
        translatedLang={getLangFromLangCode('source', detectedSourceLanguage)}
        translatedValue={translateInputValue}
      />

      <S.Wrapper>
        <TranslationResultAction
          translatedLang={getLangFromLangCode('target', targetLang)}
          isInsertDocAction
          translatedValue={translatedText}
        />
      </S.Wrapper>
    </>
  );
}
