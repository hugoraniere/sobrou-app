
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

  const getVariant = (filter: BillPeriodFilter) => {
    if (filter === 'overdue' && counts.overdue > 0) {
      return activeFilter === filter ? 'destructive' : 'outline';
    }
    return activeFilter === filter ? 'default' : 'outline';
  };

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
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const count = getCount(filter);
        return (
          <Button
            key={filter}
            variant={getVariant(filter)}
            size="sm"
            onClick={() => onFilterChange(filter)}
            className={cn(
              "flex items-center gap-2",
              filter === 'overdue' && count > 0 && "text-red-600 border-red-200"
            )}
          >
            {filterLabels[filter]}
            {count > 0 && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "ml-1 h-5 px-1.5 text-xs",
                  activeFilter === filter && "bg-white/20",
                  filter === 'overdue' && count > 0 && "bg-red-100 text-red-700"
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
