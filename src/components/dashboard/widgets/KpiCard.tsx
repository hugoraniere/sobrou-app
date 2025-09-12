import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface KpiCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'flat';
    label?: string;
  };
  isLoading?: boolean;
  isError?: boolean;
  lastUpdated?: Date;
  source?: string;
  format?: 'number' | 'currency' | 'percentage';
  className?: string;
  onClick?: () => void;
  onRefresh?: () => void;
}

const formatValue = (value: number | string, format: 'number' | 'currency' | 'percentage' = 'number') => {
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    default:
      return value.toLocaleString('pt-BR');
  }
};

const TrendIcon = ({ direction }: { direction: 'up' | 'down' | 'flat' }) => {
  switch (direction) {
    case 'up':
      return <TrendingUp className="h-3 w-3 text-emerald-600" />;
    case 'down':
      return <TrendingDown className="h-3 w-3 text-red-600" />;
    default:
      return <Minus className="h-3 w-3 text-muted-foreground" />;
  }
};

const TrendColor = (direction: 'up' | 'down' | 'flat') => {
  switch (direction) {
    case 'up':
      return 'text-emerald-600';
    case 'down':
      return 'text-red-600';
    default:
      return 'text-muted-foreground';
  }
};

export function KpiCard({
  title,
  value,
  icon,
  trend,
  isLoading = false,
  isError = false,
  lastUpdated,
  source = 'Supabase',
  format = 'number',
  className = '',
  onClick,
  onRefresh
}: KpiCardProps) {
  if (isLoading) {
    return (
      <Card className={`${className} animate-pulse`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[80px] mb-2" />
          <Skeleton className="h-3 w-[60px]" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className={`${className} border-red-200 bg-red-50`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-700">{title}</CardTitle>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 hover:bg-red-100 rounded"
              title="Tentar novamente"
            >
              <RefreshCw className="h-4 w-4 text-red-600" />
            </button>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">Erro</div>
          <p className="text-xs text-red-600">Falha ao carregar dados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`${className} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRefresh();
              }}
              className="p-1 hover:bg-muted rounded"
              title="Atualizar"
            >
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value, format)}</div>
        
        <div className="flex items-center justify-between mt-2">
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${TrendColor(trend.direction)}`}>
              <TrendIcon direction={trend.direction} />
              <span>{trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)}%</span>
              {trend.label && <span className="text-muted-foreground">vs {trend.label}</span>}
            </div>
          )}
          
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className="text-xs">
              {source}
            </Badge>
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(lastUpdated, { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}