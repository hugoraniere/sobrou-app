
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
  requestPasswordReset: (email: string) => Promise<void>;
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
      async (event, currentSession) => {
        // Para debug: identificar eventos de autenticação
        console.log('Auth event:', event);
        
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

        // Identificar se estamos em um fluxo de recuperação de senha
        if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password');
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
  }, [navigate]);

  // Completamente reescrita para evitar redirecionamentos em loops
  useEffect(() => {
    // Só executamos esta lógica depois que a verificação de autenticação inicial estiver concluída
    if (isLoading) return;

    // Lista de rotas que são exclusivamente públicas (não fazem sentido para usuários autenticados)
    const strictlyPublicRoutes = ['/auth'];
    
    // Rotas que são acessíveis tanto para usuários autenticados quanto não autenticados
    const publicAccessibleRoutes = ['/reset-password'];
    
    // Verificamos se o usuário está na página de autenticação e já está autenticado
    const isOnStrictlyPublicRoute = strictlyPublicRoutes.includes(location.pathname);
    const isOnPasswordResetRoute = publicAccessibleRoutes.includes(location.pathname);
    
    // Só redirecionamos para o dashboard se o usuário autenticado estiver tentando acessar
    // uma rota exclusivamente pública (como a página de login) e não uma rota como reset-password
    if (isAuthenticated && isOnStrictlyPublicRoute && !isOnPasswordResetRoute) {
      navigate('/dashboard', { replace: true });
    }
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
      // Criar URL de redirecionamento completa e absoluta
      // Usar window.location.origin para obter o domínio atual
      const emailRedirectTo = `${window.location.origin}/auth?verification=success`;
      
      console.log('Signup with emailRedirectTo:', emailRedirectTo);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: emailRedirectTo
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

  const requestPasswordReset = async (email: string) => {
    try {
      const resetPasswordRedirectTo = `${window.location.origin}/reset-password`;
      console.log('Redirect: ' , resetPasswordRedirectTo)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetPasswordRedirectTo
      });
      
      if (error) throw error;
      
      toast.success('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.');
    } catch (error: any) {
      console.error('Password reset request failed:', error);
      // Não mostramos erro específico para evitar vazamento de informação
      toast.success('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.');
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
      logout,
      requestPasswordReset
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
