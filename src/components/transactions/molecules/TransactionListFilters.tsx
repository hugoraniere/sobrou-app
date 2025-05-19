
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
    <div className={cn("flex flex-col md:flex-row gap-3 justify-between items-center", className)}>
      {/* Filtro de mês em um Card - à esquerda */}
      <Card className="p-3 shadow-sm w-full md:w-auto">
        <div className="flex items-center justify-center">
          <MonthNavigator 
            currentMonth={currentMonth} 
            onMonthChange={onMonthChange}
          />
        </div>
      </Card>
      
      {/* Pesquisa de transações - à direita com largura ajustada ao conteúdo */}
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        className="w-full"
        placeholder="Buscar por descrição, valor ou categoria..."
      />
    </div>
  );
};

export default TransactionListFilters;
