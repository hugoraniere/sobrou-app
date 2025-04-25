
import React from 'react';
import { TableCell } from "@/components/ui/table";
import { transactionCategories } from '@/data/categories';
import { cn } from '@/lib/utils';

interface TransactionCategoryCellProps {
  category: string;
  className?: string;
}

const TransactionCategoryCell: React.FC<TransactionCategoryCellProps> = ({ category, className }) => {
  const safeCategories = Array.isArray(transactionCategories) ? transactionCategories : [];
  
  const categoryData = safeCategories.find(c => c.id === category || c.value === category) || {
    name: 'Compras',
    label: 'Compras',
    value: 'compras',
    icon: null
  };

  const Icon = categoryData.icon;
  
  return (
    <TableCell className={cn("min-w-[140px] whitespace-nowrap", className)}>
      <div className="flex items-center gap-2">
        <span className="flex-shrink-0">
          {Icon && <Icon className="h-4 w-4" />}
        </span>
        <span className="text-sm font-medium">
          {categoryData.label}
        </span>
      </div>
    </TableCell>
  );
};

export default TransactionCategoryCell;
