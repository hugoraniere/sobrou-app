import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { PostMessage } from '@/types/anchor-picking';

interface SitePreviewModalProps {
  open: boolean;
  onClose: () => void;
  onAnchorPicked: (message: PostMessage) => void;
  isProcessing?: boolean;
}

export const SitePreviewModal: React.FC<SitePreviewModalProps> = ({
  open,
  onClose,
  onAnchorPicked,
  isProcessing = false
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (!open) {
      setIframeLoaded(false);
      return;
    }

    const handleMessage = (event: MessageEvent<PostMessage>) => {
      // Verificar se a mensagem vem do iframe
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      const { data } = event;
      
      if (data.type === 'ANCHOR_PICKED' || data.type === 'ANCHOR_CANDIDATE') {
        onAnchorPicked(data);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [open, onAnchorPicked]);

  const startPicking = () => {
    if (iframeRef.current?.contentWindow && iframeLoaded) {
      const message: PostMessage = { type: 'ANCHOR_PICK_START' };
      iframeRef.current.contentWindow.postMessage(message, window.location.origin);
    }
  };

  const stopPicking = () => {
    if (iframeRef.current?.contentWindow) {
      const message: PostMessage = { type: 'ANCHOR_PICK_STOP' };
      iframeRef.current.contentWindow.postMessage(message, window.location.origin);
    }
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    // Auto-iniciar o modo de seleção quando o iframe carregar
    setTimeout(() => {
      startPicking();
    }, 500);
  };

  const handleClose = () => {
    stopPicking();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Selecionar Elemento no Site</DialogTitle>
            <div className="flex items-center gap-2">
              {isProcessing && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Clique em qualquer elemento no site abaixo para criar uma âncora. 
            Pressione <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> para cancelar.
          </p>
        </DialogHeader>
        
        <div className="flex-1 relative border rounded-md overflow-hidden">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Carregando site...
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={window.location.origin}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            title="Preview do Site"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};