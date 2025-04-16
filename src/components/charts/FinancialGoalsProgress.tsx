
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SavingGoal } from '@/services/SavingsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import EmptyStateMessage from '../dashboard/EmptyStateMessage';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from 'recharts';

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

  // Prepare data for the chart
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
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">Meta: {formatCurrency(data.target)}</p>
          <p className="text-sm">Atual: {formatCurrency(data.current)}</p>
          <p className="text-sm">Faltam: {formatCurrency(data.remaining)}</p>
          <p className="text-sm font-semibold">{data.percentage.toFixed(1)}% concluído</p>
        </div>
      );
    }
    
    return null;
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
            <div className="space-y-4 mb-4">
              {chartData.map((goal) => (
                <div key={goal.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{goal.name}</span>
                    <span>
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                    </span>
                  </div>
                  <Progress value={goal.percentage} className="h-2" />
                  <div className="flex justify-end text-xs text-gray-500">
                    {goal.percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
            
            {/* Horizontal Bar Chart */}
            <div className="h-[200px] mt-6">
              <ChartContainer className="h-full" config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tickFormatter={formatCurrency} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={90}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="target" fill="#d1d5db" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="current" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isCompleted ? '#22c55e' : '#3b82f6'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
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
