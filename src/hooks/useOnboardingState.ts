import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

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