
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { Transaction } from '@/services/transactions';
import BigNumberCard from './BigNumberCard';
import { TEXT } from '@/constants/text';

interface DashboardBigNumbersProps {
  transactions: Transaction[];
  totalSavings: number;
}

const DashboardBigNumbers: React.FC<DashboardBigNumbersProps> = ({ 
  transactions,
  totalSavings
}) => {
  // Calculate total income
  const totalIncome = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  // Calculate total expenses
  const totalExpenses = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  // Calculate balance
  const balance = totalIncome - totalExpenses;
  
  return (
    <div className="flex flex-wrap gap-6">
      <BigNumberCard
        title={TEXT.common.income}
        value={totalIncome}
        icon={TrendingUp}
        color="#22c55e"
        trend={{ value: 5, isPositive: true }}
        tooltip={TEXT.dashboard.bigNumbers.monthlyIncomeTooltip}
      />
      
      <BigNumberCard
        title={TEXT.common.expense}
        value={totalExpenses}
        icon={TrendingDown}
        color="#ef4444"
        trend={{ value: 3, isPositive: false }}
        tooltip={TEXT.dashboard.bigNumbers.monthlyExpensesTooltip}
      />
      
      <BigNumberCard
        title={TEXT.common.balance}
        value={balance}
        icon={DollarSign}
        color="#3b82f6"
        trend={{ value: 8, isPositive: true }}
        tooltip={TEXT.dashboard.bigNumbers.availableBalanceTooltip}
      />
      
      <BigNumberCard
        title={TEXT.common.savings}
        value={totalSavings}
        icon={Wallet}
        color="#8b5cf6"
        trend={{ value: 4, isPositive: true }}
        tooltip={TEXT.dashboard.bigNumbers.totalSavingsTooltip}
      />
    </div>
  );
};

export default DashboardBigNumbers;
