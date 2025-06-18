
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from '@/lib/utils';

interface ComparativeTooltipProps {
  children: React.ReactNode;
  realValue: number;
  plannedValue: number;
  categoryName: string;
  monthName: string;
}

export const ComparativeTooltip: React.FC<ComparativeTooltipProps> = ({
  children,
  realValue,
  plannedValue,
  categoryName,
  monthName
}) => {
  const absoluteDifference = realValue - plannedValue;
  const percentageDifference = plannedValue !== 0 ? ((realValue - plannedValue) / plannedValue) * 100 : 0;
  
  const getStatusColor = () => {
    if (Math.abs(percentageDifference) <= 5) return 'text-green-600';
    if (Math.abs(percentageDifference) <= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = () => {
    if (Math.abs(percentageDifference) <= 5) return 'Dentro do esperado';
    if (Math.abs(percentageDifference) <= 15) return 'Variação moderada';
    return 'Variação significativa';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="p-3 max-w-xs">
          <div className="space-y-2">
            <div className="font-semibold text-sm">
              {categoryName} - {monthName}
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Planejado:</span>
                <span className="font-medium">{formatCurrency(plannedValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Real:</span>
                <span className="font-medium">{formatCurrency(realValue)}</span>
              </div>
              <div className="border-t pt-1">
                <div className="flex justify-between">
                  <span>Diferença:</span>
                  <span className={`font-medium ${absoluteDifference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {absoluteDifference >= 0 ? '+' : ''}{formatCurrency(absoluteDifference)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Variação:</span>
                  <span className={`font-medium ${getStatusColor()}`}>
                    {percentageDifference >= 0 ? '+' : ''}{percentageDifference.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className={`text-xs font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
