
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction, TransactionService } from '@/services/TransactionService';
import { transactionCategories } from '@/data/categories';
import EditTransactionDialog from './EditTransactionDialog';
import DeleteTransactionDialog from './DeleteTransactionDialog';
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import RecurringIndicator from './ui/RecurringIndicator';
import DeleteIndicator from './ui/DeleteIndicator';
import type { TransactionRowProps } from '@/types/component-types';

const TransactionRow: React.FC<TransactionRowProps> = ({ 
  transaction, 
  onToggleRecurring,
  formatDate,
  onTransactionUpdated,
  className
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [deletedTransaction, setDeletedTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Usando o getter para normalizar o acesso à propriedade is_recurring/isRecurring
  const getIsRecurring = (tx: Transaction): boolean => {
    return tx.isRecurring || tx.is_recurring || false;
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
    // Armazenar a transação a ser excluída para possível restauração
    if (transaction) {
      setDeletedTransaction({ ...transaction });
    }
  };

  const handleToggleRecurring = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Since is_recurring column doesn't exist in the database schema,
      // we'll just call the onToggleRecurring callback to update the UI state
      // without actually persisting the change to the database
      onToggleRecurring(transaction.id, !getIsRecurring(transaction));
      
      toast({
        title: getIsRecurring(transaction) 
          ? t('transactions.recurringRemoved', 'Recorrência removida') 
          : t('transactions.recurringSet', 'Marcada como recorrente'),
        description: getIsRecurring(transaction) 
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
  
  // Formatação de valor em reais com vírgula apenas quando houver decimal
  const formatCurrency = (value: number) => {
    // Verifica se tem casas decimais
    const hasDecimals = value % 1 !== 0;
    
    if (hasDecimals) {
      // Formatação com vírgula e duas casas decimais
      return `R$${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      // Formatação sem casas decimais
      return `R$${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  };

  return (
    <>
      <TableRow 
        key={transaction.id} 
        className={cn("cursor-pointer hover:bg-gray-50 relative group", className)}
        onClick={() => setIsEditDialogOpen(true)}
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
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </TableCell>
        <TableCell className="text-center relative">
          <RecurringIndicator 
            isRecurring={getIsRecurring(transaction)} 
            onToggle={(e) => {
              e.stopPropagation();
              onToggleRecurring(transaction.id, !getIsRecurring(transaction));
            }}
            isHovered={isHovered}
          />
        </TableCell>
        
        {/* Desktop Delete Button that appears on hover */}
        <DeleteIndicator onDelete={(e) => {
          e.stopPropagation();
          setIsDeleteDialogOpen(true);
          if (transaction) {
            setDeletedTransaction({ ...transaction });
          }
        }} />
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
                onClick={() => {
                  if (deletedTransaction) {
                    const { id, created_at, user_id, ...transactionData } = deletedTransaction;
                    TransactionService.addTransaction(transactionData)
                      .then(() => {
                        onTransactionUpdated();
                        toast({
                          title: t('transactions.restoreSuccess', "Transação restaurada"),
                          description: t('transactions.restoreDescription', "Sua transação foi restaurada.")
                        });
                      })
                      .catch(error => {
                        console.error('Erro ao restaurar transação:', error);
                        toast({
                          title: t('common.error', "Erro"),
                          description: t('transactions.restoreError', "Erro ao restaurar transação"),
                          variant: "destructive"
                        });
                      });
                  }
                }}
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
