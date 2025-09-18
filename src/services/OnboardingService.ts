import { supabase } from '@/integrations/supabase/client';
import { OnboardingStep, OnboardingProgress, AnalyticsEvent } from '@/types/onboarding';

export class OnboardingService {
  // Get all active onboarding steps
  static async getSteps(): Promise<OnboardingStep[]> {
    try {
      const { data, error } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting onboarding steps:', error);
      return [];
    }
  }

  // Get user's onboarding progress
  static async getProgress(userId: string): Promise<OnboardingProgress | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as OnboardingProgress;
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      return null;
    }
  }

  // Create or update user's onboarding progress
  static async updateProgress(userId: string, updates: Partial<OnboardingProgress>): Promise<OnboardingProgress | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .upsert({
          user_id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data as OnboardingProgress;
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
      return null;
    }
  }

  // Mark a step as completed
  static async completeStep(userId: string, stepKey: string): Promise<OnboardingProgress | null> {
    try {
      const progress = await this.getProgress(userId);
      const completed = progress?.completed || {};
      
      return await this.updateProgress(userId, {
        completed: { ...completed, [stepKey]: true }
      });
    } catch (error) {
      console.error('Error completing onboarding step:', error);
      return null;
    }
  }

  // Get event counts for completion tracking
  static async getEventCounts(userId: string): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('event_name')
        .eq('user_id', userId);

      if (error) throw error;

      const counts: Record<string, number> = {};
      data?.forEach(event => {
        counts[event.event_name] = (counts[event.event_name] || 0) + 1;
      });

      return counts;
    } catch (error) {
      console.error('Error getting event counts:', error);
      return {};
    }
  }

  // Track analytics event
  static async trackEvent(eventName: string, userId?: string, params?: Record<string, any>, page?: string): Promise<void> {
    try {
      const eventData: AnalyticsEvent = {
        event_name: eventName,
        user_id: userId,
        event_params: params || {},
        page
      };

      const { error } = await supabase
        .from('analytics_events')
        .insert(eventData);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  }

  // Check if a step should be marked as completed based on event counts
  static shouldCompleteStep(step: OnboardingStep, eventCounts: Record<string, number>): boolean {
    const count = eventCounts[step.completion_event] || 0;
    return count >= step.target_count;
  }

  // Check if user has seen onboarding (has progress record)
  static hasSeenOnboarding(progress: OnboardingProgress | null): boolean {
    return progress !== null;
  }

  // Check if user is a first-time visitor
  static isFirstLogin(progress: OnboardingProgress | null): boolean {
    return progress === null;
  }

  // Get completion percentage
  static getCompletionPercentage(steps: OnboardingStep[], progress: OnboardingProgress | null, eventCounts: Record<string, number>): number {
    if (steps.length === 0) return 0;

    const completedCount = steps.filter(step => {
      return progress?.completed[step.key] || this.shouldCompleteStep(step, eventCounts);
    }).length;

    return Math.round((completedCount / steps.length) * 100);
  }

  // Admin functions
  static async createStep(step: Omit<OnboardingStep, 'id' | 'created_at' | 'updated_at'>): Promise<OnboardingStep | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_steps')
        .insert(step)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating onboarding step:', error);
      return null;
    }
  }

  static async updateStep(id: number, updates: Partial<OnboardingStep>): Promise<OnboardingStep | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_steps')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating onboarding step:', error);
      return null;
    }
  }

  static async deleteStep(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('onboarding_steps')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting onboarding step:', error);
      return false;
    }
  }

  // Reset progress for all users or specific user
  static async resetProgress(userId?: string): Promise<boolean> {
    try {
      let query = supabase.from('onboarding_progress').delete();
      
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error resetting onboarding progress:', error);
      return false;
    }
  }
}