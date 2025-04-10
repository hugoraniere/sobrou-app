
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';
import { SavingGoal } from '@/services/SavingsService';

interface FinancialGoalsProgressProps {
  savingGoals: SavingGoal[];
  chartConfig: Record<string, any>;
}

const FinancialGoalsProgress: React.FC<FinancialGoalsProgressProps> = ({ 
  savingGoals,
  chartConfig 
}) => {
  const { t, i18n } = useTranslation();
  
  // Format currency based on locale
  const formatCurrency = (value: number) => {
    const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en-US';
    const currency = locale === 'pt-BR' ? 'BRL' : 'USD';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  };
  
  // Calculate progress percentage for each goal
  const goalsWithProgress = savingGoals.map(goal => {
    const progressPercent = Math.round((goal.current_amount / goal.target_amount) * 100);
    return {
      ...goal,
      progressPercent
    };
  });

  return (
    <div className="h-[300px] overflow-y-auto">
      {goalsWithProgress.length > 0 ? (
        <div className="space-y-4">
          {goalsWithProgress.map(goal => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{goal.title}</span>
                <span className="text-sm text-gray-500">
                  {goal.progressPercent}%
                </span>
              </div>
              <div className="space-y-1">
                <Progress value={goal.progressPercent} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatCurrency(goal.current_amount)}</span>
                  <span>{formatCurrency(goal.target_amount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-gray-400">
          <p>{t('dashboard.charts.noGoals')}</p>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm">
            {t('dashboard.charts.createGoal')}
          </button>
        </div>
      )}
    </div>
  );
};

export default FinancialGoalsProgress;
