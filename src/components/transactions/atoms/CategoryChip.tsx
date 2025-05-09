
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
    color: 'text-gray-500'
  };
  
  const IconComponent = category.icon || CircleDot;
  
  // Extrair a cor do background do category.color
  const bgColorClass = category.color?.replace('text-', 'bg-') || 'bg-gray-200';
  
  // Determinar a cor do texto baseado no background (preto para cores claras, branco para cores escuras)
  const isDarkBg = bgColorClass.includes('bg-blue-600') || 
                   bgColorClass.includes('bg-purple') || 
                   bgColorClass.includes('bg-indigo') || 
                   bgColorClass.includes('bg-green-600') ||
                   bgColorClass.includes('bg-red-600') || 
                   bgColorClass.includes('bg-pink-600') || 
                   bgColorClass.includes('bg-gray-800');
  
  const textColorClass = isDarkBg ? 'text-white' : 'text-gray-900';

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit max-w-full", 
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
