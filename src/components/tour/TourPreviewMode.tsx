import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ElementHighlighter } from './ElementHighlighter';
import { PostMessage, ElementMetadata, AnchorCandidate } from '@/types/anchor-picking';
import { AnchorGenerationService } from '@/services/AnchorGenerationService';

export const TourPreviewMode: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<AnchorCandidate | null>(null);
  const [instructions, setInstructions] = useState<string>('');

  const getCurrentRoute = useCallback(() => {
    return window.location.pathname;
  }, []);

  const handleElementHover = useCallback((element: Element) => {
    if (!isActive) return;

    const bbox = element.getBoundingClientRect();
    const metadata = AnchorGenerationService.extractMetadata(element);
    
    const candidate: AnchorCandidate = {
      element,
      metadata,
      bbox,
      selector: metadata.selector
    };

    setCurrentCandidate(candidate);

    // Enviar candidato para parent
    const message: PostMessage = {
      type: 'ANCHOR_CANDIDATE',
      route: getCurrentRoute(),
      bbox,
      meta: metadata
    };

    if (window.parent !== window) {
      window.parent.postMessage(message, window.location.origin);
    }
  }, [isActive, getCurrentRoute]);

  const handleElementClick = useCallback((element: Element, event: MouseEvent) => {
    if (!isActive) return;

    event.preventDefault();
    event.stopPropagation();

    const bbox = element.getBoundingClientRect();
    const metadata = AnchorGenerationService.extractMetadata(element);

    // Enviar elemento selecionado para parent
    const message: PostMessage = {
      type: 'ANCHOR_PICKED',
      route: getCurrentRoute(),
      bbox,
      elementMeta: metadata
    };

    if (window.parent !== window) {
      window.parent.postMessage(message, window.location.origin);
    }

    setIsActive(false);
    setCurrentCandidate(null);
    setInstructions('');
  }, [isActive, getCurrentRoute]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isActive) {
      setIsActive(false);
      setCurrentCandidate(null);
      setInstructions('');
      
      // Notificar parent sobre cancelamento
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'ANCHOR_PICK_STOP' }, window.location.origin);
      }
    }
  }, [isActive]);

  const isSelectableElement = useCallback((element: Element): boolean => {
    const tagName = element.tagName.toLowerCase();
    const excludedTags = ['html', 'body', 'head', 'script', 'style', 'meta', 'link'];
    
    if (excludedTags.includes(tagName)) return false;
    
    // Preferir elementos com data-tour-id
    if (element.hasAttribute('data-tour-id')) return true;
    
    // Elementos interativos são sempre selecionáveis
    const interactiveTags = ['button', 'input', 'select', 'textarea', 'a'];
    if (interactiveTags.includes(tagName)) return true;
    
    // Elementos com role interativo
    const role = element.getAttribute('role');
    const interactiveRoles = ['button', 'tab', 'menuitem', 'option'];
    if (role && interactiveRoles.includes(role)) return true;
    
    // Elementos com conteúdo significativo
    const hasSignificantContent = element.textContent?.trim().length || 0 > 0;
    const hasClass = element.className.length > 0;
    const hasId = element.id.length > 0;
    
    return hasSignificantContent && (hasClass || hasId);
  }, []);

  const throttledHover = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (element: Element) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => handleElementHover(element), 50); // 50ms throttle
      };
    })(),
    [handleElementHover]
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent<PostMessage>) => {
      // Validar origem por segurança
      if (event.origin !== window.location.origin) return;

      const { data } = event;

      if (data.type === 'ANCHOR_PICK_START') {
        setIsActive(true);
        setInstructions('Passe o mouse sobre os elementos e clique para selecionar');
      }

      if (data.type === 'ANCHOR_PICK_STOP') {
        setIsActive(false);
        setCurrentCandidate(null);
        setInstructions('');
      }

      if (data.type === 'ANCHOR_HIGHLIGHT' && data.anchorId) {
        // Destacar âncora específica para preview
        const element = document.querySelector(`[data-tour-id="${data.anchorId}"]`);
        if (element) {
          const bbox = element.getBoundingClientRect();
          const metadata = AnchorGenerationService.extractMetadata(element);
          
          setCurrentCandidate({
            element,
            metadata,
            bbox,
            selector: metadata.selector
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const handleDocumentMouseOver = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isSelectableElement(target)) {
        throttledHover(target);
      }
    };

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isSelectableElement(target)) {
        handleElementClick(target, event);
      }
    };

    document.addEventListener('mouseover', handleDocumentMouseOver, { passive: false });
    document.addEventListener('click', handleDocumentClick, { capture: true });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mouseover', handleDocumentMouseOver);
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, isSelectableElement, throttledHover, handleElementClick, handleKeyDown]);

  if (!isActive && !currentCandidate) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Overlay de instrução */}
      {isActive && instructions && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg text-sm font-medium pointer-events-none">
          {instructions}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rotate-45 -mt-1" />
        </div>
      )}

      {/* Highlight do elemento atual */}
      {currentCandidate && (
        <ElementHighlighter
          element={currentCandidate.element}
          bbox={currentCandidate.bbox}
          metadata={currentCandidate.metadata}
          isActive={isActive}
        />
      )}

      {/* Overlay escuro quando ativo */}
      {isActive && (
        <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none" />
      )}
    </div>,
    document.body
  );
};