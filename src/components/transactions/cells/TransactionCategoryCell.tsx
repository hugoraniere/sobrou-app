
import React from 'react';
import { cn } from '@/lib/utils';
import { transactionCategories } from '@/data/categories';

interface TransactionCategoryCellProps {
  category: string;
  className?: string;
}

/**
 * Component to display a transaction category with appropriate styling
 */
const TransactionCategoryCell: React.FC<TransactionCategoryCellProps> = ({ category, className }) => {
  // Get category metadata
  const categoryData = transactionCategories.find(c => c.value === category || c.id === category) || {
    label: category,
    value: category,
    color: 'bg-gray-100 text-gray-800',
    icon: null
  };
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
      categoryData.color,
      className
    )}>
      {categoryData.icon && (
        <span className="w-3 h-3">{categoryData.icon()}</span>
      )}
      {categoryData.label}
    </div>
  );
};

export default TransactionCategoryCell;
