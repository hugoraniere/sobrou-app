
import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { transactionCategories } from '@/data/categories';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange, className }) => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Garantir que temos uma lista válida de categorias
  const categories = transactionCategories || [];
  
  // Encontrar a categoria selecionada ou usar um valor padrão seguro
  const selectedCategory = categories.find(c => c.value === value) || {
    label: 'Selecione uma categoria',
    value: '',
    icon: null
  };

  // Filtrar categorias com base na busca
  const filteredCategories = searchQuery.length > 0
    ? categories.filter(category => 
        category.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : categories;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center gap-2">
            {selectedCategory.icon && (
              <selectedCategory.icon className="h-4 w-4 text-gray-500" />
            )}
            <span className="text-sm">{selectedCategory.label}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white" align="start">
        <Command>
          <CommandInput 
            placeholder="Buscar categoria..." 
            className="h-9"
            onValueChange={setSearchQuery}
          />
          <CommandEmpty className="py-2 text-sm text-gray-500">
            Nenhuma categoria encontrada.
          </CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 py-2"
                >
                  {Icon && <Icon className="h-4 w-4 text-gray-500" />}
                  <span className="flex-1 text-sm">{category.label}</span>
                  {value === category.value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelector;
