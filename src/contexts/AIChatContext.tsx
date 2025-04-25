
import React, { createContext, useContext, useState, useEffect } from 'react';

type AIChatContextType = {
  isEnabled: boolean;
  toggleAIChat: () => void;
};

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export function AIChatProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('aiChatEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('aiChatEnabled', JSON.stringify(isEnabled));
  }, [isEnabled]);

  const toggleAIChat = () => {
    setIsEnabled(prev => !prev);
  };

  return (
    <AIChatContext.Provider value={{ isEnabled, toggleAIChat }}>
      {children}
    </AIChatContext.Provider>
  );
};

export function useAIChat() {
  const context = useContext(AIChatContext);
  if (context === undefined) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
}
