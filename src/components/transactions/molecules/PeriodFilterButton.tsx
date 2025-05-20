
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PeriodFilterButtonProps {
  onApplyFilter: (startDate: Date, endDate: Date) => void;
}

const PeriodFilterButton: React.FC<PeriodFilterButtonProps> = ({ onApplyFilter }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Final do dia atual
  
  const handleApplyFilter = () => {
    if (startDate && endDate) {
      // Garantir que endDate não está no futuro
      const safeEndDate = isFuture(endDate) ? today : endDate;
      
      onApplyFilter(startDate, safeEndDate);
      setIsPopoverOpen(false);
    }
  };

  const applyPresetFilter = (preset: string) => {
    const end = new Date();
    let start = new Date();
    
    switch (preset) {
      case 'today':
        // Start and end are today
        start = new Date(end);
        start.setHours(0, 0, 0, 0); // Início do dia
        end.setHours(23, 59, 59, 999); // Final do dia
        break;
      case '7days':
        start.setDate(end.getDate() - 7);
        break;
      case '15days':
        start.setDate(end.getDate() - 15);
        break;
      case '30days':
        start.setDate(end.getDate() - 30);
        break;
      case 'thisWeek':
        // First day of the week (Sunday or Monday depending on locale)
        const day = end.getDay();
        const diff = end.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        start = new Date(end);
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        break;
      case 'thisYear':
        start = new Date(end.getFullYear(), 0, 1); // Jan 1st of current year
        break;
    }
    
    setStartDate(start);
    setEndDate(end);
    onApplyFilter(start, end);
    setIsPopoverOpen(false);
  };
  
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <CalendarIcon className="h-4 w-4" />
          Filtrar por período
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-white" align="end">
        <div className="space-y-4">
          <div className="font-medium">Filtros rápidos</div>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => applyPresetFilter('today')}
            >
              Hoje
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => applyPresetFilter('7days')}
            >
              Últimos 7 dias
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => applyPresetFilter('15days')}
            >
              Últimos 15 dias
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => applyPresetFilter('30days')}
            >
              Últimos 30 dias
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => applyPresetFilter('thisWeek')}
            >
              Esta semana
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => applyPresetFilter('thisYear')}
            >
              Este ano
            </Button>
          </div>
          
          <div className="border-t pt-4">
            <div className="font-medium mb-2">Período personalizado</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm text-gray-500 mb-1">De:</div>
                <div className="border rounded-md p-2 flex items-center justify-between">
                  {startDate ? (
                    format(startDate, 'dd/MM/yyyy')
                  ) : (
                    <span className="text-gray-400">Selecione</span>
                  )}
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Até:</div>
                <div className="border rounded-md p-2 flex items-center justify-between">
                  {endDate ? (
                    format(endDate, 'dd/MM/yyyy')
                  ) : (
                    <span className="text-gray-400">Selecione</span>
                  )}
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="mt-2">
              <Calendar
                mode="range"
                selected={{
                  from: startDate || today,
                  to: endDate || today
                }}
                onSelect={(range) => {
                  setStartDate(range?.from);
                  setEndDate(range?.to);
                }}
                disabled={(date) => isFuture(date)}
                locale={ptBR}
                className={cn("p-3 border rounded-md")}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsPopoverOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleApplyFilter}>
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PeriodFilterButton;
