import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import ruTranslation from './locales/ru.json';

const initializeI18n = async () => {
  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslation },
        ru: { translation: ruTranslation }
      },
      fallbackLng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage']
      },
      react: {
        useSuspense: false
      }
    });
};

initializeI18n().catch(console.error);

export default i18n; 