
import React from 'react';
import { cn } from '@/lib/utils';
import { transactionCategories } from '@/data/categories';
import { Badge } from '@/components/ui/badge';

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
  
  // Use the correct properties for display
  const displayName = categoryData.name || categoryData.label;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 font-medium whitespace-nowrap",
        categoryData.color,
        className
      )}
    >
      {categoryData.icon && (
        <span className="flex items-center justify-center w-3.5 h-3.5">
          {categoryData.icon()}
        </span>
      )}
      <span>{displayName}</span>
    </Badge>
  );
};

export default TransactionCategoryCell;
