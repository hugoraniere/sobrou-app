
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
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Selecione uma categoria" />
      </SelectTrigger>
      <SelectContent className="z-[1000] bg-white">
        {transactionCategories.map((category) => {
          const Icon = category.icon;
          return (
            <SelectItem 
              key={category.value} 
              value={category.value}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-gray-500" />
                <span>{category.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default CategorySelector;
