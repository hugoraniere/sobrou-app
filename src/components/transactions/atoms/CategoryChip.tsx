
import React from 'react';
import { CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { transactionCategories } from '@/data/categories';
import { getCategoryIcon } from '@/utils/categoryIcons';

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
  
  // Estilização consistente: fundo cinza para todos os chips
  const bgColorClass = 'bg-gray-200';
  const textColorClass = 'text-gray-700';

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium w-fit max-w-full", 
      bgColorClass,
      textColorClass,
      className
    )}
    style={{ flexShrink: 0, flexGrow: 0 }}> {/* Impede a expansão do chip */}
      <IconComponent className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="truncate">{category.name}</span>
    </div>
  );
};

export default CategoryChip;
