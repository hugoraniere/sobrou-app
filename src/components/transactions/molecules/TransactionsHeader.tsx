
import React from 'react';
import MonthNavigator from './MonthNavigator';
import QuickFilters from './QuickFilters';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface TransactionsHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
  hasTransactionsInNextMonth?: boolean;
  className?: string;
}

const TransactionsHeader: React.FC<TransactionsHeaderProps> = ({
  currentDate,
  onDateChange,
  selectedFilter,
  onFilterChange,
  hasTransactionsInNextMonth,
  className
}) => {
  // Formatação do mês e ano para exibição
  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <MonthNavigator 
            currentDate={currentDate} 
            onDateChange={onDateChange}
            hasTransactionsInNextMonth={hasTransactionsInNextMonth}
          />
          <div className="hidden sm:block ml-3 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 font-medium">
            {formatMonthYear(currentDate)}
          </div>
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
