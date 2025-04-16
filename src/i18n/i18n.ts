
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en.json';
import ptBRTranslation from './locales/pt-BR.json';

// Configure i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      'pt-BR': {
        translation: ptBRTranslation
      }
    },
    fallbackLng: 'pt-BR',
    debug: process.env.NODE_ENV === 'development',
    
    // Save the detected language to localStorage
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  });

export default i18n;
