
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

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
  simulatedValue
}) => {
  const { t, i18n } = useTranslation();

  const formatCurrency = (amount: number) => {
    const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en-US';
    const currency = locale === 'pt-BR' ? 'BRL' : 'USD';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card style={{ borderColor: color }} className={className}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h2 className="text-2xl font-bold">
                  {formatCurrency(value)}
                  {simulatedValue !== undefined && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      → {formatCurrency(simulatedValue)}
                    </span>
                  )}
                </h2>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                {trend && (
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant={trend.isPositive ? "default" : "destructive"} className="text-xs px-1 py-0">
                      <span>{trend.isPositive ? '↑' : '↓'}</span> {trend.value}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {t('dashboard.fromLastMonth', 'from last month')}
                    </span>
                  </div>
                )}
              </div>
              <div className="rounded-full p-2" style={{ backgroundColor: `${color}20` }}>
                <Icon className="h-6 w-6" style={{ color }} />
              </div>
            </div>
          </CardContent>
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
