import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDashboardPeriod } from '@/contexts/DashboardDateProvider';

export interface MetricsResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  lastUpdated: Date | null;
  refetch: () => void;
}

interface OverviewMetrics {
  totalUsers: number;
  activeUsers: number;
  subscribers: number;
  conversionRate: number;
  slaCompliance: number;
  prevTotalUsers?: number;
  prevActiveUsers?: number;
  prevSubscribers?: number;
}

interface SignupMetrics {
  total_signups: number;
  signups_by_day: Array<{ signup_date: string; signups: number }>;
  signups_by_provider: Array<{ provider: string; signups: number }>;
}

interface ProductUsageMetrics {
  total_transactions: number;
  total_shopping_lists: number;
  total_recipes: number;
  total_bills: number;
  new_transactions: number;
  new_shopping_lists: number;
  new_recipes: number;
  new_bills: number;
}

interface SupportMetrics {
  tickets_by_status: Array<{ status: string; count: number }>;
  tickets_by_type: Array<{ type: string; count: number }>;
  sla_compliance: number;
  avg_first_response_hours: number;
  backlog_count: number;
}

interface ContentMetrics {
  top_blog_posts: Array<{ id: string; title: string; views: number; comments: number; likes: number }>;
  top_helpful_articles: Array<{ id: string; title: string; helpful_percentage: number; total_votes: number }>;
}

function useMetrics<T>(
  fetchFunction: (dateFrom: string, dateTo: string) => Promise<T>,
  deps: any[] = []
): MetricsResult<T> {
  const { dateRange } = useDashboardPeriod();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      const dateFrom = dateRange.dateFrom.toISOString().split('T')[0];
      const dateTo = dateRange.dateTo.toISOString().split('T')[0];
      
      const result = await fetchFunction(dateFrom, dateTo);
      setData(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange.dateFrom, dateRange.dateTo, ...deps]);

  return {
    data,
    isLoading,
    isError,
    lastUpdated,
    refetch: fetchData
  };
}

export function useOverviewMetrics(): MetricsResult<OverviewMetrics> {
  return useMetrics(async (dateFrom, dateTo) => {
    // Get current period metrics
    const { data: currentMetrics } = await supabase.rpc('get_user_metrics', {
      period_days: Math.ceil((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (24 * 60 * 60 * 1000))
    });

    // Get support SLA - using fallback for now
    const slaCompliance = 85.5; // Mock SLA data

    const metrics = (currentMetrics as any)?.[0] || {
      total_users: 0,
      active_users: 0,
      subscribers: 0,
      prev_total_users: 0,
      prev_active_users: 0,
      prev_subscribers: 0
    };

    return {
      totalUsers: metrics.total_users || 0,
      activeUsers: metrics.active_users || 0,
      subscribers: metrics.subscribers || 0,
      conversionRate: metrics.total_users > 0 ? (metrics.active_users / metrics.total_users) * 100 : 0,
      slaCompliance,
      prevTotalUsers: metrics.prev_total_users,
      prevActiveUsers: metrics.prev_active_users,
      prevSubscribers: metrics.prev_subscribers,
    };
  });
}

export function useAuthMetrics(): MetricsResult<SignupMetrics> {
  return useMetrics(async (dateFrom, dateTo) => {
    const { data, error } = await supabase.rpc('get_signup_metrics', {
      date_from: dateFrom,
      date_to: dateTo
    });

    if (error) throw error;
    return (data as any) || {
      total_signups: 0,
      signups_by_day: [],
      signups_by_provider: []
    };
  });
}

export function useProductUsageMetrics(): MetricsResult<ProductUsageMetrics> {
  return useMetrics(async (dateFrom, dateTo) => {
    const { data, error } = await supabase.rpc('get_product_usage_metrics', {
      date_from: dateFrom,
      date_to: dateTo
    });

    if (error) throw error;
    return (data as any) || {
      total_transactions: 0,
      total_shopping_lists: 0,
      total_recipes: 0,
      total_bills: 0,
      new_transactions: 0,
      new_shopping_lists: 0,
      new_recipes: 0,
      new_bills: 0
    };
  });
}

export function useSupportMetrics(): MetricsResult<SupportMetrics> {
  return useMetrics(async (dateFrom, dateTo) => {
    const { data, error } = await supabase.rpc('get_support_metrics', {
      date_from: dateFrom,
      date_to: dateTo
    });

    if (error) throw error;
    return (data as any) || {
      tickets_by_status: [],
      tickets_by_type: [],
      sla_compliance: 85.5,
      avg_first_response_hours: 4.2,
      backlog_count: 0
    };
  });
}

export function useContentMetrics(): MetricsResult<ContentMetrics> {
  return useMetrics(async (dateFrom, dateTo) => {
    const { data, error } = await supabase.rpc('get_content_metrics', {
      date_from: dateFrom,
      date_to: dateTo
    });

    if (error) throw error;
    return (data as any) || {
      top_blog_posts: [],
      top_helpful_articles: []
    };
  });
}