import { useState, useEffect, useMemo } from 'react';
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

interface UseOnboardingVisibilityOptions {
  /** Force preview mode (ignores gating, admin only) */
  preview?: boolean;
}

export function useOnboardingVisibility(options: UseOnboardingVisibilityOptions = {}) {
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

  const { preview = false } = options;

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

  useEffect(() => {
    async function fetchVisibility() {
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
          
          // Track error event - using batched analytics
          // Removed individual analytics insert to improve performance
        } else if (data) {
          setVisibility(data as unknown as OnboardingVisibilityResponse);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error in useOnboardingVisibility:', errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }

    fetchVisibility();
  }, [user, authLoading, preview, isAdmin]);

  return {
    ...visibility,
    loading: loading || authLoading,
    error,
    preview
  };
}

// Hook for updating user states
export function useOnboardingState() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateTourState = async (updates: {
    completed?: boolean;
    dismissed?: boolean;
    last_step?: number;
  }) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_tour_state')
      .upsert({
        user_id: user.id,
        ...updates,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating tour state:', error);
    }

    // Track the state change - using batched analytics
    // Removed individual analytics inserts to improve performance
  };

  const updateStepperState = async (updates: {
    completed?: boolean;
    dismissed?: boolean;
    progress?: Record<string, any>;
  }) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_stepper_state')
      .upsert({
        user_id: user.id,
        ...updates,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating stepper state:', error);
    }

    // Track the state change - using batched analytics  
    // Removed individual analytics inserts to improve performance
  };

  const resetUserStates = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return;

    // Only admins can reset other users' states
    if (userId && userId !== user?.id) {
      const { data: isAdmin } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
        
      if (!isAdmin) {
        throw new Error('Only admins can reset other users states');
      }
    }

    await Promise.all([
      supabase.from('user_tour_state').delete().eq('user_id', targetUserId),
      supabase.from('user_stepper_state').delete().eq('user_id', targetUserId)
    ]);
  };

  return {
    updateTourState,
    updateStepperState,
    resetUserStates
  };
}