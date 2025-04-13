
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction } from '@/services/TransactionService';
import { RepeatIcon, PencilIcon, Trash2 } from "lucide-react";
import { transactionCategories } from '@/data/categories';
import TransactionActions from './TransactionActions';
import EditTransactionDialog from './EditTransactionDialog';
import DeleteTransactionDialog from './DeleteTransactionDialog';

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

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const CategoryIcon = transactionCategories.find(cat => cat.id === transaction.category)?.icon;

  return (
    <>
      <TableRow 
        key={transaction.id} 
        className="cursor-pointer hover:bg-gray-50"
        onClick={handleEdit}
      >
        <TableCell>{formatDate(transaction.date)}</TableCell>
        <TableCell>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {transaction.type === 'income' ? 'Receita' : 'Despesa'}
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
        <TableCell>
          {transaction.is_recurring && (
            <div className="flex items-center justify-center">
              <RepeatIcon className="h-4 w-4 text-blue-500" />
            </div>
          )}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <TransactionActions 
            transaction={transaction}
            onEdit={handleEdit}
            onToggleRecurring={onToggleRecurring}
            onDelete={() => setIsDeleteDialogOpen(true)}
          />
        </TableCell>
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
        onTransactionUpdated={onTransactionUpdated}
      />
    </>
  );
};

export default TransactionRow;
