
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, addMonths, isSameMonth, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface MonthNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  hasTransactionsInNextMonth?: boolean;
  className?: string;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({ 
  currentDate, 
  onDateChange,
  hasTransactionsInNextMonth,
  className 
}) => {
  const today = new Date();
  
  const goToPreviousMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };
  
  // Check if next month is after today or if there are transactions in next month
  const canGoToNextMonth = hasTransactionsInNextMonth || isAfter(addMonths(currentDate, 1), today);
  
  // Format month name with first letter capitalized
  const monthName = format(currentDate, 'MMMM yyyy', { locale: ptBR });
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={goToPreviousMonth}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Mês anterior</span>
      </Button>
      
      <h2 className="text-lg font-semibold">
        {capitalizedMonthName}
      </h2>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={goToNextMonth}
        disabled={!canGoToNextMonth}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Próximo mês</span>
      </Button>
    </div>
  );
};

export default MonthNavigator;
