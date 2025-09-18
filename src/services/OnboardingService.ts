import { supabase } from '@/integrations/supabase/client';
import { OnboardingProgress, OnboardingGoal } from '@/types/onboarding';

export class OnboardingService {
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

  static async createProgress(userId: string, goal?: OnboardingGoal, effortMinutes?: number): Promise<OnboardingProgress | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .insert({
          user_id: userId,
          goal,
          effort_minutes: effortMinutes,
          steps_completed: [],
          quickwin_done: false
        })
        .select()
        .single();

      if (error) throw error;
      return data as OnboardingProgress;
    } catch (error) {
      console.error('Error creating onboarding progress:', error);
      return null;
    }
  }

  static async updateProgress(userId: string, updates: Partial<OnboardingProgress>): Promise<OnboardingProgress | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as OnboardingProgress;
    } catch (error) {
      console.error('Error updating onboarding progress:', error);
      return null;
    }
  }

  static async completeStep(userId: string, step: string): Promise<OnboardingProgress | null> {
    try {
      // Get current progress
      const progress = await this.getProgress(userId);
      if (!progress) return null;

      const updatedSteps = [...progress.steps_completed];
      if (!updatedSteps.includes(step)) {
        updatedSteps.push(step);
      }

      return await this.updateProgress(userId, {
        steps_completed: updatedSteps
      });
    } catch (error) {
      console.error('Error completing onboarding step:', error);
      return null;
    }
  }

  static async markQuickWinDone(userId: string): Promise<OnboardingProgress | null> {
    return await this.updateProgress(userId, { quickwin_done: true });
  }

  static isStepCompleted(progress: OnboardingProgress | null, step: string): boolean {
    return progress?.steps_completed?.includes(step) || false;
  }

  static isOnboardingCompleted(progress: OnboardingProgress | null): boolean {
    if (!progress) return false;
    
    const requiredSteps = ['checklist_payable', 'checklist_transactions', 'checklist_budget'];
    return requiredSteps.every(step => progress.steps_completed?.includes(step));
  }

  static getCompletionPercentage(progress: OnboardingProgress | null): number {
    if (!progress) return 0;
    
    const totalSteps = 4; // personalization + quickwin + 3 checklist items
    let completed = 0;
    
    if (progress.goal) completed += 0.25;
    if (progress.quickwin_done) completed += 0.25;
    
    const checklistSteps = ['checklist_payable', 'checklist_transactions', 'checklist_budget'];
    completed += (checklistSteps.filter(step => 
      progress.steps_completed?.includes(step)
    ).length / checklistSteps.length) * 0.5;
    
    return Math.round(completed * 100);
  }
}