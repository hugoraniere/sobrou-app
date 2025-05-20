
import React from 'react';
import { cn } from '@/lib/utils';
import MonthNavigator from './MonthNavigator';
import SearchBar from './SearchBar';
import { Card } from '@/components/ui/card';

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
  return (
    <Card className={cn("p-3 shadow-sm", className)}>
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
        {/* Filtro de mês - à esquerda */}
        <div className="flex items-center">
          <MonthNavigator 
            currentMonth={currentMonth} 
            onMonthChange={onMonthChange}
          />
        </div>
        
        {/* Pesquisa de transações - à direita */}
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          placeholder="Buscar por descrição, valor ou categoria..."
        />
      </div>
    </Card>
  );
};

export default TransactionListFilters;
