
import React from 'react';
import MonthNavigator from './MonthNavigator';
import QuickFilters from './QuickFilters';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionsHeaderProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
  hasTransactionsInNextMonth?: boolean;
  className?: string;
}

const TransactionsHeader: React.FC<TransactionsHeaderProps> = ({
  currentMonth,
  onMonthChange,
  selectedFilter,
  onFilterChange,
  hasTransactionsInNextMonth,
  className
}) => {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <MonthNavigator 
            currentMonth={currentMonth} 
            onMonthChange={onMonthChange}
          />
          {/* Removido o chip duplicado do mês */}
        </div>
        
        <div className="w-full sm:w-auto">
          <div className="flex items-center gap-2 mb-1 sm:hidden">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Filtros rápidos</span>
          </div>
          <QuickFilters 
            selectedFilter={selectedFilter}
            onFilterChange={onFilterChange}
            className="flex-shrink-0 w-full sm:w-auto"
          />
        </div>
      </div>
    </Card>
  );
};

export default TransactionsHeader;
