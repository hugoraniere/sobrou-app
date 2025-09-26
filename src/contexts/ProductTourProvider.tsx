import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ProductTourService } from '@/services/productTourService';
import { ReleaseNotesService } from '@/services/releaseNotesService';
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
  const [steps, setSteps] = useState<ProductTourStep[]>([]);
  const [progress, setProgress] = useState<UserTourProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canShowTour, setCanShowTour] = useState(false);

  // Load tour data
  useEffect(() => {
    if (user?.id) {
      loadTourData();
    }
  }, [user?.id]);

  // Integration with Release Notes - prevent multiple modals
  useEffect(() => {
    const checkReleaseNotes = async () => {
      if (!user?.id) return;

      try {
        const activeReleaseNote = await ReleaseNotesService.getUndismissedActiveReleaseNote();
        
        // If there's an active release note, prevent tour from starting
        if (activeReleaseNote) {
          setCanShowTour(false);
          return;
        }

        // Check if tour should be shown
        const tourEnabled = await ProductTourService.isTourEnabled();
        const shouldAutoStart = await ProductTourService.shouldAutoStartTour(user.id);
        
        setCanShowTour(tourEnabled && (shouldAutoStart || progress?.started_at));
      } catch (error) {
        console.error('Error checking release notes and tour status:', error);
      }
    };

    checkReleaseNotes();
  }, [user?.id, progress]);

  // Handle route changes during tour
  useEffect(() => {
    if (isActive && currentStep) {
      const currentRoute = location.pathname;
      
      // If we're on the wrong page for the current step, we might need to navigate
      if (currentStep.page_route !== currentRoute) {
        // For now, we'll just continue the tour on any page
        // In a more sophisticated implementation, we might pause or redirect
      }
    }
  }, [location.pathname, isActive, currentStep]);

  const loadTourData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      // Load tour steps and user progress in parallel
      const [tourSteps, userProgress] = await Promise.all([
        ProductTourService.getTourSteps(),
        ProductTourService.getUserProgress(user.id)
      ]);

      setSteps(tourSteps);
      setProgress(userProgress);

      // If user has started but not completed tour, resume from current step
      if (userProgress?.started_at && !userProgress.completed_at && !userProgress.skipped_at) {
        const currentStepKey = userProgress.current_step_key;
        if (currentStepKey) {
          const stepIndex = tourSteps.findIndex(step => step.step_key === currentStepKey);
          if (stepIndex !== -1) {
            setCurrentStepIndex(stepIndex);
            setCurrentStep(tourSteps[stepIndex]);
            // Don't auto-start the tour here, let it be controlled by the UI
          }
        }
      }
    } catch (error) {
      console.error('Error loading tour data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const startTour = useCallback(async () => {
    if (!user?.id || steps.length === 0) return;

    try {
      setIsLoading(true);

      // Start tour in database
      const newProgress = await ProductTourService.startTour(user.id, steps.length);
      setProgress(newProgress);

      // Set tour as active and start from first step
      setCurrentStepIndex(0);
      setCurrentStep(steps[0]);
      setIsActive(true);

      // Navigate to first step's page if needed
      if (steps[0].page_route !== location.pathname) {
        navigate(steps[0].page_route);
      }

      // Log tour start event
      await ProductTourService.logEvent('tour_started', {
        userId: user.id,
        pageRoute: location.pathname
      });

    } catch (error) {
      console.error('Error starting tour:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, steps, location.pathname, navigate]);

  const nextStep = useCallback(async () => {
    if (!user?.id || !currentStep) return;

    try {
      const nextIndex = currentStepIndex + 1;
      
      // Log current step completion
      await ProductTourService.logEvent('step_completed', {
        userId: user.id,
        stepKey: currentStep.step_key,
        pageRoute: location.pathname
      });

      if (nextIndex >= steps.length) {
        // Tour is complete
        await completeTour();
        return;
      }

      const nextTourStep = steps[nextIndex];
      
      // Update progress in database
      await ProductTourService.updateCurrentStep(
        user.id,
        nextTourStep.step_key,
        nextIndex
      );

      // Update local state
      setCurrentStepIndex(nextIndex);
      setCurrentStep(nextTourStep);

      // Navigate to next step's page if different
      if (nextTourStep.page_route !== location.pathname) {
        navigate(nextTourStep.page_route);
      }

      // Log step view event
      await ProductTourService.logEvent('step_viewed', {
        userId: user.id,
        stepKey: nextTourStep.step_key,
        pageRoute: nextTourStep.page_route
      });

    } catch (error) {
      console.error('Error proceeding to next step:', error);
    }
  }, [user?.id, currentStep, currentStepIndex, steps, location.pathname, navigate]);

  const previousStep = useCallback(async () => {
    if (!user?.id || !currentStep || currentStepIndex === 0) return;

    try {
      const prevIndex = currentStepIndex - 1;
      const prevTourStep = steps[prevIndex];

      // Update progress in database
      await ProductTourService.updateCurrentStep(
        user.id,
        prevTourStep.step_key,
        prevIndex
      );

      // Update local state
      setCurrentStepIndex(prevIndex);
      setCurrentStep(prevTourStep);

      // Navigate to previous step's page if different
      if (prevTourStep.page_route !== location.pathname) {
        navigate(prevTourStep.page_route);
      }

      // Log step view event
      await ProductTourService.logEvent('step_viewed', {
        userId: user.id,
        stepKey: prevTourStep.step_key,
        pageRoute: prevTourStep.page_route
      });

    } catch (error) {
      console.error('Error going to previous step:', error);
    }
  }, [user?.id, currentStep, currentStepIndex, steps, location.pathname, navigate]);

  const skipTour = useCallback(async () => {
    if (!user?.id) return;

    try {
      await ProductTourService.skipTour(user.id);
      
      // Log skip event
      await ProductTourService.logEvent('tour_skipped', {
        userId: user.id,
        stepKey: currentStep?.step_key,
        pageRoute: location.pathname
      });

      // Reset tour state
      setIsActive(false);
      setCurrentStep(null);
      setCurrentStepIndex(0);
      
      // Reload progress to reflect skip
      await loadTourData();

    } catch (error) {
      console.error('Error skipping tour:', error);
    }
  }, [user?.id, currentStep, location.pathname, loadTourData]);

  const completeTour = useCallback(async () => {
    if (!user?.id) return;

    try {
      await ProductTourService.completeTour(user.id);
      
      // Log completion event
      await ProductTourService.logEvent('tour_completed', {
        userId: user.id,
        stepKey: currentStep?.step_key,
        pageRoute: location.pathname
      });

      // Reset tour state
      setIsActive(false);
      setCurrentStep(null);
      setCurrentStepIndex(0);
      
      // Reload progress to reflect completion
      await loadTourData();

    } catch (error) {
      console.error('Error completing tour:', error);
    }
  }, [user?.id, currentStep, location.pathname, loadTourData]);

  const goToStep = useCallback(async (stepKey: string) => {
    if (!user?.id) return;

    try {
      const stepIndex = steps.findIndex(step => step.step_key === stepKey);
      if (stepIndex === -1) return;

      const targetStep = steps[stepIndex];

      // Update progress in database
      await ProductTourService.updateCurrentStep(
        user.id,
        stepKey,
        stepIndex
      );

      // Update local state
      setCurrentStepIndex(stepIndex);
      setCurrentStep(targetStep);

      // Navigate to step's page if different
      if (targetStep.page_route !== location.pathname) {
        navigate(targetStep.page_route);
      }

      // Log step view event
      await ProductTourService.logEvent('step_viewed', {
        userId: user.id,
        stepKey: stepKey,
        pageRoute: targetStep.page_route
      });

    } catch (error) {
      console.error('Error going to specific step:', error);
    }
  }, [user?.id, steps, location.pathname, navigate]);

  // Computed values
  const totalSteps = steps.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const canNavigate = !isLoading;

  const contextValue: TourContextType = {
    // State
    isActive: isActive && canShowTour,
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

export const useProductTour = () => {
  const context = useContext(ProductTourContext);
  if (!context) {
    throw new Error('useProductTour must be used within a ProductTourProvider');
  }
  return context;
};