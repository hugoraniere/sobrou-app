
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

  // Calculate month-over-month trends
  const calculateTrend = (type: 'income' | 'expense') => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get previous month
    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;
    if (previousMonth < 0) {
      previousMonth = 11;
      previousYear -= 1;
    }
    
    // Calculate current month total
    const currentTotal = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === type && 
          date.getMonth() === currentMonth && 
          date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
      
    // Calculate previous month total
    const previousTotal = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === type && 
          date.getMonth() === previousMonth && 
          date.getFullYear() === previousYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
      
    // Calculate percentage change
    if (previousTotal === 0) return { value: 0, isPositive: true };
    
    const change = ((currentTotal - previousTotal) / previousTotal) * 100;
    return {
      value: Math.abs(Math.round(change)),
      isPositive: type === 'income' ? change > 0 : change < 0
    };
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <BigNumberCard
        title={t('dashboard.bigNumbers.availableBalance', 'Saldo Atual')}
        value={calculateBalance()}
        icon={Wallet}
        color="#3b82f6" // Azul para saldo
        tooltip={t('dashboard.bigNumbers.availableBalanceTooltip', 'Total disponível (receitas - despesas)')}
        subtitle={t('dashboard.bigNumbers.today', 'Hoje')}
      />
      <BigNumberCard
        title={t('dashboard.bigNumbers.monthlyIncome', 'Receitas do Mês')}
        value={calculateMonthlyIncome()}
        icon={TrendingUp}
        color="#22c55e" // Verde para receitas
        tooltip={t('dashboard.bigNumbers.monthlyIncomeTooltip', 'Total de receitas no mês atual')}
        subtitle={t('dashboard.bigNumbers.thisMonth', 'Este mês')}
        trend={calculateTrend('income')}
      />
      <BigNumberCard
        title={t('dashboard.bigNumbers.monthlyExpenses', 'Despesas do Mês')}
        value={calculateMonthlyExpenses()}
        icon={Receipt}
        color="#ef4444" // Vermelho para despesas
        tooltip={t('dashboard.bigNumbers.monthlyExpensesTooltip', 'Total de despesas no mês atual')}
        subtitle={t('dashboard.bigNumbers.thisMonth', 'Este mês')}
        trend={calculateTrend('expense')}
      />
      <BigNumberCard
        title={t('dashboard.bigNumbers.pendingBalance', 'Saldo Previsto')}
        value={calculatePendingBalance()}
        icon={Clock}
        color="#3b82f6" // Azul para saldo previsto
        tooltip={t('dashboard.bigNumbers.pendingBalanceTooltip', 'Saldo incluindo transações futuras')}
        subtitle={t('dashboard.bigNumbers.upcoming', 'Pendentes')}
      />
    </div>
  );
};

export default DashboardBigNumbers;
