
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
  Line,
  ComposedChart,
  ReferenceLine
} from "recharts";
import { Transaction } from '@/services/TransactionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmptyStateMessage from '../dashboard/EmptyStateMessage';

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
    const dailyMap = new Map<string, { 
      day: string, 
      income: number, 
      expense: number,
      balance: number,
      cumulativeBalance: number 
    }>();
    
    // Get all days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Initialize all days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = i.toString();
      dailyMap.set(dayStr, { 
        day: dayStr, 
        income: 0, 
        expense: 0, 
        balance: 0,
        cumulativeBalance: 0 
      });
    }
    
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
        let dailyData = dailyMap.get(day) || { 
          day, 
          income: 0, 
          expense: 0, 
          balance: 0,
          cumulativeBalance: 0 
        };
        
        // Update income or expense
        if (transaction.type === 'income') {
          dailyData.income += transaction.amount;
        } else {
          dailyData.expense += transaction.amount;
        }
        
        // Calculate daily balance
        dailyData.balance = dailyData.income - dailyData.expense;
        
        // Update the map
        dailyMap.set(day, dailyData);
      });
    
    // Convert map to array and sort by day
    let result = Array.from(dailyMap.values())
      .sort((a, b) => parseInt(a.day) - parseInt(b.day));
      
    // Calculate cumulative balance
    let runningBalance = 0;
    result = result.map(day => {
      runningBalance += day.balance;
      return {
        ...day,
        cumulativeBalance: runningBalance
      };
    });
    
    return result;
  };

  const dailyData = getDailyData();
  
  // Find periods where balance goes negative
  const findNegativePeriods = (data: any[]) => {
    const negativeRanges: { start: number; end: number }[] = [];
    let currentRange: { start: number; end: number } | null = null;
    
    data.forEach((day, index) => {
      if (day.cumulativeBalance < 0) {
        if (!currentRange) {
          currentRange = { start: parseInt(day.day), end: parseInt(day.day) };
        } else {
          currentRange.end = parseInt(day.day);
        }
      } else if (currentRange) {
        negativeRanges.push(currentRange);
        currentRange = null;
      }
    });
    
    if (currentRange) {
      negativeRanges.push(currentRange);
    }
    
    return negativeRanges;
  };
  
  const negativePeriods = findNegativePeriods(dailyData);
  
  // Create insight message
  const getInsightMessage = () => {
    if (negativePeriods.length === 0) {
      return "Seu saldo se manteve positivo durante todo o mês.";
    }
    
    const period = negativePeriods[0];
    return `Seu saldo entra no vermelho entre os dias ${period.start} e ${period.end}.`;
  };
  
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
        light: "#22c55e",
        dark: "#22c55e"
      }
    },
    expense: {
      label: t('common.expense'),
      theme: {
        light: "#ef4444",
        dark: "#ef4444"
      }
    },
    balance: {
      label: t('common.balance'),
      theme: {
        light: "#3b82f6",
        dark: "#3b82f6"
      }
    }
  };
  
  return (
    <Card className="min-h-[300px] w-full overflow-hidden">
      <CardHeader>
        <CardTitle>{t('dashboard.charts.dailyEvolution')}</CardTitle>
        
        {/* Insight - Standardized after the title */}
        <div className="p-3 bg-gray-50 rounded-md text-sm">
          <p>{getInsightMessage()}</p>
        </div>
      </CardHeader>
      <CardContent>
        {dailyData.length > 0 ? (
          <div className="h-[250px]">
            <ChartContainer className="h-full" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={dailyData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    height={40}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    width={60}
                    tick={{ fontSize: 11 }}
                  />
                  <ReferenceLine y={0} stroke="#666" />
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
                    verticalAlign="bottom"
                    height={36}
                  />
                  <Bar dataKey="income" name={t('common.income')} fill="#22c55e" maxBarSize={15} />
                  <Bar dataKey="expense" name={t('common.expense')} fill="#ef4444" maxBarSize={15} />
                  <Line 
                    type="monotone" 
                    dataKey="cumulativeBalance" 
                    name={t('common.balance')} 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        ) : (
          <EmptyStateMessage message={t('dashboard.charts.noData')} />
        )}
      </CardContent>
    </Card>
  );
};

export default DailyBarChart;
