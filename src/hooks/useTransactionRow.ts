
import { useState } from 'react';
import { Transaction } from '@/types/component-types';
import { TransactionService } from '@/services/transactions';
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
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
    try {
      onToggleRecurring(transaction.id, !transaction.is_recurring);
      
      toast({
        title: transaction.is_recurring 
          ? t('transactions.recurringRemoved', 'Recorrência removida') 
          : t('transactions.recurringSet', 'Marcada como recorrente'),
        description: transaction.is_recurring 
          ? t('transactions.recurringRemovedDesc', 'A transação não é mais recorrente') 
          : t('transactions.recurringSetDesc', 'A transação foi marcada como recorrente'),
      });
    } catch (error) {
      console.error('Erro ao atualizar recorrência:', error);
      toast({
        title: t('transactions.updateError', 'Erro ao atualizar recorrência'),
        variant: "destructive"
      });
    }
  };

  const handleUndoDelete = async () => {
    if (deletedTransaction) {
      try {
        const { id, created_at, ...transactionData } = deletedTransaction;
        await TransactionService.addTransaction(transactionData);
        
        toast({
          title: t('transactions.restoreSuccess', "Transação restaurada"),
          description: t('transactions.restoreDescription', "Sua transação foi restaurada.")
        });
        
        onTransactionUpdated();
      } catch (error) {
        console.error('Erro ao restaurar transação:', error);
        toast({
          title: t('common.error', "Erro"),
          description: t('transactions.restoreError', "Erro ao restaurar transação"),
          variant: "destructive"
        });
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

