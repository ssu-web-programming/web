import { useTranslation } from 'react-i18next'; // 추가
import { getLangFromLangCode } from 'util/translation';

import { useTranslationContext } from '../../provider/translation-provider';
import TranslationResultAction from '../translation-result-action';

import * as S from './style';

export default function TranslationTextResult() {
  const { t } = useTranslation(); // 추가
  const {
    sharedTranslationInfo: {
      detectedSourceLanguage,
      translateInputValue,
      translatedText,
      targetLang
    }
  } = useTranslationContext();

  return (
    <>
      <S.Title>{t('Nova.translation.Status.FileTranslated')}</S.Title>
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
