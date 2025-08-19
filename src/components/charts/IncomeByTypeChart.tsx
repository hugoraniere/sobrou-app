
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Pie,
  PieChart,
  Cell
} from "recharts";
import { Transaction } from '@/services/transactions';
import { useTranslation } from 'react-i18next';
import { transactionCategories } from '@/data/categories';

interface IncomeByTypeChartProps {
  incomes: Transaction[];
  chartConfig: Record<string, any>;
}

const IncomeByTypeChart: React.FC<IncomeByTypeChartProps> = ({ 
  incomes,
  chartConfig 
}) => {
  const { t } = useTranslation();
  
  // Helper function to get data for pie chart (incomes by type)
  const getIncomesByType = () => {
    const typeMap = new Map<string, number>();
    
    // Filter only income transactions
    incomes.filter(transaction => transaction.type === 'income')
      .forEach(income => {
        const currentAmount = typeMap.get(income.category) || 0;
        typeMap.set(income.category, currentAmount + income.amount);
      });
    
    return Array.from(typeMap.entries()).map(([categoryId, value]) => {
      // Find the category information from transactionCategories
      const categoryInfo = transactionCategories.find(cat => cat.id === categoryId);
      return {
        name: categoryInfo?.name || categoryId,
        value,
        color: categoryInfo?.color || '#8884d8'
      };
    });
  };
  
  const incomesByType = getIncomesByType();

  // Custom label with positioned text to avoid overlapping
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    // Don't render labels for small segments
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    // Position label outside the pie chart
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#000"
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      {incomesByType.length > 0 ? (
        <ChartContainer className="w-full h-full" config={chartConfig}>
          <PieChart>
            <Pie
              data={incomesByType}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {incomesByType.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || chartConfig[entry.name]?.theme?.light || '#8884d8'} />
              ))}
            </Pie>
            <ChartTooltip
              content={({ active, payload }) => active && payload && payload.length ? (
                <ChartTooltipContent payload={payload} />
              ) : null}
            />
          </PieChart>
        </ChartContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          {t('dashboard.charts.noData')}
        </div>
      )}
    </div>
  );
};

export default IncomeByTypeChart;
