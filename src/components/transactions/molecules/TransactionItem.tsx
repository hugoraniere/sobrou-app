
import React from 'react';
import { Transaction } from '@/services/transactions';
import TransactionCard from './TransactionCard';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete
}) => {
  return (
    <TransactionCard
      transaction={transaction}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default TransactionItem;
