
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import type { TransactionRowProps } from '@/types/component-types';
import TransactionTypeCell from './cells/TransactionTypeCell';
import TransactionCategoryCell from './cells/TransactionCategoryCell';
import TransactionAmountCell from './cells/TransactionAmountCell';
import EditTransactionDialog from './EditTransactionDialog';
import DeleteTransactionDialog from './DeleteTransactionDialog';
import ActionsCell from './cells/ActionsCell';
import { useTransactionRow } from '@/hooks/useTransactionRow';

const TransactionRow: React.FC<TransactionRowProps> = ({ 
  transaction, 
  onToggleRecurring,
  formatDate,
  onTransactionUpdated,
  className
}) => {
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete,
    handleToggleRecurring,
  } = useTransactionRow(transaction, onToggleRecurring, onTransactionUpdated);

  return (
    <>
      <TableRow 
        className={cn("hover:bg-gray-50 relative", className)}
        onClick={() => setIsEditDialogOpen(true)}
      >
        <TableCell>{formatDate(transaction.date)}</TableCell>
        <TransactionTypeCell type={transaction.type} />
        <TransactionCategoryCell category={transaction.category} />
        <TableCell>{transaction.description}</TableCell>
        <TransactionAmountCell transaction={transaction} />
        <TableCell onClick={(e) => e.stopPropagation()}>
          <ActionsCell
            isRecurring={transaction.is_recurring || false}
            onToggleRecurring={handleToggleRecurring}
            onDelete={handleDelete}
          />
        </TableCell>
      </TableRow>

      <EditTransactionDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        transaction={transaction}
        onTransactionUpdated={onTransactionUpdated}
      />

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

