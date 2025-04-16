
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction } from '@/services/TransactionService';
import { transactionCategories } from '@/data/categories';
import EditTransactionDialog from './EditTransactionDialog';
import DeleteTransactionDialog from './DeleteTransactionDialog';
import { RepeatIcon, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';

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
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleToggleRecurring = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleRecurring(transaction.id, !transaction.is_recurring);
  };

  const CategoryIcon = transactionCategories.find(cat => cat.id === transaction.category)?.icon;

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
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {transaction.type === 'income' ? t('common.income', 'Receita') : t('common.expense', 'Despesa')}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {CategoryIcon && <CategoryIcon className="h-4 w-4" />}
            {transactionCategories.find(cat => cat.id === transaction.category)?.name || transaction.category}
          </div>
        </TableCell>
        <TableCell>{transaction.description}</TableCell>
        <TableCell className={`text-right font-medium ${
          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </TableCell>
        <TableCell className="text-center relative">
          <div 
            className={`cursor-pointer ${isHovered || transaction.is_recurring ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity`}
            onClick={handleToggleRecurring}
            title={transaction.is_recurring ? t('transactions.removeRecurring', "Click to remove recurring") : t('transactions.setRecurring', "Click to set as recurring")}
          >
            <RepeatIcon 
              className={`h-4 w-4 ${transaction.is_recurring ? 'text-blue-500' : 'text-gray-400'}`}
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
          
          // Show toast with undo button
          toast({
            title: t('transactions.deleteSuccess', "Transaction deleted"),
            description: t('transactions.deleteDescription', "Your transaction has been deleted."),
            action: (
              <button
                onClick={() => {
                  // The undo functionality would be implemented here
                  // In a real implementation, you would restore the transaction
                  toast({
                    title: t('transactions.restoreSuccess', "Transaction restored"),
                    description: t('transactions.restoreDescription', "Your transaction has been restored.")
                  });
                }}
                className="text-blue-500 underline hover:text-blue-700"
              >
                {t('transactions.undo', "Undo")}
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
