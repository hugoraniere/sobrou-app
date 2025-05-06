
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type WhatsAppButtonContextType = {
  isWhatsAppButtonEnabled: boolean;
  toggleWhatsAppButton: () => void;
};

const WhatsAppButtonContext = createContext<WhatsAppButtonContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'whatsapp-button-enabled';

export const WhatsAppButtonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isWhatsAppButtonEnabled, setIsWhatsAppButtonEnabled] = useState<boolean>(true);

  useEffect(() => {
    const savedPreference = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPreference !== null) {
      setIsWhatsAppButtonEnabled(savedPreference === 'true');
    }
  }, []);

  const toggleWhatsAppButton = () => {
    const newState = !isWhatsAppButtonEnabled;
    setIsWhatsAppButtonEnabled(newState);
    localStorage.setItem(LOCAL_STORAGE_KEY, String(newState));
  };

  return (
    <WhatsAppButtonContext.Provider value={{ isWhatsAppButtonEnabled, toggleWhatsAppButton }}>
      {children}
    </WhatsAppButtonContext.Provider>
  );
};

export const useWhatsAppButton = (): WhatsAppButtonContextType => {
  const context = useContext(WhatsAppButtonContext);
  
  if (context === undefined) {
    throw new Error('useWhatsAppButton must be used within a WhatsAppButtonProvider');
  }
  
  return context;
};
