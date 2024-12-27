import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './translation.en.json';
import ja from './translation.ja.json';
import ko from './translation.ko.json';

export const LANG_KO_KR = 'ko';
export const LANG_JA_JP = 'ja';
export const LANG_EN_US = 'en';
export const LANG_KO_KR_CODE = 'ko-KR';
export const LANG_JA_JP_CODE = 'ja-JP';
export const LANG_EN_US_CODE = 'en-US';
export const LANG_FORMAT_KO_KR_CODE = 'ko-KR';
export const LANG_FORMAT_JA_JP_CODE = 'js-JP';
export const LANG_FORMAT_EN_US_CODE = 'en-US';

const getLangCodeFromParams = () => {
  try {
    const params = new URL(window.location.href).searchParams;
    const lang = params.get('lang');
    return lang;
  } catch (err) {
    console.log('err: ', err);
    throw err;
  }
};

const getLangCodeFromUA = () => {
  try {
    const parse = /Polaris\/\d.?\d \(.*,\s?(.*-.*)\)/g.exec(navigator.userAgent);
    if (!parse) return undefined;
    return parse[1];
  } catch (err) {
    console.log('err: ', err);
    throw err;
  }
};

export const convertLangFromLangCode = (code: string | undefined) => {
  try {
    const lower = code?.toLowerCase();
    if (lower?.startsWith('ko')) {
      return LANG_KO_KR;
    } else if (lower?.startsWith('ja')) {
      return LANG_JA_JP;
    } else {
      return LANG_EN_US;
    }
  } catch (err) {
    return LANG_EN_US;
  }
};

const getLang = () => {
  try {
    const paramLang = getLangCodeFromParams() || getLangCodeFromUA();
    return convertLangFromLangCode(paramLang);
  } catch (err) {
    return LANG_EN_US;
  }
};
const getLangCode = () => {
  const code = getLangCodeFromParams() || getLangCodeFromUA() || LANG_EN_US_CODE;
  try {
    const lower = code?.toLowerCase();
    if (lower?.startsWith('ko')) {
      return LANG_KO_KR_CODE;
    } else if (lower?.startsWith('ja')) {
      return LANG_JA_JP_CODE;
    } else {
      return LANG_EN_US_CODE;
    }
  } catch (err) {
    return LANG_EN_US_CODE;
  }
};
const getLangFormatCode = () => {
  const code = getLangCodeFromParams() || getLangCodeFromUA() || LANG_FORMAT_EN_US_CODE;
  try {
    const lower = code?.toLowerCase();
    if (lower?.startsWith('ko')) {
      return LANG_FORMAT_KO_KR_CODE;
    } else if (lower?.startsWith('ja')) {
      return LANG_FORMAT_JA_JP_CODE;
    } else {
      return LANG_FORMAT_EN_US_CODE;
    }
  } catch (err) {
    return LANG_FORMAT_EN_US_CODE;
  }
};
export const lang = getLang();
export const langCode = getLangCode();
export const langFormatCode = getLangFormatCode();

const resources = {
  ko: {
    translation: ko
  },
  en: {
    translation: en
  },
  ja: {
    translation: ja
  }
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  lng: lang,
  fallbackLng: 'en'
});

export default i18n;
