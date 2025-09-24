import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hook para obter top usuários por uso (substitui mockTopUsers)
export function useTopUsersByUsage(dateFrom?: string, dateTo?: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: result, error } = await supabase.rpc('get_top_users_by_usage', {
          date_from: dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          date_to: dateTo || new Date().toISOString().split('T')[0]
        });

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        console.error('Error fetching top users:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateFrom, dateTo]);

  return { data, isLoading, error };
}

// Hook para obter usuários ativos ao longo do tempo (substitui mockActiveUsersData)
export function useActiveUsersTimeline(dateFrom?: string, dateTo?: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: result, error } = await supabase.rpc('get_active_users_timeline', {
          date_from: dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          date_to: dateTo || new Date().toISOString().split('T')[0]
        });

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        console.error('Error fetching active users timeline:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateFrom, dateTo]);

  return { data, isLoading, error };
}

// Hook para obter tickets em backlog (substitui mockBacklogTickets)
export function useSupportBacklog(hoursThreshold: number = 72) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: result, error } = await supabase.rpc('get_support_backlog', {
          hours_threshold: hoursThreshold
        });

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        console.error('Error fetching support backlog:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [hoursThreshold]);

  return { data, isLoading, error };
}

// Hook para obter cadastros recentes (substitui mockRecentSignups)
export function useRecentSignups(limitCount: number = 10) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: result, error } = await supabase.rpc('get_recent_signups', {
          limit_count: limitCount
        });

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        console.error('Error fetching recent signups:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [limitCount]);

  return { data, isLoading, error };
}

// Hook para obter erros de login (substitui mockLoginErrors)
export function useLoginErrors(dateFrom?: string, dateTo?: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: result, error } = await supabase.rpc('get_login_errors', {
          date_from: dateFrom || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          date_to: dateTo || new Date().toISOString().split('T')[0]
        });

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        console.error('Error fetching login errors:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateFrom, dateTo]);

  return { data, isLoading, error };
}

// Hook para obter alertas financeiros (substitui sampleAlerts)
export function useFinancialAlerts(userId?: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: result, error } = await supabase.rpc('get_financial_alerts', {
          user_id_param: userId || null
        });

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        console.error('Error fetching financial alerts:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { data, isLoading, error };
}

// Hook para obter recomendações financeiras (substitui sampleRecommendations)
export function useFinancialRecommendations(userId?: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: result, error } = await supabase.rpc('get_financial_recommendations', {
          user_id_param: userId || null
        });

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        console.error('Error fetching financial recommendations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { data, isLoading, error };
}