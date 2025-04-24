
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryType } from '@/types/categories';

interface CategoryChipProps {
  category: CategoryType;
  onRemove?: () => void;
  className?: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ 
  category,
  onRemove,
  className
}) => {
  const Icon = category.icon;

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium h-[73px]",
        category.color,
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{category.label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-gray-700 transition-colors"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remover categoria</span>
        </button>
      )}
    </div>
  );
};

export default CategoryChip;
