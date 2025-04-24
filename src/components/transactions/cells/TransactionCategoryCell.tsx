
import React from 'react';
import { cn } from '@/lib/utils';
import { transactionCategories } from '@/data/categories';
import { Activity, Wallet, Utensils, Home, CreditCard } from 'lucide-react';

interface TransactionCategoryCellProps {
  category: string;
  className?: string;
}

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'other-income':
    case 'other-expense':
      return <Activity className="h-4 w-4" />;
    case 'salary':
      return <Wallet className="h-4 w-4" />;
    case 'food':
      return <Utensils className="h-4 w-4" />;
    case 'housing':
    case 'moradia':
      return <Home className="h-4 w-4" />;
    case 'credit-card':
      return <CreditCard className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const TransactionCategoryCell: React.FC<TransactionCategoryCellProps> = ({ category, className }) => {
  const categoryData = transactionCategories.find(c => c.id === category || c.value === category) || {
    name: category,
    label: category,
    value: category,
    icon: null
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-2",
        className
      )}
    >
      <span className="flex-shrink-0">
        {getCategoryIcon(categoryData.value)}
      </span>
      <span className="text-sm text-gray-900">{categoryData.label || category}</span>
    </div>
  );
};

export default TransactionCategoryCell;

