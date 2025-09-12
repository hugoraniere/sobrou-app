import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  ResponsiveContainer 
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BaseChartProps {
  title: string;
  isLoading?: boolean;
  isError?: boolean;
  lastUpdated?: Date;
  source?: string;
  className?: string;
  onRefresh?: () => void;
}

interface TimeSeriesChartProps extends BaseChartProps {
  data: Array<{ [key: string]: any }>;
  xAxisKey: string;
  yAxisKey: string;
  lineColor?: string;
  height?: number;
}

interface StackedBarChartProps extends BaseChartProps {
  data: Array<{ [key: string]: any }>;
  xAxisKey: string;
  stackKeys: Array<{ key: string; color: string; label: string }>;
  height?: number;
}

interface PieChartProps extends BaseChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  height?: number;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4'
];

function ChartWrapper({ 
  title, 
  isLoading, 
  isError, 
  lastUpdated, 
  source = 'Supabase', 
  className, 
  onRefresh, 
  children 
}: BaseChartProps & { children: React.ReactNode }) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline">Carregando...</Badge>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className={`${className} border-red-200 bg-red-50`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-red-700">{title}</CardTitle>
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
          <div className="text-center py-8 text-red-700">
            Erro ao carregar gráfico
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1 hover:bg-muted rounded"
              title="Atualizar"
            >
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <Badge variant="outline">{source}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {children}
        {lastUpdated && (
          <div className="text-xs text-muted-foreground mt-2 text-right">
            Atualizado {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ptBR })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function TimeSeriesChart({
  data,
  xAxisKey,
  yAxisKey,
  lineColor = 'hsl(var(--primary))',
  height = 300,
  ...props
}: TimeSeriesChartProps) {
  const chartConfig = {
    [yAxisKey]: {
      label: yAxisKey,
      color: lineColor,
    },
  };

  return (
    <ChartWrapper {...props}>
      {data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum dado disponível
        </div>
      ) : (
        <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (xAxisKey.includes('date')) {
                    return new Date(value).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: '2-digit' 
                    });
                  }
                  return value;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey={yAxisKey} 
                stroke={lineColor}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </ChartWrapper>
  );
}

export function StackedBarChart({
  data,
  xAxisKey,
  stackKeys,
  height = 300,
  ...props
}: StackedBarChartProps) {
  const chartConfig = stackKeys.reduce((acc, key) => ({
    ...acc,
    [key.key]: {
      label: key.label,
      color: key.color,
    },
  }), {});

  return (
    <ChartWrapper {...props}>
      {data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum dado disponível
        </div>
      ) : (
        <ChartContainer config={chartConfig} className={`h-[${height}px]`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {stackKeys.map((stack) => (
                <Bar 
                  key={stack.key}
                  dataKey={stack.key} 
                  stackId="stack"
                  fill={stack.color}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </ChartWrapper>
  );
}

export function SimplePieChart({
  data,
  height = 300,
  ...props
}: PieChartProps) {
  return (
    <ChartWrapper {...props}>
      {data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum dado disponível
        </div>
      ) : (
        <div className={`h-[${height}px]`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartWrapper>
  );
}