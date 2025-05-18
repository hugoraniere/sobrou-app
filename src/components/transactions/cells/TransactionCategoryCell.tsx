
import React from 'react';
import { TableCell } from "@/components/ui/table";
import { transactionCategories } from '@/data/categories';
import { cn } from '@/lib/utils';
import { CircleDot } from 'lucide-react';
import { getCategoryIcon } from '@/utils/categoryIcons';

interface TransactionCategoryCellProps {
  category: string;
  className?: string;
}

const TransactionCategoryCell: React.FC<TransactionCategoryCellProps> = ({ category, className }) => {
  const safeCategories = Array.isArray(transactionCategories) ? transactionCategories : [];
  
  const categoryData = safeCategories.find(c => c.id === category || c.value === category) || {
    name: 'Outros',
    label: 'Outros',
    value: 'other',
    id: 'other'
  };

  const IconComponent = getCategoryIcon(category);
  
  return (
    <TableCell className={cn("min-w-[140px] whitespace-nowrap", className)}>
      <div className="flex items-center gap-2">
        <span className="flex-shrink-0 bg-gray-200 p-1 rounded-full">
          <IconComponent className="h-4 w-4 text-gray-700" />
        </span>
        <span className="text-sm font-medium">
          {categoryData.label || categoryData.name}
        </span>
      </div>
    </TableCell>
  );
};

export default TransactionCategoryCell;
