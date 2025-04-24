
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

type AvatarContextType = {
  avatarUrl: string | null;
  updateAvatarUrl: (url: string | null) => void;
};

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url);
    } else {
      setAvatarUrl(null);
    }
  }, [user]);

  const updateAvatarUrl = (url: string | null) => {
    setAvatarUrl(url);
  };

  return (
    <AvatarContext.Provider value={{ avatarUrl, updateAvatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
};

export function useAvatar() {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
}
