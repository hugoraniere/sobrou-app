
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TableCell } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import type { Transaction } from '@/types/component-types';

interface TransactionTypeCellProps {
  type: Transaction['type'];
}

const TransactionTypeCell: React.FC<TransactionTypeCellProps> = ({ type }) => {
  const { t } = useTranslation();

  return (
    <TableCell>
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      )}>
        {type === 'income' 
          ? t('common.income', 'Receita') 
          : t('common.expense', 'Despesa')}
      </span>
    </TableCell>
  );
};

export default TransactionTypeCell;

