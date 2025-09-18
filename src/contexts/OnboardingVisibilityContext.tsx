import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface OnboardingVisibilityResponse {
  showProductTour: boolean;
  showStepper: boolean;
  tourReason: string;
  stepperReason: string;
  version: string;
  isNewUser: boolean;
}

interface OnboardingVisibilityContextType extends OnboardingVisibilityResponse {
  loading: boolean;
  error: string | null;
  preview: boolean;
  refetch: () => Promise<void>;
}

interface OnboardingVisibilityProviderProps {
  children: React.ReactNode;
  preview?: boolean;
}

const OnboardingVisibilityContext = createContext<OnboardingVisibilityContextType | undefined>(undefined);

export function OnboardingVisibilityProvider({ children, preview = false }: OnboardingVisibilityProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [visibility, setVisibility] = useState<OnboardingVisibilityResponse>({
    showProductTour: false,
    showStepper: false,
    tourReason: 'loading',
    stepperReason: 'loading',
    version: '1.0',
    isNewUser: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if user is admin for preview mode
  const isAdmin = useMemo(async () => {
    if (!user) return false;
    
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
      
    return !!data;
  }, [user]);

  const fetchVisibility = async () => {
    if (authLoading || !user) {
      setLoading(true);
      return;
    }

    try {
      // In preview mode, bypass gating for admins
      if (preview) {
        const isUserAdmin = await isAdmin;
        if (isUserAdmin) {
          setVisibility({
            showProductTour: true,
            showStepper: true,
            tourReason: 'preview',
            stepperReason: 'preview',
            version: '1.0',
            isNewUser: false
          });
          setLoading(false);
          return;
        }
      }

      // Call RPC to get visibility
      const { data, error } = await supabase.rpc('onboarding_visibility', {
        target_user_id: user.id
      });

      if (error) {
        console.error('Error fetching onboarding visibility:', error);
        setError(error.message);
      } else if (data) {
        setVisibility(data as unknown as OnboardingVisibilityResponse);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error in OnboardingVisibilityProvider:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisibility();
  }, [user, authLoading, preview]);

  const contextValue: OnboardingVisibilityContextType = {
    ...visibility,
    loading: loading || authLoading,
    error,
    preview,
    refetch: fetchVisibility
  };

  return (
    <OnboardingVisibilityContext.Provider value={contextValue}>
      {children}
    </OnboardingVisibilityContext.Provider>
  );
}

export function useOnboardingVisibilityContext() {
  const context = useContext(OnboardingVisibilityContext);
  if (context === undefined) {
    throw new Error('useOnboardingVisibilityContext must be used within an OnboardingVisibilityProvider');
  }
  return context;
}