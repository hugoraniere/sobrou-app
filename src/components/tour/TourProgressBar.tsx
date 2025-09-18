import React, { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

interface TourProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const TourProgressBar: React.FC<TourProgressBarProps> = ({
  currentStep,
  totalSteps,
  className = ""
}) => {
  // Fixed progress calculation
  const progressValue = useMemo(() => {
    if (totalSteps === 0) return 0;
    // Progress should be based on completed steps, not current step index
    return Math.round(((currentStep + 1) / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progresso</span>
        <span>{currentStep + 1} de {totalSteps}</span>
      </div>
      <Progress 
        value={progressValue} 
        className="h-2"
        aria-label={`Progresso do tour: ${progressValue}%`}
      />
    </div>
  );
};