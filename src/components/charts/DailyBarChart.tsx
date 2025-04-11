
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Transaction } from '@/services/TransactionService';

interface DailyBarChartProps {
  transactions: Transaction[];
}

const DailyBarChart: React.FC<DailyBarChartProps> = ({ transactions }) => {
  const { t, i18n } = useTranslation();
  
  // Function to get daily data for the current month
  const getDailyData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Create a map to store daily totals
    const dailyMap = new Map<string, { day: string, income: number, expense: number }>();
    
    // Process transactions for the current month
    transactions
      .filter(transaction => {
        const date = new Date(transaction.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .forEach(transaction => {
        const date = new Date(transaction.date);
        const day = date.getDate().toString();
        
        // Get or initialize daily data
        let dailyData = dailyMap.get(day) || { day, income: 0, expense: 0 };
        
        // Update income or expense
        if (transaction.type === 'income') {
          dailyData.income += transaction.amount;
        } else {
          dailyData.expense += transaction.amount;
        }
        
        // Update the map
        dailyMap.set(day, dailyData);
      });
    
    // Convert map to array and sort by day
    return Array.from(dailyMap.values())
      .sort((a, b) => parseInt(a.day) - parseInt(b.day));
  };

  const dailyData = getDailyData();
  
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

  // Chart configuration
  const chartConfig = {
    income: {
      label: t('common.income'),
      theme: {
        light: "#0ea5e9",
        dark: "#0ea5e9"
      }
    },
    expense: {
      label: t('common.expense'),
      theme: {
        light: "#ef4444",
        dark: "#ef4444"
      }
    }
  };

  return (
    <div className="h-[300px]">
      {dailyData.length > 0 ? (
        <ChartContainer className="h-full" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                label={{ 
                  value: t('dashboard.charts.day'), 
                  position: 'insideBottom',
                  offset: -10
                }}
                height={50}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                label={{ 
                  value: t('dashboard.charts.amount'), 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -5
                }}
                width={80}
              />
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
              <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                verticalAlign="bottom"
                height={36}
              />
              <Bar dataKey="income" name={t('common.income')} fill="#0ea5e9" />
              <Bar dataKey="expense" name={t('common.expense')} fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          {t('dashboard.charts.noData')}
        </div>
      )}
    </div>
  );
};

export default DailyBarChart;
