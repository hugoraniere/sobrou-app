
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Transaction } from '@/services/transactions';
import EmptyStateMessage from '../dashboard/EmptyStateMessage';
import { TEXT } from '@/constants/text';
import { useTheme } from 'next-themes';

interface MonthlyComparisonChartProps {
  expenses: Transaction[];
  chartConfig: any;
}

const MonthlyComparisonChart: React.FC<MonthlyComparisonChartProps> = ({
  expenses,
  chartConfig
}) => {
  const { resolvedTheme } = useTheme();
  
  const processData = () => {
    const monthMap: Map<string, { expenses: number, income: number }> = new Map();
    
    expenses.forEach(transaction => {
      try {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        const currentData = monthMap.get(monthKey) || { expenses: 0, income: 0 };
        
        if (transaction.type === 'expense') {
          currentData.expenses += transaction.amount;
        } else if (transaction.type === 'income') {
          currentData.income += transaction.amount;
        }
        
        monthMap.set(monthKey, currentData);
      } catch (error) {
        console.error(`Error processing date: ${transaction.date}`, error);
      }
    });
    
    return Array.from(monthMap.entries())
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-').map(Number);
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        const balance = data.income - data.expenses;
        
        return {
          month: `${monthNames[month - 1]}/${year}`,
          expenses: data.expenses,
          income: data.income,
          balance
        };
      })
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split('/');
        const [monthB, yearB] = b.month.split('/');
        
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        if (yearA !== yearB) {
          return Number(yearA) - Number(yearB);
        }
        
        return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
      });
  };
  
  const data = processData();
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={`item-${index}`} 
              className="text-sm" 
              style={{ color: entry.color }}
            >
              {`${entry.name}: R$ ${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{TEXT.dashboard.charts.monthlyComparison}</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        {data.length > 0 ? (
          <div className="h-[300px] w-full max-w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="expenses" 
                  name="Despesas" 
                  fill="#FF8042" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey="income" 
                  name="Receitas" 
                  fill="#00C49F" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey="balance" 
                  name="Saldo" 
                  fill="#0088FE" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyStateMessage message={TEXT.dashboard.charts.noData} />
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyComparisonChart;
