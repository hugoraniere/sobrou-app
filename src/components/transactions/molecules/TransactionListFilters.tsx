
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
    <div className={cn("flex flex-col md:flex-row gap-3 justify-between", className)}>
      {/* Filtro de mês - à esquerda */}
      <div className="flex items-center">
        <MonthNavigator 
          currentDate={currentMonth} 
          onDateChange={onMonthChange}
        />
      </div>
      
      {/* Pesquisa de transações - à direita */}
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        className="w-full md:w-1/2"
      />
    </div>
  );
};

export default TransactionListFilters;
