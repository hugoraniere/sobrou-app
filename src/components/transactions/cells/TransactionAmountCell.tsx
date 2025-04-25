
import React from 'react';
import { TableCell } from "@/components/ui/table";
import { formatCurrency } from '@/utils/currencyUtils';
import type { Transaction } from '@/types/component-types';
import { cn } from '@/lib/utils';

interface TransactionAmountCellProps {
  transaction: Transaction;
}

const TransactionAmountCell: React.FC<TransactionAmountCellProps> = ({ transaction }) => {
  return (
    <TableCell className={cn(
      "text-right font-medium px-6",
      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
    )}>
      {formatCurrency(transaction.amount)}
    </TableCell>
  );
};

export default TransactionAmountCell;
