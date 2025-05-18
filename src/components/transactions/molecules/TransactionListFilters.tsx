
import React from 'react';
import { cn } from '@/lib/utils';
import MonthNavigator from './MonthNavigator';
import SearchBar from './SearchBar';

interface TransactionListFiltersProps {
  currentMonth: Date;
  searchTerm: string;
  onMonthChange: (date: Date) => void;
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
    <div className={cn("flex flex-col md:flex-row gap-3 justify-between items-center", className)}>
      {/* Filtro de mês - à esquerda */}
      <div className="flex items-center">
        <MonthNavigator 
          currentDate={currentMonth} 
          onDateChange={onMonthChange}
        />
      </div>
      
      {/* Pesquisa de transações - à direita com largura aumentada */}
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        className="w-full md:w-[60%]"
        placeholder="Buscar por descrição, valor ou categoria..."
      />
    </div>
  );
};

export default TransactionListFilters;
