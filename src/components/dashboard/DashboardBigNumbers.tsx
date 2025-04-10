
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wallet, Receipt, TrendingUp, Clock, Database } from 'lucide-react';
import BigNumberCard from './BigNumberCard';
import { Transaction } from '@/services/TransactionService';

interface DashboardBigNumbersProps {
  transactions: Transaction[];
  totalSavings: number;
}

const DashboardBigNumbers: React.FC<DashboardBigNumbersProps> = ({ 
  transactions,
  totalSavings
}) => {
  const { t } = useTranslation();

  // Calculate available balance (income - expenses)
  const calculateBalance = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return income - expenses;
  };

  // Calculate total expenses for current month
  const calculateMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
          date.getMonth() === currentMonth && 
          date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Calculate total income for current month
  const calculateMonthlyIncome = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'income' && 
          date.getMonth() === currentMonth && 
          date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Calculate pending balance (future scheduled transactions)
  const calculatePendingBalance = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        date.setHours(0, 0, 0, 0);
        return date > today;
      })
      .reduce((sum, t) => {
        return sum + (t.type === 'income' ? t.amount : -t.amount);
      }, 0);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <BigNumberCard
        title={t('dashboard.bigNumbers.availableBalance')}
        value={calculateBalance()}
        icon={Wallet}
        color="#22c55e"
        tooltip={t('dashboard.bigNumbers.availableBalanceTooltip')}
        subtitle={t('dashboard.bigNumbers.today')}
      />
      <BigNumberCard
        title={t('dashboard.bigNumbers.monthlyExpenses')}
        value={calculateMonthlyExpenses()}
        icon={Receipt}
        color="#ef4444"
        tooltip={t('dashboard.bigNumbers.monthlyExpensesTooltip')}
        subtitle={t('dashboard.bigNumbers.thisMonth')}
      />
      <BigNumberCard
        title={t('dashboard.bigNumbers.monthlyIncome')}
        value={calculateMonthlyIncome()}
        icon={TrendingUp}
        color="#0ea5e9"
        tooltip={t('dashboard.bigNumbers.monthlyIncomeTooltip')}
        subtitle={t('dashboard.bigNumbers.thisMonth')}
      />
      <BigNumberCard
        title={t('dashboard.bigNumbers.pendingBalance')}
        value={calculatePendingBalance()}
        icon={Clock}
        color="#f97316"
        tooltip={t('dashboard.bigNumbers.pendingBalanceTooltip')}
        subtitle={t('dashboard.bigNumbers.upcoming')}
      />
      <BigNumberCard
        title={t('dashboard.bigNumbers.totalSavings')}
        value={totalSavings}
        icon={Database}
        color="#1a1f2c"
        tooltip={t('dashboard.bigNumbers.totalSavingsTooltip')}
        subtitle={t('dashboard.bigNumbers.accumulated')}
      />
    </div>
  );
};

export default DashboardBigNumbers;
