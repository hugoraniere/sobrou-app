
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '@/services/transactions';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrencyNoDecimals } from '@/utils/currencyUtils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addMonths, format, startOfMonth, endOfMonth, subMonths, eachDayOfInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RevenueVsExpenseChartProps {
  transactions: Transaction[];
  chartConfig: any;
}

// Helper to get date range for periods
const getDateRangeForPeriod = (period: string) => {
  const now = new Date();
  
  switch (period) {
    case 'this-month':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
        label: 'Este mês'
      };
    case 'last-month':
      const lastMonth = subMonths(now, 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth),
        label: 'Mês passado'
      };
    case 'last-3-months':
      return {
        startDate: startOfMonth(subMonths(now, 2)),
        endDate: endOfMonth(now),
        label: 'Últimos 3 meses'
      };
    case 'last-6-months':
      return {
        startDate: startOfMonth(subMonths(now, 5)),
        endDate: endOfMonth(now),
        label: 'Últimos 6 meses'
      };
    case 'this-year':
      return {
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(now.getFullYear(), 11, 31),
        label: 'Este ano'
      };
    default:
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
        label: 'Este mês'
      };
  }
};

// Helper to filter transactions by date range
const filterTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

// Process monthly data for chart
const processMonthlyData = (transactions: Transaction[], period: string) => {
  const { startDate, endDate } = getDateRangeForPeriod(period);
  const filteredTransactions = filterTransactionsByDateRange(
    transactions,
    startDate,
    endDate
  );
  
  // Group by month
  const monthlyData = new Map<string, { month: string; income: number; expense: number; monthKey: string }>();

  // Determine how many months to display based on the period
  let monthsToDisplay = 1;
  if (period === 'last-3-months') monthsToDisplay = 3;
  if (period === 'last-6-months') monthsToDisplay = 6;
  if (period === 'this-year') monthsToDisplay = 12;

  // Initialize months
  for (let i = 0; i < monthsToDisplay; i++) {
    const date = subMonths(endDate, monthsToDisplay - i - 1);
    const monthKey = format(date, 'yyyy-MM');
    const monthLabel = format(date, 'MMM', { locale: ptBR });
    
    monthlyData.set(monthKey, { 
      month: monthLabel, 
      income: 0, 
      expense: 0,
      monthKey
    });
  }

  // Populate with actual data
  filteredTransactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const monthKey = format(transactionDate, 'yyyy-MM');
    
    if (monthlyData.has(monthKey)) {
      const monthData = monthlyData.get(monthKey)!;
      
      if (transaction.type === 'income') {
        monthData.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        monthData.expense += transaction.amount;
      }
    }
  });

  return Array.from(monthlyData.values());
};

// Process daily data for chart (limited to 30 days)
const processDailyData = (transactions: Transaction[], period: string) => {
  const { startDate, endDate } = getDateRangeForPeriod(period);
  const filteredTransactions = filterTransactionsByDateRange(
    transactions,
    startDate,
    endDate
  );
  
  // Limit to last 30 days from end date
  const limitedStartDate = new Date(endDate);
  limitedStartDate.setDate(limitedStartDate.getDate() - 29); // 30 days total
  
  const actualStartDate = limitedStartDate > startDate ? limitedStartDate : startDate;
  
  // Create array of all days in the limited interval
  const daysInInterval = eachDayOfInterval({ start: actualStartDate, end: endDate });
  
  // Initialize daily data with zero values
  const dailyData = daysInInterval.map(date => {
    const dayKey = format(date, 'yyyy-MM-dd');
    const dayLabel = format(date, 'dd/MM');
    
    return {
      day: dayLabel,
      dayKey,
      income: 0,
      expense: 0
    };
  });
  
  // Populate with actual transaction data
  filteredTransactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    const dayKey = format(transactionDate, 'yyyy-MM-dd');
    
    // Find the corresponding day in our data array
    const dayIndex = dailyData.findIndex(item => item.dayKey === dayKey);
    
    if (dayIndex !== -1) {
      if (transaction.type === 'income') {
        dailyData[dayIndex].income += transaction.amount;
      } else if (transaction.type === 'expense') {
        dailyData[dayIndex].expense += transaction.amount;
      }
    }
  });
  
  return dailyData;
};

// Simplified legend component without values
const SimplifiedLegend = () => {
  return (
    <div className="flex justify-center gap-6 mt-4">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-sm bg-green-500" />
        <span className="text-sm font-medium">Receita</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-sm bg-red-500" />
        <span className="text-sm font-medium">Despesa</span>
      </div>
    </div>
  );
};

