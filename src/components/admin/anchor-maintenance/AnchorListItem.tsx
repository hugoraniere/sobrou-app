import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  Archive, 
  Search, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { OnboardingAnchor } from '@/types/onboarding-anchors';
import { AnchorStatusBadge } from './AnchorStatusBadge';
import { useAnchorMaintenance } from '@/hooks/useAnchorMaintenance';

interface AnchorListItemProps {
  anchor: OnboardingAnchor;
  isSelected?: boolean;
  onSelect?: (anchor: OnboardingAnchor) => void;
  onEdit?: (anchor: OnboardingAnchor) => void;
  onPreview?: (anchor: OnboardingAnchor) => void;
  onUpdate?: () => void;
  showActions?: boolean;
  className?: string;
}

export const AnchorListItem: React.FC<AnchorListItemProps> = ({
  anchor,
  isSelected = false,
  onSelect,
  onEdit,
  onPreview,
  onUpdate,
  showActions = true,
  className
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    getAnchorStatus,
    checkAnchorStatus,
    findSimilarElements,
    archiveAnchor
  } = useAnchorMaintenance();

  const status = getAnchorStatus(anchor.anchor_id);

  const handleRefreshStatus = async () => {
    setIsProcessing(true);
    try {
      await checkAnchorStatus(anchor);
      onUpdate?.();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFindSimilar = async () => {
    setIsProcessing(true);
    try {
      await findSimilarElements(anchor);
      // Results will be available through the hook
    } finally {
      setIsProcessing(false);
    }
  };

  const handleArchive = async () => {
    setIsProcessing(true);
    try {
      await archiveAnchor(anchor.anchor_id);
      onUpdate?.();
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(anchor);
    } else {
      // Open app in new tab with anchor highlight
      const previewUrl = `${window.location.origin}/?tour=preview&highlight=${anchor.anchor_id}`;
      window.open(previewUrl, '_blank');
    }
  };

  const isArchived = anchor.tags?.includes('archived');

  return (
    <TooltipProvider>
      <Card 
        className={`transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary border-primary' : 'hover:shadow-md'
        } ${className}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Thumbnail */}
            {anchor.thumb_url && (
              <div className="flex-shrink-0">
                <img
                  src={anchor.thumb_url}
                  alt={anchor.friendly_name}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
              </div>
            )}

            {/* Content */}
            <div 
              className={`flex-1 min-w-0 ${onSelect ? 'cursor-pointer' : ''}`}
              onClick={() => onSelect?.(anchor)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {anchor.friendly_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {anchor.kind}
                    </Badge>
                    <AnchorStatusBadge 
                      anchor={anchor}
                      status={status}
                      showDetails={true}
                    />
                  </div>
                </div>

                {/* Actions */}
                {showActions && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={isProcessing}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handlePreview}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver no App
                      </DropdownMenuItem>
                      
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(anchor)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem onClick={handleRefreshStatus}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Verificar Status
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {!status?.isValid && (
                        <DropdownMenuItem onClick={handleFindSimilar}>
                          <Search className="h-4 w-4 mr-2" />
                          Localizar Similar
                        </DropdownMenuItem>
                      )}

                      {!isArchived && (
                        <DropdownMenuItem 
                          onClick={handleArchive}
                          className="text-orange-600"
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Arquivar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Metadata */}
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Rota:</span>
                  <span>{anchor.route}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">ID:</span>
                  <code className="bg-muted px-1 rounded text-xs">
                    {anchor.anchor_id}
                  </code>
                </div>
                {anchor.selector && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Seletor:</span>
                    <code className="bg-muted px-1 rounded text-xs truncate">
                      {anchor.selector}
                    </code>
                  </div>
                )}
                {anchor.last_verified_at && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Verificado:</span>
                    <span>
                      {new Date(anchor.last_verified_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};