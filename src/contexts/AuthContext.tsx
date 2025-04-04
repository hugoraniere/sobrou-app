
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type UserProfile = {
  id: string;
  fullName: string;
  email: string;
};

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

  // Initialize the auth state
  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          // Format user data for our app
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            fullName: currentSession.user.user_metadata.full_name || ''
          });
        } else {
          setUser(null);
        }

        setIsLoading(false);
      }
    );

    // Get the initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setIsAuthenticated(!!initialSession);
        
        if (initialSession?.user) {
          // Format user data for our app
          setUser({
            id: initialSession.user.id,
            email: initialSession.user.email || '',
            fullName: initialSession.user.user_metadata.full_name || ''
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle protected routes
  useEffect(() => {
    if (isLoading) return;

    const handleRouteProtection = () => {
      const publicRoutes = ['/auth'];
      const isPublicRoute = publicRoutes.includes(location.pathname);

      // Redirect authenticated users away from auth pages
      if (isAuthenticated && isPublicRoute) {
        navigate('/');
      }
      
      // Redirect unauthenticated users to the auth page
      if (!isAuthenticated && !isPublicRoute) {
        navigate('/auth');
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
        // Check for unverified email error
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email before logging in.');
        }
        throw new Error(error.message);
      }

      // After successful login
      navigate('/');
      return;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: `${window.location.origin}/auth?verification=success`
        }
      });

      if (error) throw new Error(error.message);

      // Return early if email confirmation is required
      if (data.user?.identities?.length === 0) {
        throw new Error('This email is already registered.');
      }

      // Check if email confirmation is needed
      if (data.user && !data.user.confirmed_at) {
        toast.success('Registration successful! Please check your email to verify your account.');
        return;
      }

      // If no email confirmation needed, user is logged in automatically
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
      
      // Auth state listener will handle clearing user state
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
