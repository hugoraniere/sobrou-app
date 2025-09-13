import React from 'react';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import BigNumberCard from '@/components/dashboard/BigNumberCard';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface BillTransactionBalanceProps {
  originalAmount: number;
  currentBalance: number;
  transactionsTotal: number;
  hasTransactions: boolean;
}

export const BillTransactionBalance: React.FC<BillTransactionBalanceProps> = ({
  originalAmount,
  currentBalance,
  transactionsTotal,
  hasTransactions,
}) => {
  const { isMobile } = useResponsive();
  const isFullyPaid = currentBalance <= 0;
  const hasPartialPayment = hasTransactions && currentBalance > 0 && currentBalance < originalAmount;

  // Status for current balance
  const getBalanceStatus = () => {
    if (isFullyPaid) return 'Quitada';
    if (hasPartialPayment) return 'Pagamento Parcial';
    if (hasTransactions) return 'Com Movimentação';
    return 'Sem Movimentação';
  };

  return (
    <div className={cn(
      "grid gap-3",
      isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
    )}>
      <BigNumberCard
        title="Valor Original"
        value={originalAmount}
        icon={DollarSign}
        color="#3b82f6"
        tooltip="Valor total da conta"
        hideIconOnMobile={true}
        isCurrency={true}
      />
      
      <BigNumberCard
        title="Transações"
        value={Math.abs(transactionsTotal)}
        icon={transactionsTotal < 0 ? TrendingDown : transactionsTotal > 0 ? TrendingUp : DollarSign}
        color={transactionsTotal < 0 ? "#ef4444" : transactionsTotal > 0 ? "#22c55e" : "#6b7280"}
        tooltip="Total de movimentações registradas"
        subtitle={hasTransactions ? undefined : "Nenhuma movimentação"}
        hideIconOnMobile={true}
        isCurrency={true}
      />
      
      <BigNumberCard
        title="Saldo Atual"
        value={Math.max(0, currentBalance)}
        icon={DollarSign}
        color={isFullyPaid ? "#22c55e" : "#f59e0b"}
        tooltip="Valor restante a ser pago"
        subtitle={getBalanceStatus()}
        hideIconOnMobile={true}
        isCurrency={true}
      />
    </div>
  );
};