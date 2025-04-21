
import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { categories } from '@/data/categories';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Dropdown component for selecting transaction categories
 */
const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange, className }) => {
  const [open, setOpen] = useState(false);

  // Get current category data
  const selectedCategory = categories.find(c => c.value === value) || {
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
          {categories.map((category) => (
            <CommandItem
              key={category.value}
              value={category.value}
              onSelect={(currentValue) => {
                onChange(currentValue);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 cursor-pointer",
                value === category.value ? "bg-primary/10" : ""
              )}
            >
              <div className={cn(
                "w-3 h-3 rounded-full",
                category.color.replace('text-', 'bg-').split(' ')[0]
              )} />
              {category.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default CategorySelector;
