
import React from 'react';
import { TableCell } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import type { Transaction } from '@/types/component-types';

interface TransactionAmountCellProps {
  transaction: Transaction;
}

const TransactionAmountCell: React.FC<TransactionAmountCellProps> = ({ transaction }) => {
  const formatCurrency = (value: number) => {
    const hasDecimals = value % 1 !== 0;
    
    if (hasDecimals) {
      return `R$${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `R$${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  };

  return (
    <TableCell className={cn(
      "text-right font-medium whitespace-nowrap w-[160px]",
      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
    )}>
      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
    </TableCell>
  );
};

export default TransactionAmountCell;
