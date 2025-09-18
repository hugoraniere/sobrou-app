import React, { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { getPercent } from '@/lib/progress';

interface TourProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

export const TourProgressBar: React.FC<TourProgressBarProps> = ({
  completed,
  total,
  className = ""
}) => {
  // Unified progress calculation
  const progressValue = useMemo(() => {
    return getPercent(completed, total);
  }, [completed, total]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progresso</span>
        <span>{completed} de {total}</span>
      </div>
      <Progress 
        value={progressValue} 
        className="h-2"
        aria-label={`Progresso do tour: ${progressValue}%`}
      />
    </div>
  );
};