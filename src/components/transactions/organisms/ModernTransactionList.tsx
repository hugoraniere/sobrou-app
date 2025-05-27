
import React from 'react';
import { Transaction } from '@/services/transactions';
import TransactionListContent from '@/components/transactions/molecules/TransactionListContent';

interface ModernTransactionListProps {
  transactions: Transaction[];
  onTransactionUpdated: () => void;
  className?: string;
  showCardPadding?: boolean;
}

const ModernTransactionList: React.FC<ModernTransactionListProps> = ({
  transactions,
  onTransactionUpdated,
  className = "",
  showCardPadding = false
}) => {
  const handleTransactionEdit = (transaction: Transaction) => {
    // Implementation for editing
    console.log('Edit transaction:', transaction);
  };

  const handleTransactionDelete = (id: string) => {
    // Implementation for deleting
    console.log('Delete transaction:', id);
    onTransactionUpdated();
  };

  return (
    <div className={className}>
      <TransactionListContent
        transactions={transactions}
        onTransactionEdit={handleTransactionEdit}
        onTransactionDelete={handleTransactionDelete}
        isEmpty={transactions.length === 0}
        showCardPadding={showCardPadding}
      />
    </div>
  );
};

export default ModernTransactionList;
