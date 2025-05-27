
import React from 'react';
import { Transaction } from '@/services/transactions';
import TransactionCard from './TransactionCard';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  showCardPadding?: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete,
  showCardPadding = false
}) => {
  return (
    <TransactionCard
      transaction={transaction}
      onEdit={onEdit}
      onDelete={onDelete}
      showCardPadding={showCardPadding}
    />
  );
};

export default TransactionItem;
