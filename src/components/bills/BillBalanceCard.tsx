
import React from 'react';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import BigNumberCard from '@/components/dashboard/BigNumberCard';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface BillBalanceCardProps {
  unpaidBillsCount: number;
  paidBillsCount: number; 
  totalAmountToPay: number;
  totalAmountPaid: number;
}

export const BillBalanceCard: React.FC<BillBalanceCardProps> = ({
  unpaidBillsCount,
  paidBillsCount,
  totalAmountToPay,
  totalAmountPaid,
}) => {
  const { isMobile } = useResponsive();

  return (
    <div className={cn(
      "grid gap-3",
      isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
    )}>
      <BigNumberCard
        title="Contas a Pagar"
        value={unpaidBillsCount}
        icon={DollarSign}
        color="#ef4444"
        tooltip="Quantidade de contas pendentes de pagamento"
        hideIconOnMobile={true}
      />
      
      <BigNumberCard
        title="Contas Pagas"
        value={paidBillsCount}
        icon={TrendingUp}
        color="#22c55e"
        tooltip="Quantidade de contas já pagas"
        hideIconOnMobile={true}
      />
      
      <BigNumberCard
        title="Valor a Ser Pago"
        value={totalAmountToPay}
        icon={DollarSign}
        color="#f59e0b"
        tooltip="Valor total das contas pendentes"
        hideIconOnMobile={true}
        isCurrency={true}
      />

      <BigNumberCard
        title="Valor Pago"
        value={totalAmountPaid}
        icon={TrendingUp}
        color="#10b981"
        tooltip="Valor total das contas já pagas"
        hideIconOnMobile={true}
        isCurrency={true}
      />
    </div>
  );
};
