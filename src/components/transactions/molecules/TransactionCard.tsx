
import React from 'react';
import { Transaction } from '@/services/transactions';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useResponsive } from '@/hooks/useResponsive';
import TransactionCardMobile from './TransactionCardMobile';
import TransactionCardDesktop from './TransactionCardDesktop';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  showActions?: boolean;
  showCardPadding?: boolean;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
  showActions = true,
  showCardPadding = false
}) => {
  const { isMobile } = useResponsive();

  return (
    <TooltipProvider>
      {isMobile ? (
        <TransactionCardMobile
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
          showCardPadding={showCardPadding}
        />
      ) : (
        <TransactionCardDesktop
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
        />
      )}
    </TooltipProvider>
  );
};

export default TransactionCard;
