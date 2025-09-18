import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ProductTourStep, UserTourProgress, TourContextType } from '@/types/product-tour';
import { ProductTourAdminService } from '@/services/ProductTourAdminService';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { useOnboardingVisibilityContext } from './OnboardingVisibilityContext';
import { useAnalyticsBatch } from '@/hooks/useAnalyticsBatch';

const ProductTourContext = createContext<TourContextType | undefined>(undefined);

interface ProductTourProviderProps {
  children: React.ReactNode;
}

export function ProductTourProvider({ children }: ProductTourProviderProps) {
  const [steps, setSteps] = useState<ProductTourStep[]>([]);
  const [currentStep, setCurrentStep] = useState<ProductTourStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState<UserTourProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const visibility = useOnboardingVisibilityContext();
  const { updateTourState } = useOnboardingState();
  const { trackEvent } = useAnalyticsBatch();

  // Tour is active if visibility shows it and we have steps
  const isActive = visibility.showProductTour && steps.length > 0 && currentStep !== null;

  // Memoize expensive calculations
  const totalSteps = useMemo(() => steps.length, [steps.length]);
  const isFirstStep = useMemo(() => currentStepIndex === 0, [currentStepIndex]);
  const isLastStep = useMemo(() => currentStepIndex === totalSteps - 1, [currentStepIndex, totalSteps]);
  const canNavigate = useMemo(() => !isLoading && totalSteps > 0, [isLoading, totalSteps]);

  // Load tour steps with caching
  const loadSteps = useCallback(async () => {
    if (!visibility.showProductTour) return;
    
    setIsLoading(true);
    try {
      const tourSteps = await ProductTourAdminService.getSteps();
      const activeSteps = tourSteps.filter(step => step.is_active).sort((a, b) => a.step_order - b.step_order);
      setSteps(activeSteps);
      
      if (activeSteps.length > 0) {
        setCurrentStep(activeSteps[0]);
        setCurrentStepIndex(0);
      }
    } catch (error) {
      console.error('Error loading tour steps:', error);
    } finally {
      setIsLoading(false);
    }
  }, [visibility.showProductTour]);

  // Start the tour
  const startTour = useCallback(async () => {
    await loadSteps();
    if (visibility.showProductTour) {
      trackEvent('tour_started', {
        totalSteps: steps.length,
        version: visibility.version
      });
    }
  }, [loadSteps, steps.length, visibility.version, visibility.showProductTour, trackEvent]);

  // Navigate to next step
  const nextStep = useCallback(async () => {
    if (!currentStep) return;
    
    trackEvent('tour_step_completed', {
      stepIndex: currentStepIndex,
      totalSteps: steps.length,
      stepKey: currentStep.step_key
    });

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStepIndex(nextIndex);
      setCurrentStep(steps[nextIndex]);
      
      // Update progress
      await updateTourState({
        last_step: nextIndex
      });
    } else {
      await completeTour();
    }
  }, [currentStep, currentStepIndex, steps, updateTourState, trackEvent]);

  // Navigate to previous step
  const previousStep = useCallback(async () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setCurrentStep(steps[prevIndex]);
      
      // Update progress
      await updateTourState({
        last_step: prevIndex
      });
    }
  }, [currentStepIndex, steps, updateTourState]);

  // Skip the entire tour
  const skipTour = useCallback(async () => {
    trackEvent('tour_skipped', {
      stepIndex: currentStepIndex,
      totalSteps: steps.length,
      stepKey: currentStep?.step_key
    });

    await updateTourState({
      dismissed: true
    });
    
    setCurrentStep(null);
    setCurrentStepIndex(0);
  }, [currentStep, currentStepIndex, steps.length, updateTourState, trackEvent]);

  // Complete the tour
  const completeTour = useCallback(async () => {
    trackEvent('tour_finished', {
      totalSteps: steps.length,
      completed: true,
      stepKey: currentStep?.step_key
    });

    await updateTourState({
      completed: true,
      last_step: steps.length
    });
    
    setCurrentStep(null);
    setCurrentStepIndex(0);
  }, [currentStep, steps.length, updateTourState, trackEvent]);

  // Go to a specific step
  const goToStep = useCallback(async (stepKey: string) => {
    const stepIndex = steps.findIndex(step => step.step_key === stepKey);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
      setCurrentStep(steps[stepIndex]);
      
      await updateTourState({
        last_step: stepIndex
      });
    }
  }, [steps, updateTourState]);

  // Load steps when visibility changes
  useEffect(() => {
    if (visibility.showProductTour && !visibility.loading) {
      loadSteps();
    }
  }, [visibility.showProductTour, visibility.loading, loadSteps]);

  const contextValue: TourContextType = useMemo(() => ({
    // State
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    progress,
    isLoading,
    steps,
    
    // Actions
    startTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    goToStep,
    
    // Utilities
    isFirstStep,
    isLastStep,
    canNavigate
  }), [
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    progress,
    isLoading,
    steps,
    startTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    goToStep,
    isFirstStep,
    isLastStep,
    canNavigate
  ]);

  return (
    <ProductTourContext.Provider value={contextValue}>
      {children}
    </ProductTourContext.Provider>
  );
}

export function useProductTour() {
  const context = useContext(ProductTourContext);
  if (context === undefined) {
    throw new Error('useProductTour must be used within a ProductTourProvider');
  }
  return context;
}