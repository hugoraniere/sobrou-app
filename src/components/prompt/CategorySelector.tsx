
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { XCircle } from "lucide-react";
import { transactionCategories } from '@/data/categories';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  categoryId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCategorySelect: (categoryId: string) => void;
  onReset: (e: React.MouseEvent) => void;
  userSelected: boolean;
  className?: string; // Added className prop
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categoryId,
  isOpen,
  setIsOpen,
  onCategorySelect,
  onReset,
  userSelected,
  className // Added className to props
}) => {
  const categoryInfo = transactionCategories.find(cat => cat.id === categoryId);
  const CategoryIcon = categoryInfo?.icon;
  const categoryName = categoryInfo?.name;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={cn("flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200", className)}>
          {CategoryIcon && <CategoryIcon className="h-3 w-3" />}
          <span>{categoryName}</span>
          {userSelected && (
            <XCircle 
              className="h-3 w-3 ml-1 text-gray-500 hover:text-gray-700" 
              onClick={onReset} 
            />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className={cn("w-56 p-2", className)} align="end">
        <div className="grid gap-1 max-h-60 overflow-y-auto">
          {transactionCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100",
                  category.id === categoryId ? 'bg-blue-50 text-blue-600' : ''
                )}
                onClick={() => onCategorySelect(category.id)}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{category.name}</span>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelector;