// Enhanced tooltip for daily view
const EnhancedTooltip = ({ active, payload, label, viewMode }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  if (viewMode === 'daily') {
    // For daily view, show both income and expense
    const incomeData = payload.find((p: any) => p.dataKey === 'income');
    const expenseData = payload.find((p: any) => p.dataKey === 'expense');
    
    return (
      <div className="bg-white p-3 border rounded shadow-lg text-sm">
        <p className="font-medium mb-2">{label}</p>
        {incomeData && (
          <p className="text-green-500">
            Receita: {formatCurrencyNoDecimals(incomeData.value)}
          </p>
        )}
        {expenseData && (
          <p className="text-red-500">
            Despesa: {formatCurrencyNoDecimals(expenseData.value)}
          </p>
        )}
      </div>
    );
  } else {
    // For monthly view, show only the hovered value
    const hoverData = payload[0];
    const value = hoverData.value;
    const type = hoverData.dataKey;
    
    return (
      <div className="bg-white p-2 border rounded shadow text-sm">
        <p className="label">{label}</p>
        <p className={`value ${type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
          {type === 'income' ? 'Receita: ' : 'Despesa: '}
          {formatCurrencyNoDecimals(value)}
        </p>
      </div>
    );
  }
};

const RevenueVsExpenseChart: React.FC<RevenueVsExpenseChartProps> = ({ 
  transactions,
  chartConfig
}) => {
  const [period, setPeriod] = useState('this-month');
  const [viewMode, setViewMode] = useState('monthly');
  
  // Process data for the chart based on selected period and view mode
  const chartData = useMemo(() => {
    if (viewMode === 'monthly') {
      return processMonthlyData(transactions, period);
    } else {
      return processDailyData(transactions, period);
    }
  }, [transactions, period, viewMode]);
  
  // Calculate insights
  const insights = useMemo(() => {
    if (chartData.length === 0) return null;
    
    const totalIncome = chartData.reduce((sum, item) => sum + item.income, 0);
    const totalExpense = chartData.reduce((sum, item) => sum + item.expense, 0);
    const balance = totalIncome - totalExpense;
    
    if (viewMode === 'monthly') {
      const monthlyData = chartData as Array<{ month: string; income: number; expense: number; monthKey: string }>;
      const highestExpenseMonth = monthlyData.reduce((max, item) => 
        item.expense > max.expense ? item : max
      );
      return `Maior gasto em ${highestExpenseMonth.month} com ${formatCurrencyNoDecimals(highestExpenseMonth.expense)}. Saldo do período: ${formatCurrencyNoDecimals(balance)}`;
    } else {
      const dailyData = chartData as Array<{ day: string; dayKey: string; income: number; expense: number }>;
      const daysWithExpenses = dailyData.filter(item => item.expense > 0);
      const avgDailyExpense = daysWithExpenses.length > 0 ? totalExpense / daysWithExpenses.length : 0;
      return `Gasto médio diário: ${formatCurrencyNoDecimals(avgDailyExpense)}. Saldo do período: ${formatCurrencyNoDecimals(balance)}`;
    }
  }, [chartData, viewMode]);
  
  if (chartData.length === 0) {
    return <div className="text-center text-gray-500">Sem dados para exibir.</div>;
  }

  // Calculate dynamic bar size based on data length and view mode
  const calculateBarSize = () => {
    if (viewMode === 'daily') {
      return Math.min(14, Math.max(6, 200 / chartData.length));
    }
    return Math.min(35, Math.max(15, 250 / chartData.length));
  };

  // Calculate if we need horizontal scroll for daily view
  const needsHorizontalScroll = viewMode === 'daily' && chartData.length > 12;
  const chartWidth = needsHorizontalScroll ? Math.max(500, chartData.length * 18) : '100%';

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Controle de período */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Select
          defaultValue={period}
          value={period}
          onValueChange={setPeriod}
        >
          <SelectTrigger className="w-[180px] h-8 text-sm">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-month">Este mês</SelectItem>
            <SelectItem value="last-month">Mês passado</SelectItem>
            <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
            <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
            <SelectItem value="this-year">Este ano</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex ml-auto">
          <Button
            variant={viewMode === 'monthly' ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-8"
            onClick={() => setViewMode('monthly')}
          >
            Mensal
          </Button>
          <Button
            variant={viewMode === 'daily' ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-8"
            onClick={() => setViewMode('daily')}
          >
            Diário
          </Button>
        </div>
      </div>
      
      {/* Insights */}
      {insights && (
        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <p className="text-sm text-gray-700">{insights}</p>
        </div>
      )}
      
      {/* Gráfico */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className={`w-full h-full ${needsHorizontalScroll ? 'overflow-x-auto overflow-y-hidden' : ''}`}>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width={chartWidth} height="100%">
              <BarChart
                data={chartData}
                margin={{ 
                  top: 10, 
                  right: 15, 
                  left: 10, 
                  bottom: viewMode === 'daily' ? 40 : 25 
                }}
                barGap={2}
                maxBarSize={calculateBarSize()}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey={viewMode === 'monthly' ? "month" : "day"}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  angle={viewMode === 'daily' ? -45 : 0}
                  textAnchor={viewMode === 'daily' ? 'end' : 'middle'}
                  height={viewMode === 'daily' ? 40 : 25}
                  interval={0}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => formatCurrencyNoDecimals(value)}
                  width={60}
                />
                <Tooltip content={<EnhancedTooltip viewMode={viewMode} />} />
                <Bar 
                  dataKey="income" 
                  name="income" 
                  fill="#22c55e" 
                  radius={[2, 2, 0, 0]}
                  animationDuration={300}
                />
                <Bar 
                  dataKey="expense" 
                  name="expense" 
                  fill="#ef4444" 
                  radius={[2, 2, 0, 0]}
                  animationDuration={300}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
      
      {/* Legenda movida para baixo */}
      <SimplifiedLegend />
    </div>
  );
};

export default RevenueVsExpenseChart;
