import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ko from './translation.ko.json';
import en from './translation.en.json';

export const LANG_KO_KR = 'ko';
export const LANG_EN_US = 'en';

export const getLangCodeFromParams = () => {
  try {
    const params = new URL(window.location.href).searchParams;
    const lang = params.get('lang');
    return lang;
  } catch (err) {}
};

export const getLangCodeFromUA = () => {
  try {
    const parse = /Polaris\/\d.?\d \(.*,\s?(.*-.*)\)/g.exec(navigator.userAgent);
    if (!parse) return undefined;
    return parse[1];
  } catch (err) {}
};

export const convertLangFromLangCode = (code: string | undefined) => {
  try {
    const lower = code?.toLowerCase();
    if (lower?.startsWith('ko')) {
      return LANG_KO_KR;
    } else {
      return LANG_EN_US;
    }
  } catch (err) {}
};

const paramLang = getLangCodeFromParams() || getLangCodeFromUA();
const lang = convertLangFromLangCode(paramLang);

const resources = {
  ko: {
    translation: ko
  },
  en: {
    translation: en
  }
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  lng: lang,
  fallbackLng: 'ko'
});

export default i18n;
