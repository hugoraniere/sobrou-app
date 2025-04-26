
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  ReferenceLine
} from "recharts";
import { Transaction } from '@/services/transactions';
import EmptyStateMessage from '../dashboard/EmptyStateMessage';
import { TEXT } from '@/constants/text';

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
  
  // Se não tiver dados, retorna vazio para o componente pai mostrar o EmptyStateMessage
  if (dailyData.length === 0) {
    return null;
  }

  return (
    <div className="h-full w-full">
      {/* Insight message */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm">
        <p>{getInsightMessage()}</p>
      </div>
      
      <div className="h-[220px] w-full">
        <ChartContainer className="h-full w-full" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={dailyData}
              margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="day" 
                height={40}
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                tickFormatter={(value) => `R$${value}`}
                width={50}
                tick={{ fontSize: 11 }}
              />
              <ReferenceLine y={0} stroke="#666" />
              <ChartTooltip
                content={({ active, payload }) => 
                  active && payload && payload.length ? (
                    <ChartTooltipContent 
                      payload={payload} 
                      formatter={(value) => `R$${value}`}
                    />
                  ) : null
                }
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
              />
              <Bar 
                dataKey="income" 
                name={TEXT.common.income} 
                fill="#22c55e" 
                maxBarSize={15} 
              />
              <Bar 
                dataKey="expense" 
                name={TEXT.common.expense} 
                fill="#ef4444" 
                maxBarSize={15} 
              />
              <Line 
                type="monotone" 
                dataKey="cumulativeBalance" 
                name={TEXT.common.balance} 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default DailyBarChart;
