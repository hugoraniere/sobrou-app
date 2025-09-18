import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Trash2, Search, Archive, AlertCircle, CheckCircle } from 'lucide-react';
import { AnchorReindexManager } from './AnchorReindexManager';
import { useAnchorMaintenance } from '@/hooks/useAnchorMaintenance';
import { OnboardingAnchor } from '@/types/onboarding-anchors';
import { ThumbnailCleanupResult } from '@/types/anchor-maintenance';

interface AnchorMaintenancePanelProps {
  anchors: OnboardingAnchor[];
  onAnchorUpdate?: () => void;
  className?: string;
}

export const AnchorMaintenancePanel: React.FC<AnchorMaintenancePanelProps> = ({
  anchors,
  onAnchorUpdate,
  className
}) => {
  const [cleanupResult, setCleanupResult] = useState<ThumbnailCleanupResult | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [selectedInvalidAnchor, setSelectedInvalidAnchor] = useState<OnboardingAnchor | null>(null);

  const {
    checkMultipleAnchorsStatus,
    isLoadingStatuses,
    findSimilarElements,
    suggestions,
    isLoadingSuggestions,
    archiveAnchor,
    cleanupThumbnails,
    clearSuggestions
  } = useAnchorMaintenance();

  const handleCheckAllAnchors = async () => {
    await checkMultipleAnchorsStatus(anchors);
    onAnchorUpdate?.();
  };

  const handleCleanupThumbnails = async () => {
    setIsCleaningUp(true);
    try {
      const result = await cleanupThumbnails();
      setCleanupResult(result);
    } catch (error) {
      setCleanupResult({
        cleaned: 0,
        errors: [`Erro na limpeza: ${error}`],
        totalSize: 0
      });
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handleFindSimilarElements = async (anchor: OnboardingAnchor) => {
    setSelectedInvalidAnchor(anchor);
    await findSimilarElements(anchor);
  };

  const handleArchiveAnchor = async (anchorId: string) => {
    try {
      await archiveAnchor(anchorId);
      onAnchorUpdate?.();
      clearSuggestions();
      setSelectedInvalidAnchor(null);
    } catch (error) {
      console.error('Failed to archive anchor:', error);
    }
  };

  const invalidAnchors = anchors.filter(anchor => 
    anchor.tags?.includes('archived') || 
    // Add other criteria for invalid anchors here
    false
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Reindex Manager */}
      <AnchorReindexManager 
        onComplete={() => onAnchorUpdate?.()} 
      />

      <Separator />

      {/* Maintenance Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações de Manutenção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Check All Anchors */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Verificar Status das Âncoras</div>
              <div className="text-sm text-muted-foreground">
                Verifica se todas as âncoras estão funcionando corretamente
              </div>
            </div>
            <Button
              onClick={handleCheckAllAnchors}
              disabled={isLoadingStatuses}
              variant="outline"
            >
              <Search className="h-4 w-4 mr-2" />
              {isLoadingStatuses ? 'Verificando...' : 'Verificar Todas'}
            </Button>
          </div>

          <Separator />

          {/* Cleanup Thumbnails */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Limpeza de Thumbnails</div>
              <div className="text-sm text-muted-foreground">
                Remove thumbnails antigas e duplicadas para economizar espaço
              </div>
            </div>
            <Button
              onClick={handleCleanupThumbnails}
              disabled={isCleaningUp}
              variant="outline"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isCleaningUp ? 'Limpando...' : 'Limpar Storage'}
            </Button>
          </div>

          {/* Cleanup Results */}
          {cleanupResult && (
            <Alert variant={cleanupResult.errors.length > 0 ? 'destructive' : 'default'}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <div>
                    Limpeza concluída: {cleanupResult.cleaned} thumbnails removidas
                  </div>
                  {cleanupResult.errors.length > 0 && (
                    <div className="text-sm">
                      <div className="font-medium">Erros:</div>
                      {cleanupResult.errors.map((error, index) => (
                        <div key={index}>• {error}</div>
                      ))}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Invalid Anchors Management */}
      {invalidAnchors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Âncoras Inválidas ({invalidAnchors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invalidAnchors.map(anchor => (
              <div key={anchor.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{anchor.friendly_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {anchor.route} • {anchor.anchor_id}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleFindSimilarElements(anchor)}
                    disabled={isLoadingSuggestions}
                    size="sm"
                    variant="outline"
                  >
                    <Search className="h-4 w-4 mr-1" />
                    Localizar
                  </Button>
                  <Button
                    onClick={() => handleArchiveAnchor(anchor.anchor_id)}
                    size="sm"
                    variant="outline"
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Arquivar
                  </Button>
                </div>
              </div>
            ))}

            {/* Suggestions for Selected Invalid Anchor */}
            {selectedInvalidAnchor && suggestions.length > 0 && (
              <Alert>
                <Search className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">
                      Sugestões para "{selectedInvalidAnchor.friendly_name}":
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded">
                        <div className="font-medium">
                          Similaridade: {Math.round(suggestion.score * 100)}%
                        </div>
                        <div className="text-muted-foreground">
                          {suggestion.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};