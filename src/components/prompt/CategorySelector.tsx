
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
    color: 'bg-gray-100 text-gray-500',
    icon: null
  };

  return (
    <Command className={cn("rounded-xl border border-gray-100 shadow-sm", className)}>
      <div className="border-b border-gray-50 px-3 py-3">
        <CommandInput 
          placeholder="Buscar categoria..." 
          className="focus-visible:ring-0 placeholder:text-gray-400"
        />
      </div>
      <CommandList className="max-h-[300px] overflow-y-auto">
        <CommandEmpty className="py-4 text-sm text-gray-500">
          Nenhuma categoria encontrada.
        </CommandEmpty>
        <CommandGroup heading="Categorias" className="px-2">
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg my-0.5 cursor-pointer transition-all duration-200",
                  "hover:bg-gray-50",
                  value === category.value ? "bg-primary/5 hover:bg-primary/10" : ""
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  {Icon && (
                    <span className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                      category.color.replace('text-', 'bg-').split(' ')[0].replace('bg-', 'bg-opacity-10 bg-')
                    )}>
                      <Icon 
                        className={cn(
                          "h-4 w-4", 
                          category.color.replace('text-', 'text-')
                        )} 
                      />
                    </span>
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    value === category.value ? "text-primary" : "text-gray-700"
                  )}>
                    {category.label}
                  </span>
                </div>
                
                {value === category.value && (
                  <div 
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
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
