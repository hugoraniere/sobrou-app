import { supabase } from "@/integrations/supabase/client";

export interface ActiveUsersData {
  date: string;
  daily_active_users: number;
  weekly_active_users: number;
}

export interface RetentionCohort {
  cohort_week: string;
  users_count: number;
  week_0: number;
  week_1: number;
  week_2: number;
  week_3: number;
  week_4: number;
}

export interface AppInteractionTotals {
  total_saved_dishes: number;
  total_shopping_lists: number;
  total_transactions: number;
}

export interface BlogViewsData {
  date: string;
  views_count: number;
}

export interface DetailedUserStats {
  join_date: string;
  last_access: string | null;
  content_views: number;
  saved_dishes: number;
  shopping_lists_count: number;
  posts_created: number;
  total_post_views: number;
  total_post_comments: number;
}

export interface UserMetrics {
  total_users: number;
  active_users: number;
  subscribers: number;
  prev_total_users: number;
  prev_active_users: number;
  prev_subscribers: number;
}

export class AdminAnalyticsService {
  static async getActiveUsersStats(periodDays: number = 30): Promise<ActiveUsersData[]> {
    const { data, error } = await supabase.rpc('get_active_users_stats', {
      period_days: periodDays
    });

    if (error) {
      console.error('Error fetching active users stats:', error);
      throw error;
    }

    return data || [];
  }

  static async getRetentionCohorts(weeksBack: number = 12): Promise<RetentionCohort[]> {
    const { data, error } = await supabase.rpc('get_user_retention_cohorts', {
      weeks_back: weeksBack
    });

    if (error) {
      console.error('Error fetching retention cohorts:', error);
      throw error;
    }

    return data || [];
  }

  static async getAppInteractionTotals(): Promise<AppInteractionTotals> {
    const { data, error } = await supabase.rpc('get_app_interaction_totals');

    if (error) {
      console.error('Error fetching app interaction totals:', error);
      throw error;
    }

    return data?.[0] || {
      total_saved_dishes: 0,
      total_shopping_lists: 0,
      total_transactions: 0
    };
  }

  static async getBlogViewsOverTime(daysBack: number = 30): Promise<BlogViewsData[]> {
    const { data, error } = await supabase.rpc('get_blog_views_over_time', {
      days_back: daysBack
    });

    if (error) {
      console.error('Error fetching blog views over time:', error);
      throw error;
    }

    return data || [];
  }

  static async getDetailedUserStats(userId: string): Promise<DetailedUserStats | null> {
    const { data, error } = await supabase.rpc('get_detailed_user_stats', {
      target_user_id: userId
    });

    if (error) {
      console.error('Error fetching detailed user stats:', error);
      throw error;
    }

    return data?.[0] || null;
  }

  static async getBlogEngagementStats() {
    const { data: commentsData, error: commentsError } = await supabase
      .from('blog_comments')
      .select('id')
      .eq('status', 'approved');

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
      throw commentsError;
    }

    const { data: sharesData, error: sharesError } = await supabase
      .from('blog_post_shares')
      .select('id');

    if (sharesError) {
      console.error('Error fetching shares:', sharesError);
      throw sharesError;
    }

    return {
      total_comments: commentsData?.length || 0,
      total_shares: sharesData?.length || 0
    };
  }

  static async getUserMetrics(periodDays: number = 30): Promise<UserMetrics> {
    const { data, error } = await supabase.rpc('get_user_metrics', {
      period_days: periodDays
    });

    if (error) {
      console.error('Error fetching user metrics:', error);
      throw error;
    }

    return data?.[0] || {
      total_users: 0,
      active_users: 0,
      subscribers: 0,
      prev_total_users: 0,
      prev_active_users: 0,
      prev_subscribers: 0
    };
  }

  static async getUserMetricsByMonth(monthYear: string): Promise<UserMetrics> {
    // Parse month (format: YYYY-MM)
    const [year, month] = monthYear.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    // Calculate previous month for comparison
    const prevMonthDate = new Date(year, month - 2, 1);
    const prevMonthEnd = new Date(year, month - 1, 0);

    const { data, error } = await supabase.rpc('get_user_metrics_by_dates', {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      comparison_start_date: prevMonthDate.toISOString().split('T')[0],
      comparison_end_date: prevMonthEnd.toISOString().split('T')[0]
    });

    if (error) {
      console.error('Error fetching user metrics by month:', error);
      throw error;
    }

    return data?.[0] || {
      total_users: 0,
      active_users: 0,
      subscribers: 0,
      prev_total_users: 0,
      prev_active_users: 0,
      prev_subscribers: 0
    };
  }

  static async trackAppEvent(eventType: string, eventData: any = {}) {
    const { error } = await supabase
      .from('app_events')
      .insert({
        event_type: eventType,
        event_data: eventData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) {
      console.error('Error tracking app event:', error);
    }
  }
}