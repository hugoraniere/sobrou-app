import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Transaction } from '@/services/TransactionService';
import EmptyStateMessage from '../dashboard/EmptyStateMessage';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useI18n } from '@/hooks/use-i18n';

interface ExpensesOverTimeChartProps {
  expenses: Transaction[];
  chartConfig: any;
}

const ExpensesOverTimeChart: React.FC<ExpensesOverTimeChartProps> = ({
  expenses,
  chartConfig
}) => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  
  const dateLocale = locale === 'pt-BR' ? ptBR : enUS;
  
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
  
  const data = processData();
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = parseISO(label);
      
      return (
        <div className="custom-tooltip bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">
            {isValid(date) ? format(date, 'PP', { locale: dateLocale }) : label}
          </p>
          <p className="text-sm text-gray-600">
            {`R$ ${payload[0].value.toFixed(2)}`}
          </p>
        </div>
      );
    }
    
    return null;
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{t('dashboard.charts.expensesOverTime')}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Despesas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyStateMessage message={t('dashboard.charts.noData')} />
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesOverTimeChart;
