
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction, TransactionService } from '@/services/TransactionService';
import { transactionCategories } from '@/data/categories';
import EditTransactionDialog from './EditTransactionDialog';
import DeleteTransactionDialog from './DeleteTransactionDialog';
import { RepeatIcon, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface TransactionRowProps {
  transaction: Transaction;
  onToggleRecurring: (id: string, isRecurring: boolean) => void;
  formatDate: (dateString: string) => string;
  onTransactionUpdated: () => void;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ 
  transaction, 
  onToggleRecurring,
  formatDate,
  onTransactionUpdated
}) => {
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
    // Armazenar a transação a ser excluída para possível restauração
    setDeletedTransaction({ ...transaction });
  };

  const handleToggleRecurring = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Since is_recurring column doesn't exist in the database schema,
      // we'll just call the onToggleRecurring callback to update the UI state
      // without actually persisting the change to the database
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
        // Recriar a transação excluída
        const { id, created_at, user_id, ...transactionData } = deletedTransaction;
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

  // Encontrar o componente Icon da categoria
  const categoryInfo = transactionCategories.find(cat => cat.id === transaction.category);
  const CategoryIcon = categoryInfo?.icon;

  return (
    <>
      <TableRow 
        key={transaction.id} 
        className="cursor-pointer hover:bg-gray-50 relative group"
        onClick={handleEdit}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <TableCell>{formatDate(transaction.date)}</TableCell>
        <TableCell>
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          )}>
            {transaction.type === 'income' ? t('common.income', 'Receita') : t('common.expense', 'Despesa')}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {CategoryIcon && <CategoryIcon className="h-4 w-4" />}
            {categoryInfo?.name || transaction.category}
          </div>
        </TableCell>
        <TableCell>{transaction.description}</TableCell>
        <TableCell className={cn(
          "text-right font-medium",
          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
        )}>
          {transaction.type === 'income' ? '+' : '-'}R${transaction.amount.toFixed(2)}
        </TableCell>
        <TableCell className="text-center relative">
          <div 
            className={cn(
              "cursor-pointer",
              isHovered || transaction.is_recurring ? 'opacity-100' : 'opacity-0',
              "group-hover:opacity-100 transition-opacity"
            )}
            onClick={handleToggleRecurring}
            title={transaction.is_recurring ? t('transactions.removeRecurring', "Click to remove recurring") : t('transactions.setRecurring', "Click to set as recurring")}
          >
            <RepeatIcon 
              className={cn(
                "h-4 w-4",
                transaction.is_recurring ? 'text-blue-500' : 'text-gray-400'
              )}
            />
          </div>
        </TableCell>
        
        {/* Desktop Delete Button that appears on hover */}
        <div 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden group-hover:block"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700 cursor-pointer" />
        </div>
      </TableRow>

      {/* Edit Transaction Dialog */}
      <EditTransactionDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        transaction={transaction}
        onTransactionUpdated={onTransactionUpdated}
      />

      {/* Delete Transaction Dialog */}
      <DeleteTransactionDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        transactionId={transaction.id}
        onTransactionUpdated={() => {
          onTransactionUpdated();
          
          // Show toast with undo button that will actually restore the transaction
          toast({
            title: t('transactions.deleteSuccess', "Transação excluída"),
            description: t('transactions.deleteDescription', "Sua transação foi excluída."),
            action: (
              <button
                onClick={handleUndoDelete}
                className="text-blue-500 underline hover:text-blue-700"
              >
                {t('transactions.undo', "Desfazer")}
              </button>
            ),
            duration: 10000, // 10 seconds
          });
        }}
      />
    </>
  );
};

export default TransactionRow;
