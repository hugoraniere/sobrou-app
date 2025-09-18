import { useState, useCallback, useEffect } from 'react';
import { PostMessage, GeneratedAnchor } from '@/types/anchor-picking';
import { AnchorGenerationService } from '@/services/AnchorGenerationService';

export interface UseAnchorPickingReturn {
  isPickingMode: boolean;
  isProcessing: boolean;
  error: string | null;
  startPicking: () => void;
  stopPicking: () => void;
  onAnchorPicked: (anchor: GeneratedAnchor) => void;
}

interface UseAnchorPickingProps {
  onAnchorSelected?: (anchorId: string) => void;
  targetOrigin?: string;
}

export const useAnchorPicking = ({
  onAnchorSelected,
  targetOrigin = window.location.origin
}: UseAnchorPickingProps = {}): UseAnchorPickingReturn => {
  const [isPickingMode, setIsPickingMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startPicking = useCallback(() => {
    setIsPickingMode(true);
    setError(null);
    
    // Enviar mensagem para iframe ou janela
    const message: PostMessage = { type: 'ANCHOR_PICK_START' };
    
    // Se estamos no iframe, enviar para parent
    if (window.parent !== window) {
      window.parent.postMessage(message, targetOrigin);
    }
    // Se estamos no parent, enviar para iframe
    else {
      const iframe = document.querySelector('iframe');
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(message, targetOrigin);
      }
    }
  }, [targetOrigin]);

  const stopPicking = useCallback(() => {
    setIsPickingMode(false);
    setError(null);
    
    const message: PostMessage = { type: 'ANCHOR_PICK_STOP' };
    
    if (window.parent !== window) {
      window.parent.postMessage(message, targetOrigin);
    } else {
      const iframe = document.querySelector('iframe');
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(message, targetOrigin);
      }
    }
  }, [targetOrigin]);

  const onAnchorPicked = useCallback(async (anchor: GeneratedAnchor) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const success = await AnchorGenerationService.persistAnchor(anchor);
      
      if (success) {
        onAnchorSelected?.(anchor.anchor_id);
        stopPicking();
      } else {
        setError('Falha ao salvar a âncora');
      }
    } catch (err) {
      console.error('Error processing picked anchor:', err);
      setError('Erro ao processar a âncora selecionada');
    } finally {
      setIsProcessing(false);
    }
  }, [onAnchorSelected, stopPicking]);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent<PostMessage>) => {
      // Validar origem
      if (event.origin !== targetOrigin) {
        console.warn('Message from invalid origin:', event.origin);
        return;
      }

      const { data } = event;

      if (data.type === 'ANCHOR_PICKED') {
        try {
          const generatedAnchor = await AnchorGenerationService.generateAnchor(
            data.route,
            data.bbox,
            data.elementMeta
          );
          
          await onAnchorPicked(generatedAnchor);
        } catch (error) {
          console.error('Error generating anchor:', error);
          setError('Erro ao gerar âncora');
        }
      }
      
      if (data.type === 'ANCHOR_CANDIDATE') {
        // Feedback visual - pode ser implementado depois se necessário
        console.log('Anchor candidate:', data);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [targetOrigin, onAnchorPicked]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (isPickingMode) {
        stopPicking();
      }
    };
  }, [isPickingMode, stopPicking]);

  return {
    isPickingMode,
    isProcessing,
    error,
    startPicking,
    stopPicking,
    onAnchorPicked
  };
};