import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ko from './translation.ko.json';
import en from './translation.en.json';

const resources = {
  ko: {
    translation: ko
  },
  en: {
    translation: en
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    detection: { order: ['navigator'] },
    fallbackLng: 'en'
  });

export default i18n;
