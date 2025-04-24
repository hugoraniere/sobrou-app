
import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { transactionCategories } from '@/data/categories';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange, className }) => {
  const [open, setOpen] = useState(false);

  const selectedCategory = transactionCategories.find(c => c.value === value) || {
    label: value || 'Selecione uma categoria',
    value: value,
    color: 'bg-gray-100 text-gray-800',
    icon: null
  };

  return (
    <Command className={cn("rounded-lg border shadow-md", className)}>
      <CommandInput placeholder="Buscar categoria..." />
      <CommandList>
        <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
        <CommandGroup heading="Categorias">
          {transactionCategories.map((category) => {
            const Icon = category.icon;
            return (
              <CommandItem
                key={category.value}
                value={category.value}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors",
                  value === category.value ? "bg-primary/10" : ""
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    className={cn(
                      "h-5 w-5", 
                      category.color.replace('text-', 'text-')
                    )} 
                  />
                  <span className="font-medium">{category.label}</span>
                </div>
                {value === category.value && (
                  <div 
                    className={cn(
                      "w-2 h-2 rounded-full ml-auto",
                      category.color.replace('text-', 'bg-').split(' ')[0]
                    )} 
                  />
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default CategorySelector;

