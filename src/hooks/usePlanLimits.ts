import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSafeAuth } from './useSafeAuth';
import { toast } from 'sonner';

export interface PlanLimit {
  featureKey: string;
  limitValue: number | null;
  currentUsage: number;
  isUnlimited: boolean;
  isAtLimit: boolean;
  percentageUsed: number;
}

export interface PlanLimits {
  [key: string]: PlanLimit;
}

export const usePlanLimits = () => {
  const [limits, setLimits] = useState<PlanLimits>({});
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useSafeAuth();

  const fetchLimits = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_user_plan_limits', {
        target_user_id: user.id
      });

      if (error) throw error;

      const limitsMap: PlanLimits = {};
      
      data?.forEach((limit: any) => {
        const isUnlimited = limit.limit_value === null;
        const isAtLimit = !isUnlimited && limit.current_usage >= limit.limit_value;
        const percentageUsed = isUnlimited ? 0 : (limit.current_usage / limit.limit_value) * 100;

        limitsMap[limit.feature_key] = {
          featureKey: limit.feature_key,
          limitValue: limit.limit_value,
          currentUsage: limit.current_usage,
          isUnlimited,
          isAtLimit,
          percentageUsed: Math.min(percentageUsed, 100)
        };
      });

      setLimits(limitsMap);
    } catch (error) {
      console.error('Error fetching plan limits:', error);
      toast.error("Erro ao carregar limites do plano");
    } finally {
      setLoading(false);
    }
  };

  const trackUsage = async (featureKey: string, amount: number = 1) => {
    if (!isAuthenticated || !user) return false;

    try {
      const { data, error } = await supabase.rpc('track_feature_usage', {
        target_user_id: user.id,
        feature_name: featureKey,
        usage_amount: amount
      });

      if (error) throw error;

      // Refresh limits after tracking usage
      await fetchLimits();
      
      return data;
    } catch (error) {
      console.error('Error tracking usage:', error);
      return false;
    }
  };

  const canUseFeature = (featureKey: string, requiredAmount: number = 1): boolean => {
    const limit = limits[featureKey];
    if (!limit) return true; // If no limit found, allow usage
    if (limit.isUnlimited) return true;
    return (limit.currentUsage + requiredAmount) <= (limit.limitValue || 0);
  };

  const getUsageWarning = (featureKey: string): string | null => {
    const limit = limits[featureKey];
    if (!limit || limit.isUnlimited) return null;

    if (limit.percentageUsed >= 100) {
      return "Limite atingido";
    } else if (limit.percentageUsed >= 90) {
      return "Limite quase atingido";
    } else if (limit.percentageUsed >= 80) {
      return "Próximo do limite";
    }
    
    return null;
  };

  const getRemainingUsage = (featureKey: string): number => {
    const limit = limits[featureKey];
    if (!limit || limit.isUnlimited) return Infinity;
    return Math.max(0, (limit.limitValue || 0) - limit.currentUsage);
  };

  useEffect(() => {
    fetchLimits();
  }, [isAuthenticated, user]);

  return {
    limits,
    loading,
    trackUsage,
    canUseFeature,
    getUsageWarning,
    getRemainingUsage,
    refetch: fetchLimits
  };
};