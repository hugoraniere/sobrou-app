
import React, { useState } from 'react';
import { Transaction } from '@/services/transactions';
import TransactionListContent from '@/components/transactions/molecules/TransactionListContent';
import EditTransactionDialog from '@/components/transactions/EditTransactionDialog';
import DeleteTransactionDialog from '@/components/transactions/DeleteTransactionDialog';

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
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleTransactionEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleTransactionDelete = (id: string) => {
    setDeletingTransactionId(id);
    setIsDeleteDialogOpen(true);
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
      
      {editingTransaction && (
        <EditTransactionDialog
          transaction={editingTransaction}
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          onTransactionUpdated={onTransactionUpdated}
        />
      )}
      
      {deletingTransactionId && (
        <DeleteTransactionDialog
          transactionId={deletingTransactionId}
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
          onTransactionUpdated={onTransactionUpdated}
        />
      )}
    </div>
  );
};

export default ModernTransactionList;
