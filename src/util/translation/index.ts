import {
  SOURCE_LANGUAGES_WITH_LANG_CODE,
  TARGET_LANGUAGES_WITH_LANG_CODE
} from 'constants/translation-text';
import { LangType } from 'pages/Nova/Translation/provider/translation-provider';

export const getLangFromLangCode = (type: LangType, langCode: string) => {
  const langTypeWithCode =
    type === 'source' ? SOURCE_LANGUAGES_WITH_LANG_CODE : TARGET_LANGUAGES_WITH_LANG_CODE;

  return langTypeWithCode.find((item) => item.langCode === langCode)?.lang;
};
