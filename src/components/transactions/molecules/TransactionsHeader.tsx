
import React from 'react';
import MonthNavigator from './MonthNavigator';
import QuickFilters from './QuickFilters';
import { cn } from '@/lib/utils';

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
  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <MonthNavigator 
        currentDate={currentDate} 
        onDateChange={onDateChange}
        hasTransactionsInNextMonth={hasTransactionsInNextMonth}
      />
      
      <QuickFilters 
        selectedFilter={selectedFilter}
        onFilterChange={onFilterChange}
      />
    </div>
  );
};

export default TransactionsHeader;
