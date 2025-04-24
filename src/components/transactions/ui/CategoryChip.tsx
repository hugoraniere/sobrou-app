
import React from 'react';
import { X, CircleDot } from 'lucide-react';
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
  // Garantir que o ícone está definido, senão usar um fallback
  const Icon = category.icon || CircleDot;

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium",
        category.color || "bg-gray-100 text-gray-800",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{category.label || category.name || 'Categoria'}</span>
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
