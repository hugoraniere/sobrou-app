
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction } from '@/services/TransactionService';
import EmptyStateMessage from '../dashboard/EmptyStateMessage';
import { transactionCategories } from '@/data/categories';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface ExpensesByCategoryChartProps {
  expenses: Transaction[];
  chartConfig: any;
}

// Helper function to process chart data 
const processChartData = (expenses: Transaction[]) => {
  const categoryMap = new Map<string, number>();
  
  expenses
    .filter(expense => expense.type === 'expense')
    .forEach(expense => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    });
  
  return Array.from(categoryMap.entries()).map(([category, value]) => {
    const categoryInfo = transactionCategories.find(cat => cat.id === category);
    return {
      name: categoryInfo?.name || category,
      value,
      id: category,
      color: categoryInfo?.color || '#8884d8',
      percentage: 0 // Will be calculated next
    };
  }).sort((a, b) => b.value - a.value); // Sort by value, descending
};

// Calculate percentages
const calculatePercentages = (data: any[]) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return data.map(item => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0
  }));
};

const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({ 
  expenses,
  chartConfig 
}) => {
  const { t } = useTranslation();
  
  // Process and calculate percentages
  const rawData = processChartData(expenses);
  const data = calculatePercentages(rawData);
  
  // Get top category for insight
  const topCategory = data.length > 0 ? data[0] : null;
  
  // Generate colors for pie chart segments
  const COLORS = data.map(item => item.color || '#8884d8');
  
  if (data.length === 0) {
    return (
      <Card className="min-h-[300px] w-full">
        <CardHeader>
          <CardTitle>{t('dashboard.charts.categoryBreakdown')}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyStateMessage message={t('dashboard.charts.noData')} />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="min-h-[300px] w-full max-w-full overflow-hidden">
      <CardHeader>
        <CardTitle>{t('dashboard.charts.categoryBreakdown')}</CardTitle>
        
        {/* Insight moved to top for consistency */}
        {topCategory && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
            <p>
              <span className="font-medium">{topCategory.percentage.toFixed(1)}%</span> dos seus gastos foram com{' '}
              <span className="font-medium">{topCategory.name}</span> (R$ {topCategory.value.toFixed(2)})
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-2 sm:p-3 md:p-4 flex justify-center items-center">
        <div className="h-[250px] w-full max-w-full">
          <ChartContainer 
            className="h-full w-full"
            config={chartConfig}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value: number, name: string, entry: any) => {
                        return [
                          <>
                            <span>R$ {value.toFixed(2)}</span>
                            <span className="block text-xs text-gray-400">({entry.payload.percentage.toFixed(1)}%)</span>
                          </>,
                          name
                        ];
                      }}
                    />
                  } 
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesByCategoryChart;
