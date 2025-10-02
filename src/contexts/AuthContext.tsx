
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { AdminAnalyticsService } from '../services/adminAnalyticsService';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
}

export type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        // Para debug: identificar eventos de autenticação
        console.log('Auth event:', event);
        
        // Synchronous state updates only
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            fullName: currentSession.user.user_metadata.full_name || '',
            user_metadata: currentSession.user.user_metadata
          });

          // Track user activity for analytics (deferred)
          if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
            setTimeout(() => {
              AdminAnalyticsService.trackAppEvent('user_activity', { 
                timestamp: new Date().toISOString(),
                event: event 
              });
            }, 0);
          }
        } else {
          setUser(null);
        }

        // Identificar se estamos em um fluxo de recuperação de senha
        if (event === 'PASSWORD_RECOVERY') {
          setTimeout(() => navigate('/reset-password'), 0);
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

  // Track page navigation for authenticated users
  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      // Track page view for analytics
      AdminAnalyticsService.trackAppEvent('page_view', { 
        timestamp: new Date().toISOString(),
        path: location.pathname
      });
    }
  }, [location.pathname, isAuthenticated, isLoading, user]);

  // Completamente reescrita para evitar redirecionamentos em loops
  useEffect(() => {
    // Só executamos esta lógica depois que a verificação de autenticação inicial estiver concluída
    if (isLoading) return;

    const searchParams = new URLSearchParams(location.search);
    const redirectTo = searchParams.get('redirect');
    const successGoogle = searchParams.get('success');

    // Lista de rotas que são exclusivamente públicas (não fazem sentido para usuários autenticados)
    const strictlyPublicRoutes = ['/auth'];
    
    // Rotas que são acessíveis tanto para usuários autenticados quanto não autenticados
    const publicAccessibleRoutes = ['/reset-password', '/erro', '/blog', '/suporte'];
    
    // Verificamos se o usuário está na página de autenticação e já está autenticado
    const isOnStrictlyPublicRoute = strictlyPublicRoutes.includes(location.pathname);
    const isOnPasswordResetRoute = publicAccessibleRoutes.includes(location.pathname);
    const isOnRootRoute = location.pathname === '/';
    
    console.log('[AuthContext] Routing logic:', {
      isAuthenticated,
      pathname: location.pathname,
      redirectTo,
      successGoogle,
      isOnStrictlyPublicRoute
    });

    // Google OAuth success is now handled by /oauth/callback route
    // Remove this logic since we use dedicated callback page

    // Se o usuário está autenticado e tem um redirect, redirecionamos para lá
    if (isAuthenticated && isOnStrictlyPublicRoute && redirectTo) {
      console.log('[AuthContext] Redirecting to:', redirectTo);
      navigate(redirectTo, { replace: true });
      return;
    }

    // REMOVED: Don't force redirect from landing page
    // Users can view the landing page when logged in (shows "Ir para o app" button)
    // The landing page HeaderAuthButtons component handles showing appropriate buttons
    
    // Só redirecionamos para o dashboard se o usuário autenticado estiver tentando acessar
    // uma rota exclusivamente pública (como a página de login) e não uma rota como reset-password
    if (isAuthenticated && isOnStrictlyPublicRoute && !isOnPasswordResetRoute) {
      console.log('[AuthContext] Redirecting from strictly public route to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, location.search, navigate]);

  const login = async (email: string, password: string, redirectTo?: string) => {
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

      // Track login event for analytics
      setTimeout(() => {
        AdminAnalyticsService.trackAppEvent('login', { timestamp: new Date().toISOString() });
      }, 0);

      navigate(redirectTo || '/dashboard');
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

      navigate('/dashboard');
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

  const signInWithGoogle = async () => {
    try {
      console.log('[AuthContext] Google OAuth iniciado');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/oauth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast.error('Erro ao fazer login com Google. Tente novamente.');
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
      requestPasswordReset,
      signInWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During development, provide more helpful debugging
    console.error('useAuth must be used within an AuthProvider. Component tree:', {
      pathname: window.location.pathname,
      timestamp: new Date().toISOString()
    });
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
