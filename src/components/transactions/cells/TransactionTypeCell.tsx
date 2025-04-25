
import React from 'react';
import { TableCell } from "@/components/ui/table";

interface TransactionTypeCellProps {
  type: 'income' | 'expense' | 'transfer';
}

const TransactionTypeCell: React.FC<TransactionTypeCellProps> = ({ type }) => {
  const getTypeLabel = () => {
    switch (type) {
      case 'income':
        return 'Receita';
      case 'expense':
        return 'Despesa';
      case 'transfer':
        return 'Transferência';
      default:
        return type;
    }
  };

  return (
    <TableCell className="min-w-[100px] whitespace-nowrap px-6">
      {getTypeLabel()}
    </TableCell>
  );
};

export default TransactionTypeCell;
