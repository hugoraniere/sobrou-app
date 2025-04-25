
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptBRTranslation from './locales/pt-BR.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        translation: ptBRTranslation
      }
    },
    lng: 'pt-BR', // Set default language
    fallbackLng: 'pt-BR',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
