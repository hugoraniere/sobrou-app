
import React from 'react';
import { TransactionService } from '@/services/TransactionService';
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
  const handleDelete = async () => {
    try {
      await TransactionService.deleteTransaction(transactionId);
      setIsOpen(false);
      onTransactionUpdated();
      // Note: The toast with undo button is now handled in TransactionRow.tsx
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Falha ao excluir transação');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Transação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransactionDialog;
