import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ProductTourService } from '@/services/productTourService';
import { ProductTourStep, UserTourProgress, TourContextType } from '@/types/product-tour';

const ProductTourContext = createContext<TourContextType | null>(null);

interface ProductTourProviderProps {
  children: React.ReactNode;
}

export const ProductTourProvider: React.FC<ProductTourProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<ProductTourStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [progress, setProgress] = useState<UserTourProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<ProductTourStep[]>([]);
  const [sessionId] = useState(() => crypto.randomUUID());

  // Derived state
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const canNavigate = !isLoading;

  // Load tour steps
  const loadTourSteps = useCallback(async () => {
    try {
      const tourSteps = await ProductTourService.getTourSteps();
      setSteps(tourSteps);
      setTotalSteps(tourSteps.length);
      return tourSteps;
    } catch (error) {
      console.error('Error loading tour steps:', error);
      return [];
    }
  }, []);

  // Load user progress
  const loadUserProgress = useCallback(async () => {
    if (!user?.id) return null;
    
    try {
      const userProgress = await ProductTourService.getUserProgress(user.id);
      setProgress(userProgress);
      return userProgress;
    } catch (error) {
      console.error('Error loading user progress:', error);
      return null;
    }
  }, [user?.id]);

  // Find step by key
  const findStepByKey = useCallback((stepKey: string) => {
    return steps.find(step => step.step_key === stepKey);
  }, [steps]);

  // Find step index
  const findStepIndex = useCallback((stepKey: string) => {
    return steps.findIndex(step => step.step_key === stepKey);
  }, [steps]);

  // Navigate to page if needed
  const navigateToStepPage = useCallback(async (step: ProductTourStep) => {
    const currentPath = location.pathname;
    const targetPath = step.page_route;
    
    if (currentPath !== targetPath) {
      await ProductTourService.logEvent('navigation_required', {
        userId: user?.id,
        sessionId,
        stepKey: step.step_key,
        pageRoute: targetPath,
        eventData: { from: currentPath, to: targetPath }
      });
      
      navigate(targetPath);
      
      // Wait for navigation and DOM to settle
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
  }, [location.pathname, navigate, user?.id, sessionId]);

  // Wait for element to be available
  const waitForElement = useCallback((anchorId: string, maxAttempts = 20): Promise<Element | null> => {
    return new Promise((resolve) => {
      let attempts = 0;
      
      const checkElement = () => {
        const element = document.querySelector(`[data-tour-id="${anchorId}"]`);
        
        if (element) {
          resolve(element);
          return;
        }
        
        attempts++;
        if (attempts >= maxAttempts) {
          console.warn(`Element with tour-id "${anchorId}" not found after ${maxAttempts} attempts`);
          resolve(null);
          return;
        }
        
        setTimeout(checkElement, 250);
      };
      
      checkElement();
    });
  }, []);

  // Start tour
  const startTour = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      const tourSteps = steps.length > 0 ? steps : await loadTourSteps();
      
      if (tourSteps.length === 0) {
        console.warn('No tour steps available');
        return;
      }

      // Initialize progress
      const newProgress = await ProductTourService.startTour(user.id, tourSteps.length);
      setProgress(newProgress);
      
      // Log tour start
      await ProductTourService.logEvent('tour_started', {
        userId: user.id,
        sessionId,
        eventData: { total_steps: tourSteps.length }
      });

      // Set first step
      const firstStep = tourSteps[0];
      setCurrentStep(firstStep);
      setCurrentStepIndex(0);
      setIsActive(true);

      // Navigate to first step page if needed
      await navigateToStepPage(firstStep);
      
    } catch (error) {
      console.error('Error starting tour:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, steps, loadTourSteps, sessionId, navigateToStepPage]);

  // Go to specific step
  const goToStep = useCallback(async (stepKey: string) => {
    if (!user?.id || !canNavigate) return;
    
    const step = findStepByKey(stepKey);
    const stepIndex = findStepIndex(stepKey);
    
    if (!step || stepIndex === -1) {
      console.warn(`Step "${stepKey}" not found`);
      return;
    }

    setIsLoading(true);

    try {
      // Navigate to step page if needed
      await navigateToStepPage(step);
      
      // Wait for element
      const element = await waitForElement(step.anchor_id);
      
      if (!element) {
        console.warn(`Element for step "${stepKey}" not found, skipping to next step`);
        // Skip to next step if element not found
        if (stepIndex < steps.length - 1) {
          const nextStep = steps[stepIndex + 1];
          await goToStep(nextStep.step_key);
        }
        return;
      }

      // Update progress
      await ProductTourService.updateCurrentStep(user.id, stepKey, stepIndex + 1);
      
      // Log step view
      await ProductTourService.logEvent('step_viewed', {
        userId: user.id,
        sessionId,
        stepKey,
        pageRoute: step.page_route,
        eventData: { step_index: stepIndex + 1 }
      });

      // Update state
      setCurrentStep(step);
      setCurrentStepIndex(stepIndex);
      
      // Scroll element into view
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });

    } catch (error) {
      console.error(`Error going to step "${stepKey}":`, error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, canNavigate, findStepByKey, findStepIndex, navigateToStepPage, waitForElement, steps, sessionId]);

  // Next step
  const nextStep = useCallback(async () => {
    if (!currentStep || isLastStep || !canNavigate) return;
    
    // Log current step completion
    await ProductTourService.logEvent('step_completed', {
      userId: user?.id,
      sessionId,
      stepKey: currentStep.step_key,
      pageRoute: currentStep.page_route,
      eventData: { step_index: currentStepIndex + 1 }
    });

    const nextStepIndex = currentStepIndex + 1;
    const nextStepObj = steps[nextStepIndex];
    
    if (nextStepObj) {
      await goToStep(nextStepObj.step_key);
    }
  }, [currentStep, isLastStep, canNavigate, user?.id, sessionId, currentStepIndex, steps, goToStep]);

  // Previous step
  const previousStep = useCallback(async () => {
    if (!currentStep || isFirstStep || !canNavigate) return;
    
    const prevStepIndex = currentStepIndex - 1;
    const prevStepObj = steps[prevStepIndex];
    
    if (prevStepObj) {
      await goToStep(prevStepObj.step_key);
    }
  }, [currentStep, isFirstStep, canNavigate, currentStepIndex, steps, goToStep]);

  // Complete tour
  const completeTour = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Log current step completion if there's a current step
      if (currentStep) {
        await ProductTourService.logEvent('step_completed', {
          userId: user.id,
          sessionId,
          stepKey: currentStep.step_key,
          pageRoute: currentStep.page_route,
          eventData: { step_index: currentStepIndex + 1 }
        });
      }

      // Update progress
      await ProductTourService.completeTour(user.id);
      
      // Log tour completion
      await ProductTourService.logEvent('tour_completed', {
        userId: user.id,
        sessionId,
        eventData: { 
          total_steps: totalSteps,
          completed_steps: totalSteps
        }
      });

      // Reset state
      setIsActive(false);
      setCurrentStep(null);
      setCurrentStepIndex(0);
      
      // Reload progress
      await loadUserProgress();
      
    } catch (error) {
      console.error('Error completing tour:', error);
    }
  }, [user?.id, currentStep, sessionId, currentStepIndex, totalSteps, loadUserProgress]);

  // Skip tour
  const skipTour = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Update progress
      await ProductTourService.skipTour(user.id);
      
      // Log tour skip
      await ProductTourService.logEvent('tour_skipped', {
        userId: user.id,
        sessionId,
        stepKey: currentStep?.step_key,
        pageRoute: currentStep?.page_route,
        eventData: { 
          step_index: currentStepIndex + 1,
          total_steps: totalSteps
        }
      });

      // Reset state
      setIsActive(false);
      setCurrentStep(null);
      setCurrentStepIndex(0);
      
      // Reload progress
      await loadUserProgress();
      
    } catch (error) {
      console.error('Error skipping tour:', error);
    }
  }, [user?.id, sessionId, currentStep, currentStepIndex, totalSteps, loadUserProgress]);

  // Initialize tour on mount
  useEffect(() => {
    const initializeTour = async () => {
      if (!user?.id) return;

      // Load steps and progress
      await Promise.all([
        loadTourSteps(),
        loadUserProgress()
      ]);

      // Check if should auto-start tour
      const shouldAutoStart = await ProductTourService.shouldAutoStartTour(user.id);
      if (shouldAutoStart) {
        // Small delay to ensure UI is ready
        setTimeout(() => {
          startTour();
        }, 2000);
      }
    };

    initializeTour();
  }, [user?.id, loadTourSteps, loadUserProgress, startTour]);

  const contextValue: TourContextType = {
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
    canNavigate,
  };

  return (
    <ProductTourContext.Provider value={contextValue}>
      {children}
    </ProductTourContext.Provider>
  );
};

export const useProductTour = (): TourContextType => {
  const context = useContext(ProductTourContext);
  if (!context) {
    throw new Error('useProductTour must be used within a ProductTourProvider');
  }
  return context;
};