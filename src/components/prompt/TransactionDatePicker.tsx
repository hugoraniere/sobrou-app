
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslation } from 'react-i18next';

export interface TransactionDatePickerProps {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
  className?: string;
}

const TransactionDatePicker: React.FC<TransactionDatePickerProps> = ({ 
  date, 
  onDateChange,
  className 
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'pt-BR' ? ptBR : undefined;
  const [open, setOpen] = useState(false);

  // Função para alternar o estado do popover
  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(prev => !prev);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 cursor-pointer" onClick={handleIconClick} />
          {date ? format(date, 'PPP', { locale }) : <span>{t('common.pickDate', 'Escolha uma data')}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[1000]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            onDateChange(date);
            setOpen(false);
          }}
          initialFocus
          locale={locale}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default TransactionDatePicker;
