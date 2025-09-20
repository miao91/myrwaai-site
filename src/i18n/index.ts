import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import commonEN from './locales/en/common.json';
import homeEN from './locales/en/home.json';
import featuresEN from './locales/en/features.json';

import commonCN from './locales/cn/common.json';
import homeCN from './locales/cn/home.json';
import featuresCN from './locales/cn/features.json';

const resources = {
  en: {
    common: commonEN,
    home: homeEN,
    features: featuresEN,
  },
  cn: {
    common: commonCN,
    home: homeCN,
    features: featuresCN,
  },
};

const detectionOptions = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  lookupLocalStorage: 'i18nextLng',
  caches: ['localStorage'],
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    detection: detectionOptions,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;