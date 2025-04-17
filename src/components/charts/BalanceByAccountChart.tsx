
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Pie,
  ResponsiveContainer,
  PieChart,
  Cell,
  Legend
} from "recharts";
import { Transaction } from '@/services/TransactionService';
import { useTranslation } from 'react-i18next';

interface BalanceByAccountChartProps {
  transactions: Transaction[];
  chartConfig: Record<string, any>;
}

const BalanceByAccountChart: React.FC<BalanceByAccountChartProps> = ({ 
  transactions,
  chartConfig 
}) => {
  const { t } = useTranslation();
  
  // Generate unique colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4BC0C0', '#FF6384', '#36A2EB', '#FB6340'];
  
  // Helper function to get data for pie chart (balance by account)
  const getBalanceByAccount = () => {
    // For demo purposes, we'll simulate different accounts/cards
    // In a real app, this would come from the account/card information in each transaction
    const accounts = [
      { id: 'main-account', name: t('accounts.mainAccount'), balance: 3540.75 },
      { id: 'savings', name: t('accounts.savings'), balance: 12750.20 },
      { id: 'credit-card', name: t('accounts.creditCard'), balance: 1250.50 },
      { id: 'investments', name: t('accounts.investments'), balance: 8430.00 }
    ];
    
    return accounts.map(account => ({
      name: account.name,
      value: account.balance
    }));
  };
  
  const balanceByAccount = getBalanceByAccount();

  // Custom label with positioned text to avoid overlapping
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    // Don't render labels for small segments
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    // Position label outside the pie chart
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#000"
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="h-[300px] w-full max-w-full overflow-hidden flex justify-center items-center p-2 sm:p-3 md:p-4">
      {balanceByAccount.length > 0 ? (
        <ChartContainer className="h-[300px] w-full max-w-full" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={balanceByAccount}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}
              >
                {balanceByAccount.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <ChartTooltip
                content={({ active, payload }) => active && payload && payload.length ? (
                  <ChartTooltipContent payload={payload} />
                ) : null}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          {t('dashboard.charts.noData')}
        </div>
      )}
    </div>
  );
};

export default BalanceByAccountChart;
