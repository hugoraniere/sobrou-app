import { supabase } from "@/integrations/supabase/client";
import { ProductTourStep, UserTourProgress, TourEvent, TourSettings, TourEventType } from "@/types/product-tour";

export class ProductTourService {
  
  // Get all active tour steps ordered by step_order
  static async getTourSteps(): Promise<ProductTourStep[]> {
    const { data, error } = await supabase
      .from('product_tour_steps')
      .select('*')
      .eq('is_active', true)
      .order('step_order', { ascending: true });

    if (error) {
      console.error('Error fetching tour steps:', error);
      throw error;
    }

    return data || [];
  }

  // Get steps for a specific page
  static async getStepsForPage(pageRoute: string): Promise<ProductTourStep[]> {
    const { data, error } = await supabase
      .from('product_tour_steps')
      .select('*')
      .eq('is_active', true)
      .eq('page_route', pageRoute)
      .order('step_order', { ascending: true });

    if (error) {
      console.error('Error fetching steps for page:', error);
      throw error;
    }

    return data || [];
  }

  // Get user's tour progress
  static async getUserProgress(userId: string, tourVersion = '1.0'): Promise<UserTourProgress | null> {
    const { data, error } = await supabase
      .from('user_tour_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('tour_version', tourVersion)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user progress:', error);
      throw error;
    }

    return data;
  }

  // Create or update user progress
  static async updateUserProgress(
    userId: string,
    updates: Partial<UserTourProgress>,
    tourVersion = '1.0'
  ): Promise<UserTourProgress> {
    const { data, error } = await supabase
      .from('user_tour_progress')
      .upsert({
        user_id: userId,
        tour_version: tourVersion,
        ...updates,
      }, {
        onConflict: 'user_id,tour_version'
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }

    return data;
  }

  // Start tour for user
  static async startTour(userId: string, totalSteps: number): Promise<UserTourProgress> {
    return this.updateUserProgress(userId, {
      started_at: new Date().toISOString(),
      total_steps: totalSteps,
      completed_steps: 0,
      current_step_key: null,
      completed_at: null,
      skipped_at: null,
    });
  }

  // Complete tour for user
  static async completeTour(userId: string): Promise<UserTourProgress> {
    const progress = await this.getUserProgress(userId);
    if (!progress) throw new Error('No tour progress found');

    return this.updateUserProgress(userId, {
      completed_at: new Date().toISOString(),
      completed_steps: progress.total_steps,
    });
  }

  // Skip tour for user
  static async skipTour(userId: string): Promise<UserTourProgress> {
    return this.updateUserProgress(userId, {
      skipped_at: new Date().toISOString(),
    });
  }

  // Update current step
  static async updateCurrentStep(
    userId: string, 
    stepKey: string, 
    completedSteps: number
  ): Promise<UserTourProgress> {
    return this.updateUserProgress(userId, {
      current_step_key: stepKey,
      completed_steps: completedSteps,
    });
  }

  // Log tour event
  static async logEvent(
    eventType: TourEventType,
    options: {
      userId?: string;
      sessionId?: string;
      stepKey?: string;
      pageRoute?: string;
      eventData?: Record<string, any>;
    } = {}
  ): Promise<void> {
    const { data, error } = await supabase
      .from('tour_events')
      .insert({
        event_type: eventType,
        user_id: options.userId,
        session_id: options.sessionId,
        step_key: options.stepKey,
        page_route: options.pageRoute,
        event_data: options.eventData || {},
      });

    if (error) {
      console.error('Error logging tour event:', error);
      // Don't throw error for analytics - should not break user experience
    }
  }

  // Get tour settings
  static async getTourSettings(): Promise<Record<string, any>> {
    const { data, error } = await supabase
      .from('tour_settings')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching tour settings:', error);
      throw error;
    }

    const settings: Record<string, any> = {};
    data?.forEach(setting => {
      settings[setting.setting_key] = setting.setting_value;
    });

    return settings;
  }

  // Check if user should start tour automatically
  static async shouldAutoStartTour(userId: string): Promise<boolean> {
    try {
      const settings = await this.getTourSettings();
      const tourConfig = settings.tour_config || {};
      
      // Check if auto-start is enabled
      if (!tourConfig.auto_start_for_new_users) {
        return false;
      }

      // Check if user has already started/completed/skipped tour
      const progress = await this.getUserProgress(userId);
      if (progress?.started_at || progress?.completed_at || progress?.skipped_at) {
        return false;
      }

      // Check if user is truly new (created within last 24 hours)
      const { data: user } = await supabase.auth.getUser();
      if (user?.user?.created_at) {
        const createdAt = new Date(user.user.created_at);
        const now = new Date();
        const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        
        // Only auto-start for users created within last 24 hours
        if (hoursSinceCreation > 24) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking auto-start tour:', error);
      return false;
    }
  }

  // Check if tour is enabled globally
  static async isTourEnabled(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('tour_settings')
        .select('setting_value')
        .eq('setting_key', 'general_config')
        .eq('is_active', true)
        .single();

      if (error || !data) {
        console.log('No tour config found, using default (enabled)');
        return true;
      }

      const config = data.setting_value as any;
      return config?.enabled === true;
    } catch (error) {
      console.error('Error checking if tour is enabled:', error);
      return false;
    }
  }

  // Real-time tour control - stop active tours when disabled
  static async disableTourGlobally(): Promise<void> {
    try {
      // Update the setting
      await supabase
        .from('tour_settings')
        .upsert({
          setting_key: 'general_config',
          setting_value: { enabled: false },
          is_active: true
        });

      // Broadcast disable event to all active sessions
      await supabase
        .from('tour_events')
        .insert({
          event_type: 'tour_disabled_globally',
          event_data: { timestamp: new Date().toISOString() }
        });

      console.log('✅ Tour disabled globally');
    } catch (error) {
      console.error('❌ Error disabling tour globally:', error);
      throw error;
    }
  }

  // Enable tour globally
  static async enableTourGlobally(): Promise<void> {
    try {
      // Update the setting
      await supabase
        .from('tour_settings')
        .upsert({
          setting_key: 'general_config',
          setting_value: { enabled: true },
          is_active: true
        });

      console.log('✅ Tour enabled globally');
    } catch (error) {
      console.error('❌ Error enabling tour globally:', error);
      throw error;
    }
  }
}