import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LegendProps, LegendType } from 'recharts';
import { Transaction } from '@/services/transactions';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useTranslation } from 'react-i18next';
import { formatCurrencyNoDecimals } from '@/utils/currencyUtils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addMonths, format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
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

// Helper to process data for chart
const processChartData = (transactions: Transaction[], period: string) => {
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

// Custom legend component to show formatted values
const CustomLegend = (props: LegendProps) => {
  const { payload } = props;
  
  if (!payload || !payload.length) return null;

  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-2 mt-2">
      {payload.map((entry: any, index: number) => {
        if (!entry || !entry.payload) return null;
        
        const value = entry.value;
        const color = entry.color;
        
        return (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-medium">
              {value === 'income' ? 'Receita:' : 'Despesa:'}
              {' '}
              {entry.payload && typeof entry.payload[value] === 'number' ? 
                formatCurrencyNoDecimals(entry.payload[value] || 0) : 
                '0'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const RevenueVsExpenseChart: React.FC<RevenueVsExpenseChartProps> = ({ 
  transactions,
  chartConfig
}) => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('this-month');
  const [viewMode, setViewMode] = useState('monthly');
  
  // Process data for the chart based on selected period
  const chartData = useMemo(() => {
    const data = processChartData(transactions, period);
    
    // Add formatValue function to each data point for the legend
    return data.map(item => ({
      ...item,
      // Add formatter function to each data item
      formatValue: (val: number) => formatCurrencyNoDecimals(val)
    }));
  }, [transactions, period]);
  
  if (chartData.length === 0) {
    return <div className="text-center text-gray-500">Sem dados para exibir.</div>;
  }

  return (
    <div className="h-full w-full flex flex-col">
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
      
      {/* Gráfico */}
      <div className="flex-1 min-h-0">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
              barGap={5}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCurrencyNoDecimals(value)}
              />
              <Tooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value: number) => [
                      formatCurrencyNoDecimals(value),
                      ''
                    ]}
                  />
                }
              />
              <Legend 
                content={<CustomLegend />} 
                verticalAlign="bottom"
              />
              <Bar 
                dataKey="income" 
                name="income" 
                fill={chartConfig.income.theme.light} 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expense" 
                name="expense" 
                fill={chartConfig.expense.theme.light} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default RevenueVsExpenseChart;
