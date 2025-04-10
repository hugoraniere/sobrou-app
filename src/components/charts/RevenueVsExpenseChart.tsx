
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Line,
  Bar,
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Transaction } from '@/services/TransactionService';
import { useTranslation } from 'react-i18next';

interface RevenueVsExpenseChartProps {
  transactions: Transaction[];
  chartConfig: Record<string, any>;
}

const RevenueVsExpenseChart: React.FC<RevenueVsExpenseChartProps> = ({ 
  transactions,
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
  
  // Helper function to get data for last 6 months
  const getMonthlyData = () => {
    const now = new Date();
    const months = [];
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleString(i18n.language, { month: 'short' }),
        year: date.getFullYear(),
        date: date
      });
    }
    
    // Calculate revenues and expenses for each month
    const monthlyData = months.map(monthData => {
      const month = monthData.date.getMonth();
      const year = monthData.date.getFullYear();
      
      // Filter transactions for this month
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === month && tDate.getFullYear() === year;
      });
      
      // Calculate totals
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const balance = income - expense;
      
      return {
        month: `${monthData.month} ${monthData.year}`,
        income,
        expense,
        balance
      };
    });
    
    return monthlyData;
  };
  
  const monthlyData = getMonthlyData();

  return (
    <div className="h-[300px]">
      {monthlyData.length > 0 ? (
        <ChartContainer className="h-[300px]" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <ChartTooltip
                content={({ active, payload }) => 
                  active && payload && payload.length ? (
                    <ChartTooltipContent 
                      payload={payload} 
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  ) : null
                }
              />
              <Legend />
              <Bar dataKey="income" name={t('common.income')} fill="#0ea5e9" />
              <Bar dataKey="expense" name={t('common.expense')} fill="#ef4444" />
              <Line
                type="monotone"
                dataKey="balance"
                name={t('common.balance')}
                stroke="#10b981"
                strokeWidth={2}
                dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ stroke: '#10b981', strokeWidth: 2, r: 6 }}
              />
            </ComposedChart>
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

export default RevenueVsExpenseChart;
