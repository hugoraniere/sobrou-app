import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { AnalyticsService } from '@/services/AnalyticsService';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector do elemento
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'add-transaction-btn',
    title: 'Adicionar Transação',
    description: 'Clique aqui sempre que quiser registrar um gasto ou receita',
    target: '[data-tour="add-transaction"]',
    position: 'bottom'
  },
  {
    id: 'category-chart',
    title: 'Gastos por Categoria',
    description: 'Veja onde seu dinheiro está sendo gasto de forma visual',
    target: '[data-tour="category-chart"]',
    position: 'top'
  },
  {
    id: 'payables-section',
    title: 'Contas a Pagar (BETA)',
    description: 'Acompanhe suas contas e nunca mais perca um vencimento',
    target: '[data-tour="upcoming-payables"]',
    position: 'top'
  }
];

export const ProductTour: React.FC = () => {
  const { isTourActive, setTourActive } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isTourActive) {
      AnalyticsService.trackTourShown();
    }
  }, [isTourActive]);

  useEffect(() => {
    if (!isTourActive || currentStep >= tourSteps.length) return;

    const step = tourSteps[currentStep];
    const element = document.querySelector(step.target) as HTMLElement;
    
    if (element) {
      setTargetElement(element);
      
      // Add spotlight effect
      element.style.position = 'relative';
      element.style.zIndex = '60';
      element.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      element.style.borderRadius = '8px';
      element.style.border = '2px solid hsl(var(--primary))';
      
      // Calculate tooltip position
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      let top, left;
      
      switch (step.position) {
        case 'bottom':
          top = rect.bottom + scrollTop + 10;
          left = rect.left + scrollLeft + (rect.width / 2) - 150;
          break;
        case 'top':
          top = rect.top + scrollTop - 120;
          left = rect.left + scrollLeft + (rect.width / 2) - 150;
          break;
        case 'left':
          top = rect.top + scrollTop + (rect.height / 2) - 60;
          left = rect.left + scrollLeft - 320;
          break;
        case 'right':
          top = rect.top + scrollTop + (rect.height / 2) - 60;
          left = rect.right + scrollLeft + 10;
          break;
        default:
          top = rect.bottom + scrollTop + 10;
          left = rect.left + scrollLeft;
      }
      
      setTooltipPosition({ top, left });
      
      // Scroll to element
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return () => {
      if (element) {
        // Remove spotlight effect
        element.style.position = '';
        element.style.zIndex = '';
        element.style.backgroundColor = '';
        element.style.borderRadius = '';
        element.style.border = '';
      }
    };
  }, [isTourActive, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      AnalyticsService.trackEvent('tour_step_next', { step: currentStep });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    setTourActive(false);
    setCurrentStep(0);
    AnalyticsService.trackTourSkipped();
  };

  const handleComplete = () => {
    setTourActive(false);
    setCurrentStep(0);
    AnalyticsService.trackEvent('tour_completed');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleSkip();
    }
  };

  useEffect(() => {
    if (isTourActive) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isTourActive, currentStep]);

  if (!isTourActive || currentStep >= tourSteps.length) return null;

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-50"
        onClick={handleSkip}
      />
      
      {/* Tooltip */}
      <Card 
        className="fixed z-60 w-80 shadow-xl"
        style={{ 
          top: tooltipPosition.top, 
          left: Math.max(10, Math.min(tooltipPosition.left, window.innerWidth - 320))
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="h-6 w-6 p-0 ml-2"
              aria-label="Fechar tour"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-xs"
              >
                Pular
              </Button>
              <Button
                onClick={handleNext}
                size="sm"
                className="text-xs"
              >
                {isLastStep ? 'Concluir' : 'Próximo'}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center mt-3">
            {currentStep + 1} de {tourSteps.length} • Enter avança • ESC fecha
          </div>
        </CardContent>
      </Card>
    </>
  );
};