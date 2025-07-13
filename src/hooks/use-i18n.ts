
import { useTranslation } from 'react-i18next';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  return {
    locale: i18n.language,
    t,
    changeLanguage: i18n.changeLanguage
  };
};
