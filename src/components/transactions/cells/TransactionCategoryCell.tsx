
import React from 'react';
import { TableCell } from "@/components/ui/table";
import { transactionCategories } from '@/data/categories';
import { cn } from '@/lib/utils';
import type { Transaction, StandardProps } from '@/types/component-types';

interface TransactionCategoryCellProps extends StandardProps {
  category: Transaction['category'];
}

const TransactionCategoryCell: React.FC<TransactionCategoryCellProps> = ({ category, className }) => {
  const categoryInfo = transactionCategories.find(cat => cat.id === category);
  const CategoryIcon = categoryInfo?.icon;

  return (
    <TableCell className={className}>
      <div className="flex items-center gap-2">
        {CategoryIcon && <CategoryIcon className="h-4 w-4" />}
        {categoryInfo?.name || category}
      </div>
    </TableCell>
  );
};

export default TransactionCategoryCell;
