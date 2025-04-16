
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

// Legend component for the pie chart
const ChartLegend: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 gap-1 mt-4">
      {data.slice(0, 5).map((entry, index) => (
        <div key={entry.id} className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm truncate">{entry.name}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">
              R$ {entry.value.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">
              {entry.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      ))}
      {data.length > 5 && (
        <div className="text-xs text-center text-gray-500 mt-1">
          +{data.length - 5} outras categorias
        </div>
      )}
    </div>
  );
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
      <Card>
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
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.charts.categoryBreakdown')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer 
            className="h-full"
            config={chartConfig}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
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
        
        {/* Legend */}
        <ChartLegend data={data} />
        
        {/* Insight */}
        {topCategory && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
            <p>
              <span className="font-medium">{topCategory.percentage.toFixed(1)}%</span> dos seus gastos foram com{' '}
              <span className="font-medium">{topCategory.name}</span> (R$ {topCategory.value.toFixed(2)})
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesByCategoryChart;
