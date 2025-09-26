
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export const useI18n = () => {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Ensure i18n is initialized
    setIsReady(true);
  }, []);

  try {
    const { t, i18n } = useTranslation();
    
    return {
      locale: i18n?.language || 'pt',
      t: isReady ? t : (key: string, fallback?: string) => fallback || key,
      changeLanguage: i18n?.changeLanguage || (() => {}),
      isReady
    };
  } catch (error) {
    console.warn('i18n not ready:', error);
    return {
      locale: 'pt',
      t: (key: string, fallback?: string) => fallback || key,
      changeLanguage: () => {},
      isReady: false
    };
  }
};
