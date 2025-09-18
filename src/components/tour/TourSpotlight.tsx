import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const MAX_RETRIES = 10;

  // Enhanced element positioning with better viewport calculation
  const updatePosition = useCallback(() => {
    console.log(`🎯 Looking for element with tour-id: ${step.anchor_id}`);
    
    const element = document.querySelector(`[data-tour-id="${step.anchor_id}"]`);
    
    if (!element) {
      console.warn(`❌ Element with data-tour-id="${step.anchor_id}" not found (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      
      // Retry with progressive delays
      if (retryCount < MAX_RETRIES) {
        const delay = Math.min(500 * Math.pow(1.5, retryCount), 3000);
        console.log(`⏳ Retrying in ${delay}ms...`);
        
        retryTimeoutRef.current = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          updatePosition();
        }, delay);
      } else {
        console.error(`💥 Failed to find element after ${MAX_RETRIES} attempts`);
        setPosition({ top: 0, left: 0, width: 0, height: 0, found: false });
      }
      return;
    }

    console.log(`✅ Element found:`, element);

    // Ensure element is scrolled into perfect center view
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });

    // Wait for scroll to complete, then calculate position
    setTimeout(() => {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Add scroll offsets for absolute positioning
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      
      // Calculate absolute position with padding
      const padding = 8;
      const absoluteTop = rect.top + scrollY - padding;
      const absoluteLeft = rect.left + scrollX - padding;
      const width = rect.width + (padding * 2);
      const height = rect.height + (padding * 2);
      
      console.log(`📐 Position calculated:`, {
        element: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        viewport: { width: viewportWidth, height: viewportHeight },
        scroll: { x: scrollX, y: scrollY },
        final: { top: absoluteTop, left: absoluteLeft, width, height }
      });

      setPosition({
        top: Math.max(0, absoluteTop),
        left: Math.max(0, absoluteLeft),
        width,
        height,
        found: true
      });
      
      setRetryCount(0); // Reset retry count on success
    }, 600); // Increased wait time for scroll completion
  }, [step.anchor_id, retryCount]);

  // Smart tooltip positioning that never goes off-screen
  const getTooltipPosition = () => {
    if (!position.found || !tooltipRef.current) {
      return { top: 0, left: 0 };
    }

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const spacing = 20;
    
    // Spotlight center
    const spotlightCenterX = position.left + position.width / 2;
    const spotlightCenterY = position.top + position.height / 2;
    
    let tooltipTop = position.top + position.height + spacing;
    let tooltipLeft = spotlightCenterX - tooltipRect.width / 2;
    
    // Adjust vertically - prefer bottom, but use top if no space
    if (tooltipTop + tooltipRect.height > viewportHeight - spacing) {
      tooltipTop = position.top - tooltipRect.height - spacing;
    }
    
    // Ensure top positioning doesn't go negative
    if (tooltipTop < spacing) {
      // If neither top nor bottom work, place it beside the spotlight
      tooltipTop = Math.max(spacing, spotlightCenterY - tooltipRect.height / 2);
      
      // Try right side first
      tooltipLeft = position.left + position.width + spacing;
      
      // If right side doesn't fit, try left side
      if (tooltipLeft + tooltipRect.width > viewportWidth - spacing) {
        tooltipLeft = position.left - tooltipRect.width - spacing;
      }
    }

    // Final horizontal bounds check
    if (tooltipLeft + tooltipRect.width > viewportWidth - spacing) {
      tooltipLeft = viewportWidth - tooltipRect.width - spacing;
    }
    
    if (tooltipLeft < spacing) {
      tooltipLeft = spacing;
    }

    const finalPosition = {
      top: Math.max(spacing, tooltipTop),
      left: Math.max(spacing, tooltipLeft),
    };
    
    console.log(`🎪 Tooltip positioned:`, finalPosition);
    return finalPosition;
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
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
  }, [isFirstStep, isLastStep, onNext, onPrevious, onClose]);

  // Setup and cleanup
  useEffect(() => {
    console.log(`🚀 TourSpotlight mounted for step: ${step.title} (${step.anchor_id})`);
    
    // Simplified and robust scroll lock
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    // Find and position the spotlight
    updatePosition();
    
    // Add event listeners
    const handleResize = () => {
      console.log('📏 Window resized, updating position...');
      updatePosition();
    };
    
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyDown);
    
    // Show spotlight after a brief delay for smooth animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      console.log('✨ Spotlight now visible');
    }, 200);

    return () => {
      console.log(`🧹 TourSpotlight cleanup for step: ${step.title}`);
      
      // Restore scroll behavior
      document.body.style.overflow = originalBodyOverflow;
      
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(showTimer);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [step.anchor_id, step.title, updatePosition, handleKeyDown]);

  // Element not found fallback with auto-skip option
  if (!position.found) {
    console.log(`🚫 Rendering fallback for missing element: ${step.anchor_id}`);
    
    return (
      <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
        <Card className="max-w-md mx-4 animate-scale-in">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-text-primary">Elemento não encontrado</h3>
            <p className="text-text-secondary mb-4 text-sm">
              O elemento "{step.title}" não está disponível nesta página. 
              {retryCount < MAX_RETRIES && (
                <span className="block mt-2 text-xs text-text-secondary/80">
                  Tentativa {retryCount + 1} de {MAX_RETRIES}...
                </span>
              )}
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onSkip}
              >
                Pular Tour
              </Button>
              <Button 
                size="sm"
                onClick={!isLastStep ? onNext : onClose}
              >
                {!isLastStep ? 'Próximo Passo' : 'Finalizar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tooltipPosition = getTooltipPosition();
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <>
      {/* Enhanced overlay with smooth clip-path */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 z-[9998] transition-all duration-500",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        style={{
          clipPath: position.found 
            ? `polygon(0% 0%, 0% 100%, ${position.left}px 100%, ${position.left}px ${position.top}px, ${position.left + position.width}px ${position.top}px, ${position.left + position.width}px ${position.top + position.height}px, ${position.left}px ${position.top + position.height}px, ${position.left}px 100%, 100% 100%, 100% 0%)`
            : 'none'
        }}
      />

      {/* Enhanced spotlight with pulse animation */}
      <div
        className={cn(
          "fixed border-2 border-primary rounded-lg z-[9999] transition-all duration-500 pointer-events-none",
          isVisible 
            ? "opacity-100 shadow-[0_0_0_4px_hsl(var(--primary)/0.4),0_0_20px_hsl(var(--primary)/0.3)]" 
            : "opacity-0 scale-95"
        )}
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
        }}
      />

      {/* Enhanced tooltip with better animations */}
      <Card
        ref={tooltipRef}
        className={cn(
          "fixed z-[10000] max-w-sm shadow-2xl border-2 border-primary/20 transition-all duration-500",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        <CardContent className="p-5">
          {/* Enhanced header with better spacing */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-2">
              <h3 className="font-semibold text-base text-text-primary mb-2 leading-tight">
                {step.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <span className="font-medium">{currentStepIndex + 1} de {totalSteps}</span>
                <div className="flex-1">
                  <Progress 
                    value={progressPercentage} 
                    className="h-1.5" 
                  />
                </div>
                <span className="text-xs">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fechar tour (Esc)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Enhanced description */}
          <p className="text-sm text-text-secondary mb-5 leading-relaxed">
            {step.description}
          </p>

          {/* Enhanced controls with better spacing */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onPrevious}
                      disabled={isFirstStep}
                      className="h-9 px-3"
                    >
                      <ChevronLeft className="h-4 w-4" />
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
                      className="h-9 px-3 text-xs"
                    >
                      <SkipForward className="h-3.5 w-3.5 mr-1" />
                      Pular
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pular todo o tour</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Button
              size="sm"
              onClick={!isLastStep ? onNext : onClose}
              className="h-9 px-4 font-medium"
            >
              {!isLastStep ? (
                <>
                  Próximo <ChevronRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                'Finalizar Tour'
              )}
            </Button>
          </div>

          {/* Enhanced keyboard hints */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="text-xs text-text-secondary/70 space-y-1">
              <div className="flex justify-between">
                <span>↵ Enter • → Próximo</span>
                <span>← Anterior • Esc Fechar</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};