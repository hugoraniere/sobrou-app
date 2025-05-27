
import React from 'react';
import { cn } from '@/lib/utils';
import MonthNavigator from './MonthNavigator';
import SearchBar from './SearchBar';
import { Card } from '@/components/ui/card';
import { useResponsive } from '@/hooks/useResponsive';

interface TransactionListFiltersProps {
  currentMonth: string;
  searchTerm: string;
  onMonthChange: (month: string) => void;
  onSearchChange: (term: string) => void;
  className?: string;
}

const TransactionListFilters: React.FC<TransactionListFiltersProps> = ({
  currentMonth,
  searchTerm,
  onMonthChange,
  onSearchChange,
  className
}) => {
  const { isMobile } = useResponsive();

  return (
    <Card className={cn("shadow-sm", isMobile ? "p-3" : "p-3", className)}>
      <div className={cn(
        "flex gap-3 justify-between items-center",
        isMobile ? "flex-col space-y-3" : "flex-col md:flex-row"
      )}>
        {/* Filtro de mês */}
        <div className="flex items-center w-full md:w-auto">
          <MonthNavigator 
            currentMonth={currentMonth} 
            onMonthChange={onMonthChange}
          />
        </div>
        
        {/* Pesquisa de transações */}
        <div className="w-full md:w-auto">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            placeholder={isMobile ? "Buscar..." : "Buscar por descrição, valor ou categoria..."}
            className="w-full md:max-w-[320px]"
          />
        </div>
      </div>
    </Card>
  );
};

export default TransactionListFilters;
