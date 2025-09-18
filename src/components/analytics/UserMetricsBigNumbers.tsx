import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Activity, TrendingUp } from 'lucide-react';
import { AdminAnalyticsService, UserMetrics } from '@/services/adminAnalyticsService';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface UserMetricsBigNumbersProps {
  periodDays?: number;
}

const UserMetricsBigNumbers: React.FC<UserMetricsBigNumbersProps> = React.memo(({ 
  periodDays = 30 
}) => {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await AdminAnalyticsService.getUserMetrics(periodDays);
        if (mounted) {
          setMetrics(data);
        }
      } catch (error) {
        if (mounted) {
          console.error('Error loading user metrics:', error);
          toast({
            message: "Erro ao carregar métricas de usuários"
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadMetrics();
    
    return () => {
      mounted = false;
    };
  }, [periodDays, toast]);

  const calculateGrowth = useMemo(() => {
    if (!metrics) return { users: 0, active: 0, subscribers: 0 };
    
    return {
      users: metrics.prev_total_users > 0 
        ? ((metrics.total_users - metrics.prev_total_users) / metrics.prev_total_users) * 100 
        : 0,
      active: metrics.prev_active_users > 0 
        ? ((metrics.active_users - metrics.prev_active_users) / metrics.prev_active_users) * 100 
        : 0,
      subscribers: metrics.prev_subscribers > 0 
        ? ((metrics.subscribers - metrics.prev_subscribers) / metrics.prev_subscribers) * 100 
        : 0
    };
  }, [metrics]);

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const growth = calculateGrowth;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.total_users.toLocaleString()}</div>
          <p className={`text-xs ${growth.users >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatGrowth(growth.users)} vs período anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.active_users.toLocaleString()}</div>
          <p className={`text-xs ${growth.active >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatGrowth(growth.active)} vs período anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assinantes</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.subscribers.toLocaleString()}</div>
          <p className={`text-xs ${growth.subscribers >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatGrowth(growth.subscribers)} vs período anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Ativação</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.total_users > 0 
              ? `${Math.round((metrics.active_users / metrics.total_users) * 100)}%`
              : '0%'
            }
          </div>
          <p className="text-xs text-muted-foreground">
            Usuários ativos / Total
          </p>
        </CardContent>
      </Card>
    </div>
  );
});

UserMetricsBigNumbers.displayName = 'UserMetricsBigNumbers';

export default UserMetricsBigNumbers;