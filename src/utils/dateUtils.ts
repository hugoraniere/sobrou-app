
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: ptBR });
};
