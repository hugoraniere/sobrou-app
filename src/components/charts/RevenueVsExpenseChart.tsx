
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  Tooltip,
  ReferenceLine
} from "recharts";
import { Transaction } from '@/services/transactions';
import { subDays, subMonths, format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RevenueVsExpenseChartProps {
  transactions: Transaction[];
  chartConfig: any;
}

// Opções de filtro
const filterOptions = [
  { value: '7days', label: 'Últimos 7 dias' },
  { value: '15days', label: 'Últimos 15 dias' },
  { value: '30days', label: 'Últimos 30 dias' },
  { value: 'thisMonth', label: 'Mês atual' },
  { value: '3months', label: 'Últimos 3 meses' },
  { value: '6months', label: 'Últimos 6 meses' }
];

const RevenueVsExpenseChart: React.FC<RevenueVsExpenseChartProps> = ({ 
  transactions,
  chartConfig
}) => {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState('thisMonth');
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' ou 'daily'
  
  // Function to get data based on filter and viewMode
  const getChartData = () => {
    const today = new Date();
    let startDate: Date;
    let endDate = today;
    
    // Determinar a data de início com base no filtro
    switch (filter) {
      case '7days':
        startDate = subDays(today, 7);
        break;
      case '15days':
        startDate = subDays(today, 15);
        break;
      case '30days':
        startDate = subDays(today, 30);
        break;
      case 'thisMonth':
        startDate = startOfMonth(today);
        break;
      case '3months':
        startDate = subMonths(today, 3);
        break;
      case '6months':
        startDate = subMonths(today, 6);
        break;
      default:
        startDate = startOfMonth(today);
    }
    
    // Filtrar transações no intervalo de datas
    const filteredTransactions = transactions.filter(transaction => {
      const txDate = new Date(transaction.date);
      return isWithinInterval(txDate, { start: startDate, end: endDate });
    });
    
    if (viewMode === 'monthly') {
      return getMonthlyData(filteredTransactions, startDate, endDate);
    } else {
      return getDailyData(filteredTransactions, startDate, endDate);
    }
  };
  
  // Function to get monthly data
  const getMonthlyData = (filteredTransactions: Transaction[], startDate: Date, endDate: Date) => {
    const monthMap = new Map<string, { income: number; expense: number; balance: number; date: Date }>();
    
    let currentDate = new Date(startDate);
    
    // Criar entradas para cada mês no intervalo
    while (currentDate <= endDate) {
      const monthKey = format(currentDate, 'yyyy-MM');
      const monthLabel = format(currentDate, 'MMM', { locale: i18n.language === 'pt-BR' ? ptBR : undefined });
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { 
          income: 0, 
          expense: 0, 
          balance: 0,
          date: new Date(currentDate)
        });
      }
      
      // Avança para o próximo mês
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    }
    
    // Somar transações por mês
    filteredTransactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const monthKey = format(txDate, 'yyyy-MM');
      
      if (monthMap.has(monthKey)) {
        const monthData = monthMap.get(monthKey)!;
        if (tx.type === 'income') {
          monthData.income += tx.amount;
        } else if (tx.type === 'expense') {
          monthData.expense += tx.amount;
        }
        monthData.balance = monthData.income - monthData.expense;
      }
    });
    
    // Converter para array e ordenar por data
    return Array.from(monthMap.entries())
      .map(([key, data]) => ({
        month: format(data.date, 'MMM', { locale: i18n.language === 'pt-BR' ? ptBR : undefined }),
        income: data.income,
        expense: data.expense,
        balance: data.balance,
        fullDate: data.date
      }))
      .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
  };
  
  // Function to get daily data
  const getDailyData = (filteredTransactions: Transaction[], startDate: Date, endDate: Date) => {
    const dayMap = new Map<string, { income: number; expense: number; balance: number; date: Date }>();
    
    let currentDate = new Date(startDate);
    
    // Criar entradas para cada dia no intervalo
    while (currentDate <= endDate) {
      const dayKey = format(currentDate, 'yyyy-MM-dd');
      
      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, { 
          income: 0, 
          expense: 0, 
          balance: 0,
          date: new Date(currentDate)
        });
      }
      
      // Avança para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Somar transações por dia
    filteredTransactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const dayKey = format(txDate, 'yyyy-MM-dd');
      
      if (dayMap.has(dayKey)) {
        const dayData = dayMap.get(dayKey)!;
        if (tx.type === 'income') {
          dayData.income += tx.amount;
        } else if (tx.type === 'expense') {
          dayData.expense += tx.amount;
        }
        dayData.balance = dayData.income - dayData.expense;
      }
    });
    
    // Converter para array e ordenar por data
    return Array.from(dayMap.entries())
      .map(([key, data]) => ({
        day: format(data.date, 'dd/MM', { locale: i18n.language === 'pt-BR' ? ptBR : undefined }),
        income: data.income,
        expense: data.expense,
        balance: data.balance,
        fullDate: data.date
      }))
      .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
  };
  
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
  
  // Get data based on current filter
  const chartData = getChartData();
  
  // Create insight message
  const getInsightMessage = () => {
    if (chartData.length === 0) return "";
    
    let balance = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    
    chartData.forEach(item => {
      totalIncome += item.income || 0;
      totalExpense += item.expense || 0;
    });
    
    balance = totalIncome - totalExpense;
    
    if (balance > 0) {
      return `Neste período, você economizou ${formatCurrency(balance)}.`;
    } else if (balance < 0) {
      return `Você gastou ${formatCurrency(Math.abs(balance))} a mais do que recebeu neste período.`;
    } else {
      return "Suas receitas e despesas estão equilibradas neste período.";
    }
  };
  
  return (
    <div className="h-[320px] w-full">
      {/* Controles de filtro e visualização */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant={viewMode === 'monthly' ? "default" : "outline"}
            onClick={() => setViewMode('monthly')}
          >
            Mensal
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === 'daily' ? "default" : "outline"}
            onClick={() => setViewMode('daily')}
          >
            Diário
          </Button>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Insight */}
      {chartData.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm">
          <p>{getInsightMessage()}</p>
        </div>
      )}
      
      {chartData.length > 0 ? (
        <div className="h-[200px]">
          <ChartContainer className="h-full" config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey={viewMode === 'monthly' ? "month" : "day"} 
                  height={40}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  width={60}
                  tick={{ fontSize: 11 }}
                />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => viewMode === 'monthly' ? `Mês: ${label}` : `Dia: ${label}`}
                />
                <Legend 
                  verticalAlign="bottom"
                  height={36}
                />
                <Bar 
                  dataKey="income" 
                  name={t('common.income', 'Receita')} 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="expense" 
                  name={t('common.expense', 'Despesa')} 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                />
                {viewMode === 'monthly' && (
                  <Bar 
                    dataKey="balance" 
                    name={t('common.balance', 'Saldo')} 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-gray-400">
          {t('dashboard.charts.noData', 'Sem dados para exibir')}
        </div>
      )}
    </div>
  );
};

export default RevenueVsExpenseChart;
