
import React from 'react';
import { X, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryType } from '@/types/categories';
import { getCategoryColor } from '@/constants/categoryColors';

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
  
  // Usar nossa nova função para obter a cor da categoria
  const bgColor = getCategoryColor(category.id || category.value || 'outros');

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium w-fit max-w-full text-white", // Texto branco para contraste
        className
      )}
      style={{ flexShrink: 0, flexGrow: 0, backgroundColor: bgColor }} // Aplicando a cor como background
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{category.label || category.name || 'Categoria'}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-black/10 p-0.5 rounded-full transition-colors flex-shrink-0"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remover categoria</span>
        </button>
      )}
    </div>
  );
};

export default CategoryChip;
