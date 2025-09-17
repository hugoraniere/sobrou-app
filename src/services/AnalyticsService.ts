import { supabase } from '@/integrations/supabase/client';
import { AnalyticsEvent } from '@/types/onboarding';

export class AnalyticsService {
  private static sessionId = Math.random().toString(36).substring(7);

  static async trackEvent(eventName: string, params?: Record<string, any>, page?: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const event: AnalyticsEvent = {
        event_name: eventName,
        user_id: user?.id,
        event_params: params || {},
        page: page || window.location.pathname
      };

      const { error } = await supabase
        .from('analytics_events')
        .insert(event);

      if (error) {
        console.error('Error tracking event:', error);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Onboarding specific events
  static trackOnboardingStarted(goal?: string, effort?: number): Promise<void> {
    return this.trackEvent('onboarding_started', { goal, effort_minutes: effort });
  }

  static trackOnboardingSkipped(): Promise<void> {
    return this.trackEvent('onboarding_skipped');
  }

  static trackGoalSelected(goal: string): Promise<void> {
    return this.trackEvent('goal_selected', { goal });
  }

  static trackEffortSelected(minutes: number): Promise<void> {
    return this.trackEvent('effort_selected', { minutes });
  }

  static trackQuickWinOpened(type: string): Promise<void> {
    return this.trackEvent('quickwin_opened', { type });
  }

  static trackPayableCreated(): Promise<void> {
    return this.trackEvent('payable_created');
  }

  static trackTransactionCreated(): Promise<void> {
    return this.trackEvent('transaction_created');
  }

  static trackBudgetDefined(): Promise<void> {
    return this.trackEvent('budget_defined');
  }

  static trackChecklistStepDone(step: string): Promise<void> {
    return this.trackEvent('checklist_step_done', { step });
  }

  static trackOnboardingCompleted(): Promise<void> {
    return this.trackEvent('onboarding_completed');
  }

  static trackTourShown(): Promise<void> {
    return this.trackEvent('tour_shown');
  }

  static trackTourSkipped(): Promise<void> {
    return this.trackEvent('tour_skipped');
  }

  static trackHelpOpened(): Promise<void> {
    return this.trackEvent('help_opened');
  }

  static trackSupportTicketOpened(): Promise<void> {
    return this.trackEvent('support_ticket_opened');
  }
}