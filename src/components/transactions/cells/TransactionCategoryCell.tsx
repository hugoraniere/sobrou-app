
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
      return <Activity className="w-5 h-5" />;
    case 'salary':
      return <Wallet className="w-5 h-5" />;
    case 'food':
      return <Utensils className="w-5 h-5" />;
    case 'housing':
    case 'moradia':
      return <Home className="w-5 h-5" />;
    case 'credit-card':
      return <CreditCard className="w-5 h-5" />;
    default:
      return <Activity className="w-5 h-5" />;
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
        "flex items-center gap-3 text-gray-900",
        "text-sm",
        className
      )}
    >
      <span className="flex-shrink-0">
        {getCategoryIcon(categoryData.value)}
      </span>
      <span>{categoryData.label || category}</span>
    </div>
  );
};

export default TransactionCategoryCell;

