import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, Zap, Crown, Infinity } from 'lucide-react';
import { usePlanLimits } from '@/hooks/usePlanLimits';

interface UsageLimitBadgeProps {
  featureKey: string;
  showDetails?: boolean;
  className?: string;
}

const UsageLimitBadge: React.FC<UsageLimitBadgeProps> = ({ 
  featureKey, 
  showDetails = false,
  className = '' 
}) => {
  const { limits, loading } = usePlanLimits();
  
  if (loading) {
    return <Badge variant="secondary" className={className}>Carregando...</Badge>;
  }

  const limit = limits[featureKey];
  if (!limit) return null;

  if (limit.isUnlimited) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className={`${className} bg-gradient-to-r from-purple-500 to-pink-500 text-white`}>
              <Crown className="h-3 w-3 mr-1" />
              Ilimitado
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Uso ilimitado desta funcionalidade</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const getBadgeVariant = () => {
    if (limit.percentageUsed >= 100) return 'destructive';
    if (limit.percentageUsed >= 90) return 'destructive';
    if (limit.percentageUsed >= 80) return 'outline';
    return 'secondary';
  };

  const getIcon = () => {
    if (limit.percentageUsed >= 100) return <AlertTriangle className="h-3 w-3 mr-1" />;
    if (limit.percentageUsed >= 90) return <AlertTriangle className="h-3 w-3 mr-1" />;
    return <Zap className="h-3 w-3 mr-1" />;
  };

  const getTooltipContent = () => {
    const remaining = (limit.limitValue || 0) - limit.currentUsage;
    return (
      <div className="space-y-2">
        <p>Usado: {limit.currentUsage} de {limit.limitValue}</p>
        <p>Restante: {Math.max(0, remaining)}</p>
        {showDetails && (
          <Progress value={limit.percentageUsed} className="w-full" />
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={getBadgeVariant()} className={className}>
            {getIcon()}
            {limit.currentUsage}/{limit.limitValue}
            {showDetails && (
              <span className="ml-1">({limit.percentageUsed.toFixed(0)}%)</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UsageLimitBadge;