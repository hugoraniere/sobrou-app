import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Transaction } from '@/services/transactions';
import EmptyStateMessage from '../dashboard/EmptyStateMessage';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useI18n } from '@/hooks/use-i18n';
import { TEXT } from '@/constants/text';

interface ExpensesOverTimeChartProps {
  expenses: Transaction[];
  chartConfig: any;
}

const ExpensesOverTimeChart: React.FC<ExpensesOverTimeChartProps> = ({
  expenses,
  chartConfig
}) => {
  const { locale } = useI18n();
  
  const dateLocale = ptBR;
  
  const processData = () => {
    const dateMap: Map<string, number> = new Map();
    
    const onlyExpenses = expenses.filter(expense => expense.type === 'expense');
    
    onlyExpenses.forEach(expense => {
      try {
        const dateKey = expense.date.substring(0, 10);
        const currentAmount = dateMap.get(dateKey) || 0;
        dateMap.set(dateKey, currentAmount + expense.amount);
      } catch (error) {
        console.error(`Error processing date: ${expense.date}`, error);
      }
    });
    
    return Array.from(dateMap.entries())
      .map(([date, amount]) => ({
        date,
        amount
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = parseISO(label);
      
      return (
        <div className="custom-tooltip bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">
            {isValid(date) ? format(date, 'PP', { locale: dateLocale }) : label}
          </p>
          <p className="text-sm text-gray-600">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  const data = processData();
  
  // Create an insight message
  const getInsightMessage = () => {
    if (data.length < 2) return "Adicione mais transações para ver insights sobre seus gastos ao longo do tempo.";
    
    // Find the highest spending day
    const highestSpending = [...data].sort((a, b) => b.amount - a.amount)[0];
    const highestDate = parseISO(highestSpending.date);
    
    if (isValid(highestDate)) {
      return `Seu maior gasto foi em ${format(highestDate, 'dd/MM/yyyy', { locale: dateLocale })}, totalizando ${formatCurrency(highestSpending.amount)}.`;
    }
    
    return "Adicione mais transações para ver insights sobre seus gastos ao longo do tempo.";
  };
  
  const formatXAxis = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'dd/MM', { locale: dateLocale });
      }
      return dateString;
    } catch (error) {
      console.error(`Error formatting date: ${dateString}`, error);
      return dateString;
    }
  };
  
  return (
    <Card className="min-h-[300px] w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>{TEXT.dashboard.charts.expensesOverTime || 'Despesas ao longo do tempo'}</CardTitle>
        
        {/* Standardized insight location */}
        <div className="p-3 bg-gray-50 rounded-md text-sm">
          <p>{getInsightMessage()}</p>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="w-full h-[250px]">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => formatCurrency(value)}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#ef4444"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="Despesas"
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <EmptyStateMessage message={TEXT.dashboard.charts.noData || 'Sem dados para exibir'} />
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesOverTimeChart;
