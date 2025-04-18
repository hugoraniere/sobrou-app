
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
}

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            fullName: currentSession.user.user_metadata.full_name || '',
            user_metadata: currentSession.user.user_metadata
          });
        } else {
          setUser(null);
        }

        setIsLoading(false);
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setIsAuthenticated(!!initialSession);
        
        if (initialSession?.user) {
          setUser({
            id: initialSession.user.id,
            email: initialSession.user.email || '',
            fullName: initialSession.user.user_metadata.full_name || '',
            user_metadata: initialSession.user.user_metadata
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const handleRouteProtection = () => {
      const publicRoutes = ['/auth', '/', '/verify'];
      const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));

      if (isAuthenticated && isPublicRoute && location.pathname !== '/verify') {
        navigate('/dashboard');
      }
    };

    handleRouteProtection();
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email before logging in.');
        }
        throw new Error(error.message);
      }

      navigate('/dashboard');
      return;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    try {
      // Construir URL absolutas completas (com protocolo) para redirecionamentos
      // Isso corrige o problema de concatenação incorreta pelo Supabase
      const siteUrl = window.location.origin; // Ex: https://www.sobrouapp.com.br
      const redirectUrl = `${siteUrl}/verify`;
      
      console.log('Signup with redirectUrl:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          // Configurar redirecionamento para a página verify
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw new Error(error.message);

      if (data.user?.identities?.length === 0) {
        throw new Error('This email is already registered.');
      }

      if (data.user && !data.user.confirmed_at) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return;
      }

      navigate('/');
      return;
    } catch (error: any) {
      console.error('Signup failed:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      
      navigate('/auth');
    } catch (error: any) {
      console.error('Logout failed:', error);
      throw new Error('Logout failed. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      isAuthenticated, 
      isLoading,
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
