
import React from 'react';
import { Transaction } from '@/services/transactions';
import { useDailyChartData } from '@/hooks/useDailyChartData';
import { DailyChartContainer } from './DailyChartContainer';

interface DailyBarChartProps {
  transactions: Transaction[];
}

const DailyBarChart: React.FC<DailyBarChartProps> = ({ transactions }) => {
  const { dailyData, getInsightMessage } = useDailyChartData(transactions);
  
  // Chart configuration
  const chartConfig = {
    income: {
      label: "Receita",
      theme: {
        light: "#22c55e",
        dark: "#22c55e"
      }
    },
    expense: {
      label: "Despesa",
      theme: {
        light: "#ef4444",
        dark: "#ef4444"
      }
    },
    balance: {
      label: "Saldo",
      theme: {
        light: "#3b82f6",
        dark: "#3b82f6"
      }
    }
  };
  
  // If no data, return null for the component parent to show EmptyStateMessage
  if (dailyData.length === 0) {
    return null;
  }

  return (
    <div className="h-full w-full">
      {/* Insight message */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm">
        <p>{getInsightMessage()}</p>
      </div>
      
      <DailyChartContainer 
        data={dailyData}
        config={chartConfig}
      />
    </div>
  );
};

export default DailyBarChart;
