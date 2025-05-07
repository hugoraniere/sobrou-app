
import React from 'react';
import { CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { transactionCategories } from '@/data/categories';

interface CategoryChipProps {
  categoryId: string;
  className?: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ categoryId, className }) => {
  const category = transactionCategories.find(cat => cat.id === categoryId) || {
    id: 'compras',
    name: 'Compras',
    icon: CircleDot,
    color: 'bg-gray-100 text-gray-800'
  };
  
  const IconComponent = category.icon || CircleDot;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
      category.color || "bg-gray-100 text-gray-800",
      className
    )}>
      <IconComponent className="h-3.5 w-3.5" />
      <span>{category.name}</span>
    </div>
  );
};

export default CategoryChip;
