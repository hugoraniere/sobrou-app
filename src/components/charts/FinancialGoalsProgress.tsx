
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SavingGoal } from '@/services/SavingsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import EmptyStateMessage from '../dashboard/EmptyStateMessage';

interface FinancialGoalsProgressProps {
  savingGoals: SavingGoal[];
  chartConfig: any;
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Calculate percentage
  const calculatePercentage = (current: number, target: number) => {
    if (target <= 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Prepare data for display
  const chartData = savingGoals.map(goal => {
    const percentage = calculatePercentage(goal.current_amount, goal.target_amount);
    return {
      name: goal.name,
      current: goal.current_amount,
      target: goal.target_amount,
      percentage,
      remaining: goal.target_amount - goal.current_amount,
      isCompleted: percentage >= 100
    };
  }).sort((a, b) => b.percentage - a.percentage); // Sort by percentage
  
  // Find the goal with highest progress for insight
  const topGoal = chartData.length > 0 ? chartData[0] : null;
  
  // Create motivational message
  const getMotivationalMessage = () => {
    if (!topGoal) return "";
    
    if (topGoal.percentage >= 100) {
      return `Parabéns! Você completou a meta "${topGoal.name}"!`;
    } else if (topGoal.percentage >= 75) {
      return `Quase lá! Você já atingiu ${topGoal.percentage.toFixed(0)}% da sua meta "${topGoal.name}".`;
    } else if (topGoal.percentage >= 50) {
      return `Bom progresso! Você já está na metade do caminho para "${topGoal.name}".`;
    } else if (topGoal.percentage >= 25) {
      return `Você já atingiu ${topGoal.percentage.toFixed(0)}% da sua meta "${topGoal.name}". Continue assim!`;
    } else {
      return `Você começou a economizar para "${topGoal.name}". Pequenos passos levam a grandes conquistas!`;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.charts.financialGoals')}</CardTitle>
      </CardHeader>
      <CardContent>
        {savingGoals.length > 0 ? (
          <>
            {/* Motivational Message */}
            <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm">
              <p>{getMotivationalMessage()}</p>
            </div>
            
            {/* Progress Bars */}
            <div className="h-[220px] overflow-y-auto space-y-4">
              {chartData.map((goal) => (
                <div key={goal.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                    </span>
                  </div>
                  <Progress value={goal.percentage} className="h-2" />
                  <p className="text-right text-xs mt-1 text-muted-foreground">
                    {goal.percentage.toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyStateMessage message={t('dashboard.charts.noGoals')} />
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialGoalsProgress;
