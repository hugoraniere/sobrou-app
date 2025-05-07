
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TransactionDateProps {
  date: string | Date;
  className?: string;
  format?: string;
}

const TransactionDate: React.FC<TransactionDateProps> = ({ 
  date, 
  className,
  format: formatStr = 'dd MMM yyyy' 
}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return (
    <span className={cn("text-xs text-gray-500", className)}>
      {format(dateObj, formatStr, { locale: ptBR })}
    </span>
  );
};

export default TransactionDate;
