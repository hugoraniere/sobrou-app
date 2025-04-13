
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { Transaction } from '@/services/TransactionService';
import EmptyStateMessage from '../dashboard/EmptyStateMessage';
import { transactionCategories } from '@/data/categories';

interface ExpensesByCategoryChartProps {
  expenses: Transaction[];
  chartConfig: any;
}

const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({ 
  expenses,
  chartConfig 
}) => {
  const { t } = useTranslation();
  
  // Process data for the chart
  const processData = () => {
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
        id: category
      };
    }).sort((a, b) => b.value - a.value); // Sort by value, descending
  };
  
  const data = processData();
  
  // Generate colors for pie chart segments
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="custom-tooltip bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {`R$ ${data.value.toFixed(2)} (${percentage}%)`}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        {data.length > 0 ? (
          <>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
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
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-1 gap-1 mt-4">
              {data.slice(0, 5).map((entry, index) => (
                <div key={entry.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm truncate">{entry.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    R$ {entry.value.toFixed(2)}
                  </span>
                </div>
              ))}
              {data.length > 5 && (
                <div className="text-xs text-center text-gray-500 mt-1">
                  +{data.length - 5} outras categorias
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyStateMessage message={t('dashboard.charts.noData')} />
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesByCategoryChart;
