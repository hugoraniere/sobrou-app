import React, { useState, useEffect } from 'react';
import { AdminAnalyticsService, UserMetrics } from '@/services/adminAnalyticsService';
import BigNumberCard from './BigNumberCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, UserCheck, Crown, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PeriodOption {
  label: string;
  days: number;
  type: 'days' | 'custom';
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { label: 'Hoje', days: 1, type: 'days' },
  { label: 'Últimos 7 dias', days: 7, type: 'days' },
  { label: 'Últimos 30 dias', days: 30, type: 'days' },
  { label: 'Personalizado', days: 0, type: 'custom' }
];

const UserMetricsBigNumbers = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [customMonth, setCustomMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isCustomMode, setIsCustomMode] = useState(false);

  const fetchMetrics = async (periodDays?: number, customDate?: string) => {
    setIsLoading(true);
    try {
      let data: UserMetrics;
      if (customDate) {
        // Custom month mode
        console.log('Fetching user metrics for month:', customDate);
        data = await AdminAnalyticsService.getUserMetricsByMonth(customDate);
      } else {
        // Regular period mode - fetch real data
        console.log('Fetching user metrics for period:', periodDays || 30, 'days');
        data = await AdminAnalyticsService.getUserMetrics(periodDays || 30);
      }
      console.log('Real user metrics loaded:', data);
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
    if (isCustomMode) {
      fetchMetrics(undefined, customMonth);
    } else {
      fetchMetrics(selectedPeriod);
    }
  }, [selectedPeriod, customMonth, isCustomMode]);

  const handlePeriodChange = (option: PeriodOption) => {
    if (option.type === 'custom') {
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
      setSelectedPeriod(option.days);
    }
  };

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
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <Button
              key={option.label}
              variant={
                (option.type === 'custom' && isCustomMode) || 
                (option.type === 'days' && !isCustomMode && selectedPeriod === option.days) 
                  ? 'default' 
                  : 'outline'
              }
              size="sm"
              onClick={() => handlePeriodChange(option)}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              {option.label}
            </Button>
          ))}
        </div>

        {isCustomMode && (
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="custom-month">Selecionar Mês</Label>
              <Input
                id="custom-month"
                type="month"
                value={customMonth}
                onChange={(e) => setCustomMonth(e.target.value)}
                className="w-48"
              />
            </div>
          </div>
        )}
      </div>

      {/* Big Numbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BigNumberCard
          title="Usuários Cadastrados"
          value={metrics.total_users}
          icon={Users}
          color="hsl(var(--primary))"
          tooltip={isCustomMode 
            ? `Total de usuários registrados no mês ${format(new Date(customMonth + '-01'), 'MMM/yyyy', { locale: ptBR })}`
            : `Total de usuários registrados nos últimos ${selectedPeriod} ${selectedPeriod === 1 ? 'dia' : 'dias'}`
          }
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
          tooltip={isCustomMode
            ? `Usuários que tiveram alguma atividade no mês ${format(new Date(customMonth + '-01'), 'MMM/yyyy', { locale: ptBR })}`
            : `Usuários que tiveram alguma atividade nos últimos ${selectedPeriod} ${selectedPeriod === 1 ? 'dia' : 'dias'}`
          }
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
          tooltip={isCustomMode
            ? `Usuários com planos pagos ativos no mês ${format(new Date(customMonth + '-01'), 'MMM/yyyy', { locale: ptBR })}`
            : `Usuários com planos pagos ativos nos últimos ${selectedPeriod} ${selectedPeriod === 1 ? 'dia' : 'dias'}`
          }
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