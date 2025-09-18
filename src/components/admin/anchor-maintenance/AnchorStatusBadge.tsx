import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle, AlertTriangle, XCircle, Clock, Image, Eye } from 'lucide-react';
import { AnchorStatus } from '@/types/anchor-maintenance';
import { OnboardingAnchor } from '@/types/onboarding-anchors';

interface AnchorStatusBadgeProps {
  anchor: OnboardingAnchor;
  status?: AnchorStatus;
  showDetails?: boolean;
  className?: string;
}

export const AnchorStatusBadge: React.FC<AnchorStatusBadgeProps> = ({
  anchor,
  status,
  showDetails = false,
  className
}) => {
  const getStatusInfo = () => {
    if (!status) {
      return {
        variant: 'secondary' as const,
        icon: <Clock className="h-3 w-3" />,
        label: 'Não verificada',
        tooltip: 'Status da âncora não foi verificado ainda'
      };
    }

    if (!status.isValid) {
      return {
        variant: 'destructive' as const,
        icon: <XCircle className="h-3 w-3" />,
        label: 'Inválida',
        tooltip: 'Âncora não foi encontrada na página. Pode ter sido removida ou modificada.'
      };
    }

    if (status.needsUpdate) {
      return {
        variant: 'secondary' as const,
        icon: <AlertTriangle className="h-3 w-3" />,
        label: 'Desatualizada',
        tooltip: 'Âncora precisa ser atualizada. Metadados ou thumbnail podem estar desatualizados.'
      };
    }

    return {
      variant: 'default' as const,
      icon: <CheckCircle className="h-3 w-3" />,
      label: 'Válida',
      tooltip: 'Âncora está funcionando corretamente'
    };
  };

  const getAdditionalBadges = () => {
    if (!status || !showDetails) return [];

    const badges = [];

    if (!status.hasThumbnail) {
      badges.push({
        variant: 'outline' as const,
        icon: <Image className="h-3 w-3" />,
        label: 'Sem thumb',
        tooltip: 'Thumbnail não foi gerada para esta âncora'
      });
    }

    if (!status.hasValidSelector) {
      badges.push({
        variant: 'outline' as const,
        icon: <Eye className="h-3 w-3" />,
        label: 'Sem seletor',
        tooltip: 'Seletor CSS inválido ou ausente'
      });
    }

    if (status.lastVerified) {
      const daysSinceVerified = Math.floor(
        (Date.now() - new Date(status.lastVerified).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceVerified > 30) {
        badges.push({
          variant: 'secondary' as const,
          icon: <Clock className="h-3 w-3" />,
          label: `${daysSinceVerified}d`,
          tooltip: `Última verificação há ${daysSinceVerified} dias`
        });
      }
    }

    return badges;
  };

  const isArchived = anchor.tags?.includes('archived');
  const statusInfo = getStatusInfo();
  const additionalBadges = getAdditionalBadges();

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-1 ${className}`}>
        {/* Main Status Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={isArchived ? 'outline' : statusInfo.variant}
              className="flex items-center gap-1"
            >
              {statusInfo.icon}
              {isArchived ? 'Arquivada' : statusInfo.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {isArchived ? 'Esta âncora foi arquivada' : statusInfo.tooltip}
          </TooltipContent>
        </Tooltip>

        {/* Additional Status Badges */}
        {additionalBadges.map((badge, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Badge 
                variant={badge.variant}
                className="flex items-center gap-1"
              >
                {badge.icon}
                {badge.label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {badge.tooltip}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};