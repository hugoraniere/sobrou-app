
import React from 'react';
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
  Line,
  LineChart,
  ReferenceLine
} from "recharts";
import { Transaction } from '@/services/TransactionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmptyStateMessage from '../dashboard/EmptyStateMessage';
import { subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RevenueVsExpenseChartProps {
  transactions: Transaction[];
  chartConfig: any;
}

const RevenueVsExpenseChart: React.FC<RevenueVsExpenseChartProps> = ({ 
  transactions,
  chartConfig
}) => {
  const { t, i18n } = useTranslation();
  
  // Function to get monthly data for the last 6 months
  const getMonthlyData = () => {
    const today = new Date();
    const data = [];
    
    // Create data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(today, i);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthlyTransactions = transactions.filter(transaction => {
        const txDate = new Date(transaction.date);
        return txDate.getMonth() === month && txDate.getFullYear() === year;
      });
      
      const income = monthlyTransactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);
        
      const expense = monthlyTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0);
        
      const balance = income - expense;
      
      data.push({
        month: format(date, 'MMM', { locale: i18n.language === 'pt-BR' ? ptBR : undefined }),
        income,
        expense,
        balance,
        fullDate: date
      });
    }
    
    return data;
  };
  
  const monthlyData = getMonthlyData();
  
  // Get current month data for insight
  const currentMonthData = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1] : null;
  
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
  
  // Create insight message
  const getInsightMessage = () => {
    if (!currentMonthData) return "";
    
    const { income, expense, balance } = currentMonthData;
    
    if (balance > 0) {
      return `Neste mês, você economizou ${formatCurrency(balance)}.`;
    } else if (balance < 0) {
      return `Você gastou ${formatCurrency(Math.abs(balance))} a mais do que recebeu este mês.`;
    } else {
      return "Suas receitas e despesas estão equilibradas este mês.";
    }
  };
  
  return (
    <Card className="min-h-[300px] w-full overflow-hidden">
      <CardHeader>
        <CardTitle>{t('dashboard.charts.revenueVsExpense')}</CardTitle>
        
        {/* Insight - Standardized after the title */}
        {currentMonthData && (
          <div className="p-3 bg-gray-50 rounded-md text-sm">
            <p>{getInsightMessage()}</p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {monthlyData.length > 0 ? (
          <div className="h-[250px]">
            <ChartContainer className="h-full" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    height={40}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    width={60}
                    tick={{ fontSize: 11 }}
                  />
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
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
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    name={t('common.income')} 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expense" 
                    name={t('common.expense')} 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    name={t('common.balance')} 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
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

export default RevenueVsExpenseChart;
