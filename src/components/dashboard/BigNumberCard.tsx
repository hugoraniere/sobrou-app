
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { TEXT } from '@/constants/text';

interface BigNumberCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  tooltip?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  simulatedValue?: number;
  onClick?: () => void;
}

const BigNumberCard: React.FC<BigNumberCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  tooltip,
  subtitle,
  trend,
  className,
  simulatedValue,
  onClick
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const cardContent = (
    <CardContent className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
          <h2 className="text-2xl font-bold truncate">
            {formatCurrency(value)}
            {simulatedValue !== undefined && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                → {formatCurrency(simulatedValue)}
              </span>
            )}
          </h2>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <Badge variant={trend.isPositive ? "default" : "destructive"} className="text-xs px-1 py-0">
                <span>{trend.isPositive ? '↑' : '↓'}</span> {trend.value}%
              </Badge>
              <span className="text-xs text-muted-foreground truncate">
                {TEXT.dashboard.fromLastMonth}
              </span>
            </div>
          )}
        </div>
        <div className="rounded-full p-2 shrink-0" style={{ backgroundColor: `${color}20` }}>
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </CardContent>
  );

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card 
          style={{ borderColor: color }} 
          className={`min-w-[240px] flex-1 bg-white ${className} ${onClick ? 'cursor-pointer' : ''}`}
          onClick={onClick}
        >
          {cardContent}
        </Card>
      </HoverCardTrigger>
      {tooltip && (
        <HoverCardContent className="w-80 p-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{tooltip}</p>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default BigNumberCard;
