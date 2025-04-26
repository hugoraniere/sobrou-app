
import React from 'react';
import { Card } from '@/components/ui/card';

interface FinancialMetricsCardProps {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
}

const FinancialMetricsCard: React.FC<FinancialMetricsCardProps> = ({
  totalExpenses,
  totalIncome,
  balance
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
      <p className="text-3xl font-bold text-gray-800">${totalExpenses.toFixed(2)}</p>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Income</span>
          <span className="font-medium">${totalIncome.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Balance</span>
          <span className={`font-medium ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${balance.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancialMetricsCard;
