import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight, X, SkipForward } from 'lucide-react';
import { TourSpotlightProps, SpotlightPosition } from '@/types/product-tour';
import { cn } from '@/lib/utils';

export const TourSpotlight: React.FC<TourSpotlightProps> = ({
  step,
  onNext,
  onPrevious,
  onSkip,
  onClose,
  isFirstStep,
  isLastStep,
  currentStepIndex,
  totalSteps
}) => {
  const [position, setPosition] = useState<SpotlightPosition>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    found: false
  });
  const [isVisible, setIsVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const maxRetries = 10;

  // Calculate element position and create spotlight with smart positioning
  const updatePosition = () => {
    const element = document.querySelector(`[data-tour-id="${step.anchor_id}"]`);
    
    if (!element) {
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          updatePosition();
        }, 500 + (retryCount * 200)); // Progressive delay
      } else {
        setPosition(prev => ({ ...prev, found: false }));
      }
      return;
    }

    const rect = element.getBoundingClientRect();
    const padding = 8;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Calculate position relative to current viewport (since body is fixed)
    const currentTop = parseInt(document.body.style.top?.replace('-', '').replace('px', '')) || 0;
    
    // Calculate tooltip dimensions (estimate)
    const tooltipHeight = 200; // Approximate tooltip height
    const tooltipWidth = 384; // max-w-sm = 384px
    const spacing = 16;
    
    // Smart positioning: ensure both element and tooltip are visible
    const elementCenterY = rect.top + rect.height / 2;
    const elementBottom = rect.bottom;
    const elementTop = rect.top;
    
    // Calculate the optimal scroll position
    let optimalScrollY = currentTop;
    
    // Determine tooltip position preference
    const tooltipBelowElement = elementBottom + spacing + tooltipHeight < viewportHeight;
    const tooltipAboveElement = elementTop - spacing - tooltipHeight > 0;
    
    if (!tooltipBelowElement && !tooltipAboveElement) {
      // If tooltip doesn't fit above or below, center the element
      const viewportCenter = viewportHeight / 2;
      const scrollAdjustment = elementCenterY - viewportCenter;
      optimalScrollY = Math.max(0, currentTop + scrollAdjustment);
    } else if (!tooltipBelowElement && tooltipAboveElement) {
      // Tooltip needs to go above, ensure element is visible in lower half
      const targetY = viewportHeight * 0.7;
      if (elementCenterY > targetY) {
        const scrollAdjustment = elementCenterY - targetY;
        optimalScrollY = Math.max(0, currentTop + scrollAdjustment);
      }
    } else if (tooltipBelowElement) {
      // Tooltip can go below, ensure element is visible in upper half
      const targetY = viewportHeight * 0.3;
      if (elementCenterY < targetY) {
        const scrollAdjustment = elementCenterY - targetY;
        optimalScrollY = Math.max(0, currentTop + scrollAdjustment);
      }
    }
    
    // Apply smooth scroll adjustment if needed
    if (Math.abs(optimalScrollY - currentTop) > 10) {
      document.body.style.top = `-${optimalScrollY}px`;
      
      // Update position after scroll adjustment
      setTimeout(() => {
        const newRect = element.getBoundingClientRect();
        setPosition({
          top: newRect.top + optimalScrollY - padding,
          left: newRect.left - padding,
          width: newRect.width + (padding * 2),
          height: newRect.height + (padding * 2),
          found: true
        });
      }, 150);
    } else {
      // No scroll needed, set position immediately
      setPosition({
        top: rect.top + currentTop - padding,
        left: rect.left - padding,
        width: rect.width + (padding * 2),
        height: rect.height + (padding * 2),
        found: true
      });
    }
    
    setRetryCount(0); // Reset retry count on success
  };

  // Position tooltip relative to spotlight
  const getTooltipPosition = () => {
    if (!position.found || !tooltipRef.current) return {};

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const spacing = 16;

    let tooltipTop = position.top + position.height + spacing;
    let tooltipLeft = position.left;

    // Adjust if tooltip goes below viewport
    if (tooltipTop + tooltipRect.height > viewportHeight - spacing) {
      tooltipTop = position.top - tooltipRect.height - spacing;
    }

    // Adjust if tooltip goes outside viewport horizontally
    if (tooltipLeft + tooltipRect.width > viewportWidth - spacing) {
      tooltipLeft = viewportWidth - tooltipRect.width - spacing;
    }
    
    if (tooltipLeft < spacing) {
      tooltipLeft = spacing;
    }

    return {
      top: Math.max(spacing, tooltipTop),
      left: Math.max(spacing, tooltipLeft),
    };
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'Enter':
        e.preventDefault();
        if (!isLastStep) {
          onNext();
        } else {
          onClose();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (!isFirstStep) {
          onPrevious();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  // Setup and cleanup
  useEffect(() => {
    // Lock page scroll by fixing body position
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
    
    updatePosition();
    
    // Only handle resize events since scroll is disabled
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updatePosition, 100);
    };
    
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyDown);
    
    // Show spotlight after position is calculated
    const timer = setTimeout(() => setIsVisible(true), 150);
    
    return () => {
      // Restore page scroll and position
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      
      if (scrollY) {
        const scrollPos = parseInt(scrollY.replace('-', '').replace('px', '')) || 0;
        window.scrollTo(0, scrollPos);
      }
      
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [step.anchor_id, isFirstStep, isLastStep, retryCount]);

  // Don't render if element not found
  if (!position.found) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Elemento não encontrado</h3>
            <p className="text-text-secondary mb-4">
              O elemento "{step.title}" não está disponível nesta página.
            </p>
            <Button onClick={!isLastStep ? onNext : onClose}>
              {!isLastStep ? 'Próximo' : 'Finalizar'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tooltipPosition = getTooltipPosition();
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        style={{
          clipPath: position.found 
            ? `polygon(0% 0%, 0% 100%, ${position.left}px 100%, ${position.left}px ${position.top}px, ${position.left + position.width}px ${position.top}px, ${position.left + position.width}px ${position.top + position.height}px, ${position.left}px ${position.top + position.height}px, ${position.left}px 100%, 100% 100%, 100% 0%)`
            : 'none'
        }}
      />

      {/* Spotlight highlight */}
      <div
        className={cn(
          "fixed border-2 border-primary rounded-lg z-[9999] transition-all duration-300 pointer-events-none",
          isVisible ? "opacity-100 shadow-[0_0_0_4px_hsl(var(--primary)/0.3)]" : "opacity-0"
        )}
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
        }}
      />

      {/* Tooltip */}
      <Card
        ref={tooltipRef}
        className={cn(
          "fixed z-[10000] max-w-sm shadow-lg transition-all duration-300",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-text-primary mb-1">
                {step.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span>{currentStepIndex + 1} de {totalSteps}</span>
                <div className="flex-1">
                  <Progress value={progressPercentage} className="h-1" />
                </div>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-6 w-6 p-0 ml-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fechar tour (Esc)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary mb-4 leading-relaxed">
            {step.description}
          </p>

          {/* Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onPrevious}
                      disabled={isFirstStep}
                      className="h-8 px-2"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Passo anterior (←)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onSkip}
                      className="h-8 px-2"
                    >
                      <SkipForward className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pular tour</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Button
              size="sm"
              onClick={!isLastStep ? onNext : onClose}
              className="h-8 px-3"
            >
              {!isLastStep ? (
                <>
                  Próximo <ChevronRight className="h-3 w-3 ml-1" />
                </>
              ) : (
                'Finalizar'
              )}
            </Button>
          </div>

          {/* Keyboard hints */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="text-xs text-text-secondary/80 space-y-1">
              <div>↵ Enter ou → Próximo</div>
              <div>← Anterior  •  Esc Fechar</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};