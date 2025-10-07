import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/dashboardUtils';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
  tooltip?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  current,
  total,
  icon: Icon,
  color = 'text-primary',
  onClick,
  tooltip
}) => {
  const percentage = Math.min((current / total) * 100, 100);
  const isOverLimit = current > total;

  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:scale-[1.02]"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium" title={tooltip}>
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", color)} />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">
              {formatCurrency(current)}
            </span>
            <span className="text-xs text-muted-foreground">
              / {formatCurrency(total)}
            </span>
          </div>
          <Progress 
            value={percentage} 
            className={cn(
              "h-2",
              isOverLimit && "bg-destructive/20"
            )}
          />
          <p className={cn(
            "text-xs",
            isOverLimit ? "text-destructive font-medium" : "text-muted-foreground"
          )}>
            {percentage.toFixed(1)}% do limite anual
            {isOverLimit && " - Limite ultrapassado!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
