
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type QuickFilterOption = {
  id: string;
  label: string;
};

const DEFAULT_FILTERS: QuickFilterOption[] = [
  { id: 'today', label: 'Hoje' },
  { id: '7days', label: '7 dias' },
  { id: 'thisMonth', label: 'Este mês' },
  { id: 'thisYear', label: 'Este ano' }
];

interface QuickFiltersProps {
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
  options?: QuickFilterOption[];
  className?: string;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({ 
  selectedFilter, 
  onFilterChange,
  options = DEFAULT_FILTERS,
  className
}) => {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-1 flex-nowrap", className)}>
      {options.map((filter) => (
        <Button
          key={filter.id}
          variant={selectedFilter === filter.id ? "default" : "outline"}
          size="sm"
          className={cn(
            "text-xs rounded-full",
            selectedFilter === filter.id && "bg-primary"
          )}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default QuickFilters;
