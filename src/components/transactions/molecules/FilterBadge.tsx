
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FilterBadgeProps {
  startDate: Date;
  endDate: Date;
  onClear: () => void;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ 
  startDate, 
  endDate, 
  onClear 
}) => {
  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center mb-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-blue-600">🔎</span>
        <span>
          Exibindo transações de <strong>{formatDate(startDate)}</strong> a <strong>{formatDate(endDate)}</strong>
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClear}
        className="text-sm px-2 h-8 hover:bg-blue-100"
      >
        <X className="h-3 w-3 mr-1" />
        Limpar filtro
      </Button>
    </div>
  );
};

export default FilterBadge;
