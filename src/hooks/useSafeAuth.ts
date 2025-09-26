import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/contexts/AuthContext';

export const useSafeAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  // Return default values if context is not available
  if (context === undefined) {
    return {
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,
      login: async () => {},
      signup: async () => {},
      requestPasswordReset: async () => {},
      signInWithGoogle: async () => {},
      logout: async () => {}
    };
  }
  
  return context;
};