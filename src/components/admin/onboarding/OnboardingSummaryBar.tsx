import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Play, RotateCcw, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface OnboardingSummaryBarProps {
  type: 'tour' | 'stepper';
  status: {
    enabled: boolean;
    visibility: string;
    audience: string;
    version: string;
    lastPublished?: string;
  };
  onPreview: () => void;
  onPublish: () => void;
  onRevert?: () => void;
  onReset: () => void;
  className?: string;
}

export function OnboardingSummaryBar({
  type,
  status,
  onPreview,
  onPublish,
  onRevert,
  onReset,
  className = ''
}: OnboardingSummaryBarProps) {
  const getStatusColor = () => {
    return status.enabled ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground';
  };

  const getVisibilityText = () => {
    const visibilityMap: Record<string, string> = {
      first_login: 'Apenas primeiro acesso',
      until_complete: 'Até completar',
      always: 'Sempre visível'
    };
    return visibilityMap[status.visibility] || status.visibility;
  };

  const getAudienceText = () => {
    return status.audience === 'new_users' ? 'Usuários novos' : 'Todos os usuários';
  };

  return (
    <Card className={`border-l-4 ${status.enabled ? 'border-l-success' : 'border-l-muted'} ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Status Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor()}>
                {status.enabled ? 'Ativo' : 'Inativo'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {type === 'tour' ? 'Product Tour' : 'Stepper'}
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Visibilidade:</span>
                <span className="ml-1 font-medium">{getVisibilityText()}</span>
              </div>
              
              <div>
                <span className="text-muted-foreground">Público:</span>
                <span className="ml-1 font-medium">{getAudienceText()}</span>
              </div>
              
              <div>
                <span className="text-muted-foreground">Versão:</span>
                <span className="ml-1 font-medium">{status.version}</span>
              </div>
              
              {status.lastPublished && (
                <div>
                  <span className="text-muted-foreground">Publicado:</span>
                  <span className="ml-1 font-medium">{status.lastPublished}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            
            <Button
              size="sm"
              onClick={onPublish}
              className="gap-2"
              disabled={!status.enabled}
            >
              <Play className="w-4 h-4" />
              Publicar
            </Button>
            
            {onRevert && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRevert}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reverter
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <RefreshCw className="w-4 h-4" />
              Resetar
            </Button>
          </div>
        </div>

        {/* Mobile Info */}
        <div className="md:hidden mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Visibilidade:</span>
            <div className="font-medium">{getVisibilityText()}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Público:</span>
            <div className="font-medium">{getAudienceText()}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Versão:</span>
            <div className="font-medium">{status.version}</div>
          </div>
          {status.lastPublished && (
            <div>
              <span className="text-muted-foreground">Publicado:</span>
              <div className="font-medium">{status.lastPublished}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}