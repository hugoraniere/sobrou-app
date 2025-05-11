
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transactionCategories } from '@/data/categories';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  value, 
  onChange, 
  className 
}) => {
  // Encontrar a categoria selecionada para exibir o texto corretamente
  const selectedCategory = transactionCategories.find(cat => cat.value === value || cat.id === value);
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          {selectedCategory ? (
            <div className="flex items-center gap-2">
              {selectedCategory.icon && React.createElement(selectedCategory.icon, { className: "h-4 w-4 text-gray-500" })}
              <span>{selectedCategory.label || selectedCategory.name}</span>
            </div>
          ) : (
            "Selecione uma categoria"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {transactionCategories.map((category) => (
          <SelectItem 
            key={category.value || category.id} 
            value={category.value || category.id}
          >
            <div className="flex items-center gap-2">
              {category.icon && React.createElement(category.icon, { className: "h-4 w-4 text-gray-500" })}
              <span>{category.label || category.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelector;
