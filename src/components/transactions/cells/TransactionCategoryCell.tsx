import React from 'react';
import { TableCell } from "@/components/ui/table";
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
  Home,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionCategoryCellProps {
  category: string;
  className?: string;
}

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'gift':
    case 'presente':
    case 'donation':
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
    case 'credit_card':
    case 'credit-card':
    case 'cartao':
      return <CreditCard className="h-4 w-4" />;
    case 'salary':
    case 'income':
      return <Wallet className="h-4 w-4" />;
    case 'food':
    case 'alimentacao':
      return <Utensils className="h-4 w-4" />;
    case 'housing':
    case 'moradia':
      return <Home className="h-4 w-4" />;
    case 'other-income':
    case 'other-expense':
    case 'other':
    case 'shopping':
      return <Activity className="h-4 w-4" />;
    default:
      return <Tag className="h-4 w-4" />;
  }
};

const getCategoryLabel = (category: string, defaultLabel: string) => {
  if (category === 'credit_card' || category === 'credit-card' || category === 'cartao') {
    return 'Cartão de crédito';
  }
  return defaultLabel;
};

const TransactionCategoryCell: React.FC<TransactionCategoryCellProps> = ({ category, className }) => {
  const safeCategories = Array.isArray(transactionCategories) ? transactionCategories : [];
  
  const categoryData = safeCategories.find(c => c.id === category || c.value === category) || {
    name: category || 'Outros',
    label: category || 'Outros',
    value: category || 'other',
    icon: null
  };
  
  const displayLabel = getCategoryLabel(categoryData.value || '', categoryData.label || category || 'Outros');

  return (
    <TableCell className={className}>
      <div className="flex items-center gap-2">
        <span className="flex-shrink-0">
          {getCategoryIcon(categoryData.value || '')}
        </span>
        <span className="text-sm font-medium">
          {displayLabel}
        </span>
      </div>
    </TableCell>
  );
};

export default TransactionCategoryCell;
