
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
}

const BigNumberCard: React.FC<BigNumberCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  tooltip,
  subtitle,
  trend
}) => {
  const { t, i18n } = useTranslation();
  
  // Format currency based on locale
  const formatCurrency = (amount: number) => {
    const locale = i18n.language === 'pt-BR' ? 'pt-BR' : 'en-US';
    const currency = locale === 'pt-BR' ? 'BRL' : 'USD';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="overflow-hidden border-b-4 hover:shadow-md transition-shadow duration-200" style={{ borderColor: color }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{title}</p>
                  <h2 className="text-2xl font-bold">{formatCurrency(value)}</h2>
                  {subtitle && (
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                  )}
                  {trend && (
                    <div className={`flex items-center text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {trend.isPositive ? '↑' : '↓'} {trend.value}%
                    </div>
                  )}
                </div>
                <div 
                  className="rounded-full p-2" 
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export default BigNumberCard;
