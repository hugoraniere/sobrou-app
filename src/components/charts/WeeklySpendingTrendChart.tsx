
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/services/transactions';
import { ChartContainer } from '@/components/ui/chart';
import { formatCurrencyNoDecimals } from '@/utils/currencyUtils';
import { useWeeklySpendingData } from '@/hooks/useWeeklySpendingData';

interface WeeklySpendingTrendChartProps {
  transactions: Transaction[];
  chartConfig: any;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0];
  const value = data.value;
  
  return (
    <div className="bg-white p-3 border rounded shadow-lg text-sm">
      <p className="font-medium mb-1">Dia: {label}</p>
      <p className="text-red-600">
        Gasto médio: {formatCurrencyNoDecimals(value)}
      </p>
    </div>
  );
};

const WeeklySpendingTrendChart: React.FC<WeeklySpendingTrendChartProps> = ({ 
  transactions,
  chartConfig
}) => {
  const { weeklyData, insights } = useWeeklySpendingData(transactions);
  
  if (weeklyData.length === 0 || !insights) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p>Sem dados de despesas para exibir.</p>
        </div>
      </div>
    );
  }
  
  // Create insight message
  const insightMessage = `Você gasta mais nas ${insights.highestSpendingDay.toLowerCase()}s (${formatCurrencyNoDecimals(insights.highestAmount)} em média).`;
  
  return (
    <div className="h-full w-full flex flex-col">
      {/* Insights */}
      <div className="bg-gray-50 rounded-md p-3 mb-4">
        <p className="text-sm text-gray-700">{insightMessage}</p>
      </div>
      
      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="dayName"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
                height={25}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => formatCurrencyNoDecimals(value)}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="averageSpending" 
                name="Gasto médio" 
                fill="#E15759" 
                radius={[4, 4, 0, 0]}
                animationDuration={300}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-[#E15759]" />
          <span className="text-sm font-medium">Gasto médio</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklySpendingTrendChart;
