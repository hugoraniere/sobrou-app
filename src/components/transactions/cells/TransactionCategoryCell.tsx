
import React from 'react';
import { cn } from '@/lib/utils';
import { transactionCategories } from '@/data/categories';
import { 
  Gift, 
  PartyPopper, 
  Bolt, 
  Droplet, 
  Wifi, 
  Phone, 
  CreditCard,
  Activity, 
  Wallet, 
  Utensils, 
  Home 
} from 'lucide-react';

interface TransactionCategoryCellProps {
  category: string;
  className?: string;
}

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'gift':
    case 'presente':
      return <Gift className="h-4 w-4" />;
    case 'entertainment':
    case 'entretenimento':
      return <PartyPopper className="h-4 w-4" />;
    case 'utilities':
    case 'utilidades':
      return <Bolt className="h-4 w-4" />;
    case 'water':
    case 'agua':
      return <Droplet className="h-4 w-4" />;
    case 'internet':
      return <Wifi className="h-4 w-4" />;
    case 'phone':
    case 'telefone':
      return <Phone className="h-4 w-4" />;
    case 'credit-card':
    case 'cartao':
      return <CreditCard className="h-4 w-4" />;
    case 'salary':
      return <Wallet className="h-4 w-4" />;
    case 'food':
    case 'alimentacao':
      return <Utensils className="h-4 w-4" />;
    case 'housing':
    case 'moradia':
      return <Home className="h-4 w-4" />;
    case 'other-income':
    case 'other-expense':
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
        "h-12 flex items-center",
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-[120px]">
        <span className="flex-shrink-0">
          {getCategoryIcon(categoryData.value)}
        </span>
        <span className="text-sm font-medium text-gray-900">
          {categoryData.label || category}
        </span>
      </div>
    </div>
  );
};

export default TransactionCategoryCell;

