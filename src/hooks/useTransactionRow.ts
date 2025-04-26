
import { useState } from 'react';
import { Transaction } from '@/types/component-types';
import { TransactionService } from '@/services/transactions';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useTransactionRow = (
  transaction: Transaction,
  onToggleRecurring: (id: string, isRecurring: boolean) => void,
  onTransactionUpdated: () => void
) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [deletedTransaction, setDeletedTransaction] = useState<Transaction | null>(null);
  const { t } = useTranslation();

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
    setDeletedTransaction({ ...transaction });
  };

  const handleToggleRecurring = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIsRecurring = !transaction.is_recurring;
    
    try {
      // Optimistic update
      onToggleRecurring(transaction.id, newIsRecurring);
      
      // Update in database
      await TransactionService.updateTransaction(transaction.id, {
        is_recurring: newIsRecurring,
        recurrence_frequency: newIsRecurring ? 'monthly' : undefined
      });
      
      toast.success(newIsRecurring 
        ? t('transactions.setRecurring', 'Marcada como recorrente')
        : t('transactions.removeRecurring', 'Recorrência removida')
      );
      
      onTransactionUpdated();
    } catch (error) {
      // Revert optimistic update on error
      onToggleRecurring(transaction.id, transaction.is_recurring);
      
      console.error('Error updating recurring status:', error);
      toast.error(t('transactions.updateError', 'Erro ao atualizar recorrência'));
    }
  };

  const handleUndoDelete = async () => {
    if (deletedTransaction) {
      try {
        await TransactionService.addTransaction({
          ...deletedTransaction,
          id: undefined
        });
        
        toast.success(t('transactions.restoreSuccess', "Transação restaurada"));
        onTransactionUpdated();
      } catch (error) {
        console.error('Error restoring transaction:', error);
        toast.error(t('transactions.restoreError', "Erro ao restaurar transação"));
      }
    }
  };

  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isHovered,
    setIsHovered,
    deletedTransaction,
    handleEdit,
    handleDelete,
    handleToggleRecurring,
    handleUndoDelete
  };
};
