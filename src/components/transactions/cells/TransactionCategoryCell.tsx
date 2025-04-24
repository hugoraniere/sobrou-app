
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
  // Get category metadata - searching by both id and value for backwards compatibility
  const categoryData = transactionCategories.find(c => c.id === category || c.value === category) || {
    name: category,
    label: category,
    value: category,
    color: 'bg-gray-100 text-gray-800',
    icon: null
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center justify-start gap-2 px-3 py-1 rounded-full text-sm font-medium",
        "transition-colors duration-200",
        "w-auto max-w-full truncate",
        "md:text-sm",
        categoryData.color,
        className
      )}
    >
      {categoryData.icon && (
        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
          {categoryData.icon()}
        </span>
      )}
      <span className="truncate">{categoryData.label || category}</span>
    </div>
  );
};

export default TransactionCategoryCell;
