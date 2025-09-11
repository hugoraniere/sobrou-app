
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { Transaction } from '@/services/transactions';
import BigNumberCard from './BigNumberCard';
import { TEXT } from '@/constants/text';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface DashboardBigNumbersProps {
  transactions: Transaction[];
  totalSavings: number;
}

const DashboardBigNumbers: React.FC<DashboardBigNumbersProps> = ({ 
  transactions,
  totalSavings
}) => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  
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

  // Navigate to transactions page with income filter
  const navigateToIncome = () => {
    navigate('/transactions', { state: { initialFilter: { type: 'income' } } });
  };

  // Navigate to transactions page with expense filter
  const navigateToExpenses = () => {
    navigate('/transactions', { state: { initialFilter: { type: 'expense' } } });
  };
  
  return (
    <div className={cn(
      "grid",
      isMobile ? "grid-cols-1 gap-6" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    )}>
      <BigNumberCard
        title={TEXT.common.income}
        value={totalIncome}
        icon={TrendingUp}
        color="#22c55e"
        trend={{ value: 5, isPositive: true }}
        tooltip={TEXT.dashboard.bigNumbers.monthlyIncomeTooltip}
        onClick={navigateToIncome}
        hideIconOnMobile={true}
        isCurrency={true}
      />
      
      <BigNumberCard
        title={TEXT.common.expense}
        value={totalExpenses}
        icon={TrendingDown}
        color="#ef4444"
        trend={{ value: 3, isPositive: false }}
        tooltip={TEXT.dashboard.bigNumbers.monthlyExpensesTooltip}
        onClick={navigateToExpenses}
        hideIconOnMobile={true}
        isCurrency={true}
      />
      
      <BigNumberCard
        title={TEXT.common.balance}
        value={balance}
        icon={DollarSign}
        color="#3b82f6"
        trend={{ value: 8, isPositive: true }}
        tooltip={TEXT.dashboard.bigNumbers.availableBalanceTooltip}
        hideIconOnMobile={true}
        isCurrency={true}
      />
      
      <BigNumberCard
        title={TEXT.common.savings}
        value={totalSavings}
        icon={Wallet}
        color="#8b5cf6"
        trend={{ value: 4, isPositive: true }}
        tooltip={TEXT.dashboard.bigNumbers.totalSavingsTooltip}
        hideIconOnMobile={true}
        isCurrency={true}
      />
    </div>
  );
};

export default DashboardBigNumbers;
