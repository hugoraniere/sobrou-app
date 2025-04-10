
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Bar,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Transaction } from '@/services/TransactionService';
import { useTranslation } from 'react-i18next';

interface MonthlyComparisonChartProps {
  expenses: Transaction[];
  chartConfig: Record<string, any>;
}

const MonthlyComparisonChart: React.FC<MonthlyComparisonChartProps> = ({ 
  expenses,
  chartConfig
}) => {
  const { t } = useTranslation();
  
  // Helper function to get data for bar chart (month-to-month comparison)
  const getMonthlyComparison = () => {
    const monthMap = new Map<string, number>();
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      const currentAmount = monthMap.get(monthYear) || 0;
      monthMap.set(monthYear, currentAmount + expense.amount);
    });
    
    return Array.from(monthMap.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split(' ');
        const [monthB, yearB] = b.month.split(' ');
        
        if (yearA !== yearB) return Number(yearA) - Number(yearB);
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(monthA) - months.indexOf(monthB);
      });
  };
  
  const monthlyComparison = getMonthlyComparison();

  return (
    <div className="h-[300px]">
      {monthlyComparison.length > 0 ? (
        <ChartContainer className="h-[300px]" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyComparison}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip
                content={({ active, payload }) => active && payload && payload.length ? (
                  <ChartTooltipContent payload={payload} />
                ) : null}
              />
              <Legend />
              <Bar dataKey="amount" name={t('common.expense')} fill="#36A2EB" />
            </BarChart>
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

export default MonthlyComparisonChart;
