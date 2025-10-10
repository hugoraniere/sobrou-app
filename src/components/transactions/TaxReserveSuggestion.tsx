import React from 'react';
import { Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface TaxReserveSuggestionProps {
  amount: number;
  percentage: number;
  onDismiss: () => void;
}

export const TaxReserveSuggestion: React.FC<TaxReserveSuggestionProps> = ({
  amount,
  percentage,
  onDismiss,
}) => {
  const suggestedReserve = amount * (percentage / 100);

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-5 z-50">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Info className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            💡 Sugestão de Reserva para Impostos
          </h4>
          <p className="text-sm text-blue-800 mb-2">
            Reserve <strong>{formatCurrency(suggestedReserve)}</strong> para impostos 
            ({percentage}% de {formatCurrency(amount)})
          </p>
          <button
            onClick={onDismiss}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
          >
            Ok, entendi
          </button>
        </div>
      </div>
    </div>
  );
};
