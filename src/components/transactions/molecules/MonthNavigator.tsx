
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, addMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthNavigatorProps {
  currentMonth: string; // formato: 'YYYY-MM'
  onMonthChange: (month: string) => void;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  currentMonth,
  onMonthChange
}) => {
  // Converter string para objeto Date
  const parseMonth = (monthStr: string): Date => {
    // Se 'current' ou 'all', usar data atual
    if (monthStr === 'current' || monthStr === 'all') {
      return new Date();
    }
    
    // Se 'previous', usar mês anterior
    if (monthStr === 'previous') {
      return subMonths(new Date(), 1);
    }
    
    // Caso contrário, parse do formato YYYY-MM
    const [year, month] = monthStr.split('-').map(Number);
    return new Date(year, month - 1, 1);
  };
  
  // Converter Date para string no formato 'YYYY-MM'
  const formatMonth = (date: Date): string => {
    return format(date, 'yyyy-MM');
  };
  
  const currentDate = parseMonth(currentMonth);
  
  const handlePrevMonth = () => {
    onMonthChange(formatMonth(subMonths(currentDate, 1)));
  };
  
  const handleNextMonth = () => {
    onMonthChange(formatMonth(addMonths(currentDate, 1)));
  };
  
  const displayMonth = format(currentDate, 'MMMM yyyy', { locale: ptBR });
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        onClick={handlePrevMonth} 
        variant="ghost" 
        size="sm"
        className="p-1 rounded-full"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <h3 className="text-sm font-medium min-w-[120px] text-center">
        {displayMonth}
      </h3>
      
      <Button 
        onClick={handleNextMonth} 
        variant="ghost" 
        size="sm"
        className="p-1 rounded-full"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MonthNavigator;
