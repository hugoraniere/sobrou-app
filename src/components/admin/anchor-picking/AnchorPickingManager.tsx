import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, MousePointer, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAnchorPicking } from '@/hooks/useAnchorPicking';

interface AnchorPickingManagerProps {
  onAnchorSelected?: (anchorId: string) => void;
  disabled?: boolean;
}

export const AnchorPickingManager: React.FC<AnchorPickingManagerProps> = ({
  onAnchorSelected,
  disabled = false
}) => {
  const {
    isPickingMode,
    isProcessing,
    error,
    startPicking,
    stopPicking
  } = useAnchorPicking({
    onAnchorSelected
  });

  const handleTogglePicking = () => {
    if (isPickingMode) {
      stopPicking();
    } else {
      startPicking();
    }
  };

  return (
    <div className="space-y-3">
      <Button
        variant={isPickingMode ? "destructive" : "outline"}
        size="sm"
        onClick={handleTogglePicking}
        disabled={disabled || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <MousePointer className="h-4 w-4 mr-2" />
        )}
        {isPickingMode ? 'Parar Seleção' : 'Selecionar no App'}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isPickingMode && (
        <Alert>
          <MousePointer className="h-4 w-4" />
          <AlertDescription>
            Modo de seleção ativo. Clique em um elemento no preview para criar uma âncora.
            <br />
            Pressione <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Esc</kbd> para cancelar.
          </AlertDescription>
        </Alert>
      )}

      {isProcessing && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            Processando âncora selecionada...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};