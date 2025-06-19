
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BillPeriodFilter } from '@/types/bills';
import { cn } from '@/lib/utils';

interface BillFiltersProps {
  activeFilter: BillPeriodFilter;
  onFilterChange: (filter: BillPeriodFilter) => void;
  counts: {
    overdue: number;
    today: number;
    tomorrow: number;
    thisWeek: number;
    thisMonth: number;
    all: number;
  };
}

const filterLabels: Record<BillPeriodFilter, string> = {
  overdue: 'Vencidas',
  today: 'Hoje',
  tomorrow: 'Amanhã',
  'this-week': 'Esta Semana',
  'this-month': 'Este Mês',
  all: 'Todas',
};

export const BillFilters: React.FC<BillFiltersProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const filters: BillPeriodFilter[] = [
    'overdue',
    'today',
    'tomorrow',
    'this-week',
    'this-month',
    'all',
  ];

  const getCount = (filter: BillPeriodFilter) => {
    switch (filter) {
      case 'overdue': return counts.overdue;
      case 'today': return counts.today;
      case 'tomorrow': return counts.tomorrow;
      case 'this-week': return counts.thisWeek;
      case 'this-month': return counts.thisMonth;
      case 'all': return counts.all;
      default: return 0;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {filters.map((filter) => {
        const count = getCount(filter);
        const isActive = activeFilter === filter;
        const isOverdue = filter === 'overdue';
        
        return (
          <Button
            key={filter}
            variant="outline"
            size="sm"
            onClick={() => onFilterChange(filter)}
            className={cn(
              "flex items-center gap-2 text-xs h-8 px-3 bg-gray-100 border-gray-300 hover:bg-gray-200",
              isActive && !isOverdue && "bg-primary text-white border-primary hover:bg-primary/90",
              isActive && isOverdue && "bg-red-500 text-white border-red-500 hover:bg-red-600",
              !isActive && isOverdue && count > 0 && "text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
            )}
          >
            {filterLabels[filter]}
            {count > 0 && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-1 h-4 px-1.5 text-xs font-medium",
                  isActive && "bg-white/20 text-white",
                  !isActive && isOverdue && count > 0 && "bg-red-100 text-red-700",
                  !isActive && !isOverdue && "bg-white text-gray-700"
                )}
              >
                {count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
};
