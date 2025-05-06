
import React from 'react';
import { TableCell } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import type { Transaction } from '@/types/component-types';

interface TransactionAmountCellProps {
  transaction: Transaction;
}

const TransactionAmountCell: React.FC<TransactionAmountCellProps> = ({ transaction }) => {
  const formatCurrency = (value: number) => {
    // Sempre formatar com 2 casas decimais, independente de ter decimais ou não
    return `R$${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <TableCell className={cn(
      "text-left font-medium whitespace-nowrap w-[160px]",
      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
    )}>
      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
    </TableCell>
  );
};

export default TransactionAmountCell;
