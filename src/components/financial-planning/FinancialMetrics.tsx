
import React from 'react';
import { useTranslation } from 'react-i18next';
import BigNumberCard from '@/components/dashboard/BigNumberCard';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { FinancialPlanningStats } from '@/services/FinancialPlanningService';

interface FinancialMetricsProps {
  stats: FinancialPlanningStats;
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <BigNumberCard
        title={t('financialPlanning.availableToday', 'Disponível Hoje')}
        value={stats.availableToday}
        icon={DollarSign}
        color={stats.availableToday < 0 ? '#ea384c' : '#4ade80'}
        tooltip={t('financialPlanning.dailyTooltip', 'Valor disponível para gastar hoje, considerando suas receitas e despesas')}
      />
      <BigNumberCard
        title={t('financialPlanning.availableWeek', 'Disponível na Semana')}
        value={stats.availableThisWeek}
        icon={Calendar}
        color={stats.availableThisWeek < 0 ? '#ea384c' : '#4ade80'}
        tooltip={t('financialPlanning.weeklyTooltip', 'Valor disponível para gastar esta semana')}
      />
      <BigNumberCard
        title={t('financialPlanning.availableMonth', 'Disponível no Mês')}
        value={stats.availableThisMonth}
        icon={TrendingUp}
        color={stats.availableThisMonth < 0 ? '#ea384c' : '#4ade80'}
        tooltip={t('financialPlanning.monthlyTooltip', 'Valor disponível para gastar este mês')}
      />
    </div>
  );
};

export default FinancialMetrics;
