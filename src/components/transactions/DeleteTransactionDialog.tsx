
import React from 'react';
import { TransactionService } from '@/services/transactions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

interface DeleteTransactionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  transactionId: string;
  onTransactionUpdated: () => void;
}

const DeleteTransactionDialog: React.FC<DeleteTransactionDialogProps> = ({
  isOpen,
  setIsOpen,
  transactionId,
  onTransactionUpdated
}) => {
  const { t } = useTranslation();
  
  const handleDelete = async () => {
    try {
      await TransactionService.deleteTransaction(transactionId);
      setIsOpen(false);
      onTransactionUpdated();
      // Note: The toast with undo button is now handled in TransactionRow.tsx
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error(t('transactions.deleteError', 'Falha ao excluir transação'));
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('transactions.deleteTitle', 'Excluir Transação')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('transactions.deleteConfirmation', 'Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel', 'Cancelar')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            {t('transactions.delete', 'Excluir')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransactionDialog;
