
import React from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  ReferenceLine
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DailyData, ChartConfig } from '@/types/charts';
import { TEXT } from '@/constants/text';

interface DailyChartContainerProps {
  data: DailyData[];
  config: ChartConfig;
}

export const DailyChartContainer: React.FC<DailyChartContainerProps> = ({
  data,
  config
}) => {
  return (
    <div className="h-[220px] w-full">
      <ChartContainer className="h-full w-full" config={config}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="day" 
            height={40}
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            tickFormatter={(value) => `R$${value}`}
            width={50}
            tick={{ fontSize: 11 }}
          />
          <ReferenceLine y={0} stroke="#666" />
          <ChartTooltip
            content={({ active, payload }) => 
              active && payload && payload.length ? (
                <ChartTooltipContent 
                  payload={payload} 
                  formatter={(value) => `R$${value}`}
                />
              ) : null
            }
          />
          <Legend 
            verticalAlign="bottom"
            height={36}
          />
          <Bar 
            dataKey="income" 
            name={TEXT.common.income} 
            fill="#22c55e" 
            maxBarSize={15} 
          />
          <Bar 
            dataKey="expense" 
            name={TEXT.common.expense} 
            fill="#ef4444" 
            maxBarSize={15} 
          />
          <Line 
            type="monotone" 
            dataKey="cumulativeBalance" 
            name={TEXT.common.balance} 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
};
