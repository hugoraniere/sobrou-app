import React, { useState, useEffect } from 'react';
import { AdminAnalyticsService, UserMetrics } from '@/services/adminAnalyticsService';
import { BigNumberCard } from './BigNumberCard';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Crown, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PeriodOption {
  label: string;
  days: number;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { label: 'Hoje', days: 1 },
  { label: '7 dias', days: 7 },
  { label: '30 dias', days: 30 },
  { label: 'Ano anterior', days: 365 }
];

const UserMetricsBigNumbers = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  const fetchMetrics = async (periodDays: number) => {
    setIsLoading(true);
    try {
      const data = await AdminAnalyticsService.getUserMetrics(periodDays);
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching user metrics:', error);
      toast({
        message: 'Erro ao carregar métricas de usuários',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(selectedPeriod);
  }, [selectedPeriod]);

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { percentage: 0, isPositive: current > 0 };
    const percentage = ((current - previous) / previous) * 100;
    return { percentage: Math.abs(percentage), isPositive: percentage >= 0 };
  };

  const formatTrendValue = (current: number, previous: number) => {
    const trend = calculateTrend(current, previous);
    return {
      value: trend.percentage.toFixed(1) + '%',
      isPositive: trend.isPositive,
      icon: trend.isPositive ? TrendingUp : TrendingDown
    };
  };

  if (!metrics) return null;

  const totalUsersTrend = formatTrendValue(metrics.total_users, metrics.prev_total_users);
  const activeUsersTrend = formatTrendValue(metrics.active_users, metrics.prev_active_users);
  const subscribersTrend = formatTrendValue(metrics.subscribers, metrics.prev_subscribers);

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="flex flex-wrap gap-2">
        {PERIOD_OPTIONS.map((option) => (
          <Button
            key={option.days}
            variant={selectedPeriod === option.days ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod(option.days)}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            {option.label}
          </Button>
        ))}
      </div>

      {/* Big Numbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BigNumberCard
          title="Usuários Cadastrados"
          value={metrics.total_users}
          icon={Users}
          color="hsl(var(--primary))"
          tooltip={`Total de usuários registrados nos últimos ${selectedPeriod} dias`}
          trend={totalUsersTrend.isPositive !== undefined ? {
            value: parseFloat(totalUsersTrend.value.replace('%', '')),
            isPositive: totalUsersTrend.isPositive
          } : undefined}
        />

        <BigNumberCard
          title="Usuários Ativos"
          value={metrics.active_users}
          icon={UserCheck}
          color="hsl(var(--secondary))"
          tooltip={`Usuários que tiveram alguma atividade nos últimos ${selectedPeriod} dias`}
          trend={activeUsersTrend.isPositive !== undefined ? {
            value: parseFloat(activeUsersTrend.value.replace('%', '')),
            isPositive: activeUsersTrend.isPositive
          } : undefined}
        />

        <BigNumberCard
          title="Assinantes"
          value={metrics.subscribers}
          icon={Crown}
          color="hsl(var(--accent))"
          tooltip={`Usuários com planos pagos ativos nos últimos ${selectedPeriod} dias`}
          trend={subscribersTrend.isPositive !== undefined ? {
            value: parseFloat(subscribersTrend.value.replace('%', '')),
            isPositive: subscribersTrend.isPositive
          } : undefined}
        />
      </div>
    </div>
  );
};

export default UserMetricsBigNumbers;