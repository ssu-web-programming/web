import { useTranslation } from 'react-i18next'; // 추가
import { getLangFromLangCode } from 'util/translation';

import { useTranslationContext } from '../../provider/translation-provider';
import TranslationResultAction from '../translation-result-action';

import * as S from './style';

export default function TranslationTextResult() {
  const { t } = useTranslation(); // 추가
  const {
    sharedTranslationInfo: { translateInputValue, translatedText, targetLang, sourceLang }
  } = useTranslationContext();

  return (
    <>
      <S.Title>{t('Nova.translation.Button.TranslationComplete')}</S.Title>
      <TranslationResultAction
        translatedLang={getLangFromLangCode('source', sourceLang)}
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
