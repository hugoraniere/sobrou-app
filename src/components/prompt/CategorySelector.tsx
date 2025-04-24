
import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { transactionCategories } from '@/data/categories';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, CircleDot } from 'lucide-react';
import { CategoryType } from '@/types/categories';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange, className }) => {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Criar uma lista estática de categorias padrão caso não tenha categorias
  const defaultCategories: CategoryType[] = [
    {
      id: 'other',
      name: 'Outros',
      value: 'other',
      type: 'expense',
      label: 'Outros',
      color: 'bg-gray-100 text-gray-800',
      icon: CircleDot
    }
  ];

  // Garantir que estamos trabalhando com um array válido de categorias
  const categories: CategoryType[] = Array.isArray(transactionCategories) && transactionCategories.length > 0
    ? transactionCategories
    : defaultCategories;
  
  // Encontrar a categoria selecionada ou usar um valor padrão seguro
  const selectedCategory = categories.find(c => c.value === value) || {
    id: '',
    name: 'Selecione uma categoria',
    value: '',
    type: 'expense' as const,
    label: 'Selecione uma categoria',
    color: 'bg-gray-100',
    icon: CircleDot
  };

  // Filtrar categorias com base na busca - garantindo que o array de categorias está definido
  const filteredCategories = searchQuery.length > 0
    ? categories.filter(category => 
        category.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : categories;

  // Garantir que o ícone está definido antes de tentar usá-lo
  const SelectedIcon = selectedCategory.icon || CircleDot;

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
            <SelectedIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{selectedCategory.label}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white shadow-md" align="start">
        <Command>
          <CommandInput 
            placeholder="Buscar categoria..." 
            className="h-9"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty className="py-2 text-sm text-gray-500">
            Nenhuma categoria encontrada.
          </CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {filteredCategories.map((category) => {
              const Icon = category.icon || CircleDot;
              return (
                <CommandItem
                  key={category.value || category.id}
                  value={category.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-2 py-2"
                >
                  <Icon className="h-4 w-4 text-gray-500" />
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
