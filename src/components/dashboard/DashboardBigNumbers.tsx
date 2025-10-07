
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Receipt, Target, TrendingUpIcon } from 'lucide-react';
import { Transaction } from '@/services/transactions';
import BigNumberCard from './BigNumberCard';
import { ProgressCard } from './widgets/ProgressCard';
import { TEXT } from '@/constants/text';
import { useNavigate } from 'react-router-dom';
import { useResponsive } from '@/hooks/useResponsive';
import { useMEIDashboard } from '@/hooks/useMEIDashboard';
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
  const { dashboardData } = useMEIDashboard();
  
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

  // Navigate to bills page with upcoming filter
  const navigateToUpcomingBills = () => {
    navigate('/bills');
  };

  // Navigate to MEI settings
  const navigateToMEISettings = () => {
    navigate('/settings', { state: { tab: 'mei' } });
  };
  
  return (
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    )}>
      {/* M1: Cards MEI Essenciais */}
      <BigNumberCard
        title="Receita do Mês"
        value={dashboardData.revenue}
        icon={TrendingUp}
        color="#22c55e"
        tooltip="Receita total do mês atual"
        onClick={navigateToIncome}
        hideIconOnMobile={true}
        isCurrency={true}
      />
      
      <BigNumberCard
        title="Custos do Mês"
        value={dashboardData.costs}
        icon={TrendingDown}
        color="#ef4444"
        tooltip="Custos totais do mês atual"
        onClick={navigateToExpenses}
        hideIconOnMobile={true}
        isCurrency={true}
      />
      
      <BigNumberCard
        title="Lucro do Mês"
        value={dashboardData.profit}
        icon={DollarSign}
        color={dashboardData.profit >= 0 ? "#22c55e" : "#ef4444"}
        tooltip="Receita - Custos do mês atual"
        hideIconOnMobile={true}
        isCurrency={true}
      />
      
      <BigNumberCard
        title="Margem"
        value={dashboardData.margin}
        icon={TrendingUpIcon}
        color="#8b5cf6"
        tooltip="Percentual de lucro sobre a receita"
        hideIconOnMobile={true}
        isCurrency={false}
        subtitle={`${dashboardData.margin.toFixed(1)}% de margem`}
      />

      <BigNumberCard
        title="Impostos a Reservar"
        value={dashboardData.taxReserve}
        icon={Receipt}
        color="#f59e0b"
        tooltip="Valor estimado de impostos sobre a receita do mês"
        onClick={navigateToMEISettings}
        hideIconOnMobile={true}
        isCurrency={true}
      />

      <BigNumberCard
        title="A Pagar (15 dias)"
        value={dashboardData.upcomingPayments.total}
        icon={Receipt}
        color="#06b6d4"
        tooltip="Contas a pagar nos próximos 15 dias"
        onClick={navigateToUpcomingBills}
        hideIconOnMobile={true}
        isCurrency={true}
        subtitle={`${dashboardData.upcomingPayments.count} conta(s)`}
      />

      <ProgressCard
        title="Progresso Anual"
        current={dashboardData.annualProgress.current}
        total={dashboardData.annualProgress.limit}
        icon={Target}
        color={dashboardData.annualProgress.percentage > 90 ? "text-destructive" : "text-primary"}
        tooltip="Faturamento acumulado no ano vs limite MEI"
        onClick={navigateToMEISettings}
      />

      <BigNumberCard
        title="Economias"
        value={totalSavings}
        icon={Wallet}
        color="#8b5cf6"
        tooltip={TEXT.dashboard.bigNumbers.totalSavingsTooltip}
        hideIconOnMobile={true}
        isCurrency={true}
      />
    </div>
  );
};

export default DashboardBigNumbers;
