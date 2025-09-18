import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, MousePointer, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAnchorPicking } from '@/hooks/useAnchorPicking';
import { SitePreviewModal } from './SitePreviewModal';

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
    isModalOpen,
    openModal,
    closeModal,
    handleModalMessage
  } = useAnchorPicking({
    onAnchorSelected
  });

  const handleStartPicking = () => {
    openModal();
  };

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleStartPicking}
        disabled={disabled || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <MousePointer className="h-4 w-4 mr-2" />
        )}
        Selecionar no App
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
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

      <SitePreviewModal 
        open={isModalOpen}
        onClose={closeModal}
        onAnchorPicked={handleModalMessage}
        isProcessing={isProcessing}
      />
    </div>
  );
};