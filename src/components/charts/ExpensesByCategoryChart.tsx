
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction } from '@/services/TransactionService';
import EmptyStateMessage from '../dashboard/EmptyStateMessage';
import { transactionCategories } from '@/data/categories';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

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
      color: categoryInfo?.color || '#8884d8'
    };
  }).sort((a, b) => b.value - a.value); // Sort by value, descending
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
  );
};

const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({ 
  expenses,
  chartConfig 
}) => {
  const data = processChartData(expenses);
  
  // Generate colors for pie chart segments
  const COLORS = data.map(item => item.color || '#8884d8');
  
  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <EmptyStateMessage message="Sem dados para mostrar" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <ChartContainer 
          className="h-[300px]"
          config={chartConfig}
        >
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
                  formatter={(value: number) => {
                    return [`R$ ${value.toFixed(2)}`, ''];
                  }}
                />
              } 
            />
          </PieChart>
        </ChartContainer>
        
        {/* Legend */}
        <ChartLegend data={data} />
      </CardContent>
    </Card>
  );
};

export default ExpensesByCategoryChart;
