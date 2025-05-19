
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, subMonths, addMonths, parseISO, isFuture, isThisMonth, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface MonthNavigatorProps {
  currentMonth: string; // formato: 'YYYY-MM'
  onMonthChange: (month: string) => void;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  currentMonth,
  onMonthChange
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
    const nextMonth = addMonths(currentDate, 1);
    // Prevenir navegação para meses futuros
    if (!isFuture(startOfMonth(nextMonth)) || isThisMonth(nextMonth)) {
      onMonthChange(formatMonth(nextMonth));
    }
  };
  
  const displayMonth = format(currentDate, 'MMMM yyyy', { locale: ptBR });
  
  // Verificar se o próximo mês é no futuro
  const isNextMonthFuture = isFuture(startOfMonth(addMonths(currentDate, 1))) && !isThisMonth(addMonths(currentDate, 1));
  
  // Componente de seleção de mês e ano
  const MonthYearSelector = () => {
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
    
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 
      'Maio', 'Junho', 'Julho', 'Agosto', 
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const handlePrevYear = () => {
      setSelectedYear(prev => prev - 1);
    };
    
    const handleNextYear = () => {
      const nextYear = selectedYear + 1;
      // Prevenir navegação para anos futuros
      if (nextYear <= new Date().getFullYear()) {
        setSelectedYear(nextYear);
      }
    };
    
    const handleSelectMonth = (monthIndex: number) => {
      const selectedDate = new Date(selectedYear, monthIndex, 1);
      
      // Prevenir seleção de meses futuros
      if (!isFuture(startOfMonth(selectedDate)) || isThisMonth(selectedDate)) {
        onMonthChange(formatMonth(selectedDate));
        setIsDialogOpen(false);
      }
    };
    
    const isMonthDisabled = (monthIndex: number) => {
      const selectedDate = new Date(selectedYear, monthIndex, 1);
      return isFuture(startOfMonth(selectedDate)) && !isThisMonth(selectedDate);
    };
    
    const currentYearMonth = new Date().getFullYear();
    const isNextYearDisabled = selectedYear >= currentYearMonth;
    
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <Button 
            onClick={handlePrevYear} 
            variant="ghost" 
            size="sm"
            className="p-1"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <h3 className="text-lg font-medium">{selectedYear}</h3>
          
          <Button 
            onClick={handleNextYear} 
            variant="ghost" 
            size="sm"
            className="p-1"
            disabled={isNextYearDisabled}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {months.map((month, index) => (
            <Button
              key={month}
              variant="outline"
              className={cn(
                "w-full justify-center py-2",
                isMonthDisabled(index) && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleSelectMonth(index)}
              disabled={isMonthDisabled(index)}
            >
              {month}
            </Button>
          ))}
        </div>
      </>
    );
  };
  
  return (
    <>
      <div className="flex items-center space-x-2">
        <Button 
          onClick={handlePrevMonth} 
          variant="ghost" 
          size="sm"
          className="p-1 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          className="text-sm font-medium min-w-[120px] text-center px-2 py-1 flex items-center"
          onClick={() => setIsDialogOpen(true)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {displayMonth}
        </Button>
        
        <Button 
          onClick={handleNextMonth} 
          variant="ghost" 
          size="sm"
          className="p-1 rounded-full"
          disabled={isNextMonthFuture}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Selecionar mês</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <MonthYearSelector />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MonthNavigator;
