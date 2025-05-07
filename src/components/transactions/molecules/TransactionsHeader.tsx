
import React from 'react';
import MonthNavigator from './MonthNavigator';
import QuickFilters from './QuickFilters';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

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
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <MonthNavigator 
          currentDate={currentDate} 
          onDateChange={onDateChange}
          hasTransactionsInNextMonth={hasTransactionsInNextMonth}
        />
        
        <QuickFilters 
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
          className="flex-shrink-0"
        />
      </div>
    </Card>
  );
};

export default TransactionsHeader;
