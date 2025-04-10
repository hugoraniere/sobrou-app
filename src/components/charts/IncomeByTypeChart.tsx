
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Pie,
  ResponsiveContainer,
  PieChart,
  Cell
} from "recharts";
import { Transaction } from '@/services/TransactionService';
import { useTranslation } from 'react-i18next';

interface IncomeByTypeChartProps {
  incomes: Transaction[];
  chartConfig: Record<string, any>;
}

const IncomeByTypeChart: React.FC<IncomeByTypeChartProps> = ({ 
  incomes,
  chartConfig 
}) => {
  const { t } = useTranslation();
  
  // Generate unique colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4BC0C0', '#FF6384', '#36A2EB', '#FB6340'];
  
  // Helper function to get data for pie chart (incomes by type)
  const getIncomesByType = () => {
    const typeMap = new Map<string, number>();
    
    // Filter only income transactions
    incomes.filter(transaction => transaction.type === 'income')
      .forEach(income => {
        const currentAmount = typeMap.get(income.category) || 0;
        typeMap.set(income.category, currentAmount + income.amount);
      });
    
    return Array.from(typeMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  const incomesByType = getIncomesByType();

  return (
    <div className="h-[300px]">
      {incomesByType.length > 0 ? (
        <ChartContainer className="h-[300px]" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incomesByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {incomesByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => active && payload && payload.length ? (
                  <ChartTooltipContent payload={payload} />
                ) : null}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          {t('dashboard.charts.noData')}
        </div>
      )}
    </div>
  );
};

export default IncomeByTypeChart;
