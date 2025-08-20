import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Transaction } from '@/services/transactions';
import { ChartContainer } from '@/components/ui/chart';
import { formatCurrencyNoDecimals } from '@/utils/currencyUtils';
import { useWeeklySpendingData } from '@/hooks/useWeeklySpendingData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePeriodFilter, PERIOD_OPTIONS, PeriodOption } from '@/hooks/usePeriodFilter';
import { useResponsive } from '@/hooks/useResponsive';
interface WeeklySpendingTrendChartProps {
  transactions: Transaction[];
  chartConfig: any;
}
const CustomTooltip = ({
  active,
  payload,
  label
}: any) => {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0];
  const value = data.value;
  return <div className="bg-white p-3 border rounded shadow-lg text-sm">
      <p className="font-medium mb-1">Dia: {label}</p>
      <p className="text-red-600">
        Gasto médio: {formatCurrencyNoDecimals(value)}
      </p>
    </div>;
};
const WeeklySpendingTrendChart: React.FC<WeeklySpendingTrendChartProps> = ({
  transactions,
  chartConfig
}) => {
  const {
    isMobile
  } = useResponsive();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('this-month');
  const {
    filteredTransactions
  } = usePeriodFilter(transactions, selectedPeriod);
  const {
    weeklyData,
    insights
  } = useWeeklySpendingData(filteredTransactions);

  // Create chart data with appropriate day names based on device
  const chartData = weeklyData.map(day => ({
    ...day,
    displayName: isMobile ? day.dayNameMobile : day.dayName
  }));
  if (weeklyData.length === 0 || !insights) {
    return <div className="h-full w-full flex flex-col">
        {/* Period Filter */}
        <div className="mb-4">
          <Select value={selectedPeriod} onValueChange={(value: PeriodOption) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-[180px] h-8 text-sm">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map(option => <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>Sem dados de despesas para exibir no período selecionado.</p>
          </div>
        </div>
      </div>;
  }

  // Create insight message
  const insightMessage = `Você gasta mais nas ${insights.highestSpendingDay.toLowerCase()}s (${formatCurrencyNoDecimals(insights.highestAmount)} em média).`;
  return <div className="h-full w-full flex flex-col">
      {/* Period Filter */}
      <div className="mb-4">
        <Select value={selectedPeriod} onValueChange={(value: PeriodOption) => setSelectedPeriod(value)}>
          <SelectTrigger className="w-[180px] h-8 text-sm">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map(option => <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Insights */}
      <div className="bg-gray-50 rounded-md p-3 mb-4">
        <p className="text-sm text-gray-700">{insightMessage}</p>
      </div>
      
      {/* Chart */}
      <div className="h-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart data={chartData} margin={{
          top: 10,
          right: 15,
          left: 10,
          bottom: 25
        }} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis dataKey="displayName" axisLine={false} tickLine={false} tick={{
            fontSize: isMobile ? 10 : 11
          }} height={25} interval={0} />
            <YAxis axisLine={false} tickLine={false} tick={{
            fontSize: 10
          }} tickFormatter={value => formatCurrencyNoDecimals(value)} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="averageSpending" name="Gasto médio" fill="#E15759" radius={[4, 4, 0, 0]} animationDuration={300} maxBarSize={50} />
          </BarChart>
        </ChartContainer>
      </div>
      
      {/* Legend */}
      
    </div>;
};
export default WeeklySpendingTrendChart;