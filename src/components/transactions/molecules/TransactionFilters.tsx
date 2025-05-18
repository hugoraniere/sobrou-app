
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FilterOption {
  id: string;
  label: string;
}

interface TransactionFiltersProps {
  activeFilters: string[];
  categoryOptions: FilterOption[];
  onFilterChange: (filterId: string, active: boolean) => void;
  onClearFilters: () => void;
  className?: string;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  activeFilters,
  categoryOptions,
  onFilterChange,
  onClearFilters,
  className
}) => {
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <div className="flex items-center gap-2 text-sm">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-gray-600">Filtros:</span>
      </div>
      
      {categoryOptions.map(option => (
        <Button
          key={option.id}
          variant={activeFilters.includes(option.id) ? "secondary" : "outline"}
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => onFilterChange(option.id, !activeFilters.includes(option.id))}
        >
          {option.label}
        </Button>
      ))}
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onClearFilters}
        >
          <X className="h-3 w-3 mr-1" />
          Limpar
        </Button>
      )}
    </div>
  );
};

export default TransactionFilters;
