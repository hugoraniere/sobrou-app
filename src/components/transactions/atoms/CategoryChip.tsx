
import React from 'react';
import { CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { transactionCategories } from '@/data/categories';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { getCategoryColor } from '@/constants/categoryColors';

interface CategoryChipProps {
  categoryId: string;
  className?: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ categoryId, className }) => {
  // Encontrar a categoria pelo ID ou usar uma categoria padrão
  const category = transactionCategories.find(cat => cat.id === categoryId) || {
    id: 'other',
    name: 'Outros',
    icon: CircleDot,
    color: 'text-gray-500'
  };
  
  // Obter o ícone da categoria utilizando a função auxiliar
  const IconComponent = getCategoryIcon(categoryId);
  
  // Usar a cor específica da categoria do nosso novo sistema de tokens
  const bgColor = getCategoryColor(categoryId);

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium w-fit max-w-full text-white", 
      className
    )}
    style={{ flexShrink: 0, flexGrow: 0, backgroundColor: bgColor }}> {/* Usando a cor como background e texto branco */}
      <IconComponent className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="truncate">{category.name}</span>
    </div>
  );
};

export default CategoryChip;
