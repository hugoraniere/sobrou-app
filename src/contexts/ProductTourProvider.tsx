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

  // Enhanced tour step loading
  const loadTourSteps = useCallback(async () => {
    try {
      console.log('🔄 Loading tour steps...');
      const tourSteps = await ProductTourService.getTourSteps();
      console.log(`✅ Loaded ${tourSteps.length} tour steps:`, tourSteps.map(s => s.step_key));
      
      setSteps(tourSteps);
      setTotalSteps(tourSteps.length);
      return tourSteps;
    } catch (error) {
      console.error('❌ Error loading tour steps:', error);
      return [];
    }
  }, []);

  // Enhanced user progress loading
  const loadUserProgress = useCallback(async () => {
    if (!user?.id) return null;
    
    try {
      console.log(`🔄 Loading progress for user: ${user.id}`);
      const userProgress = await ProductTourService.getUserProgress(user.id);
      console.log('✅ User progress loaded:', userProgress);
      
      setProgress(userProgress);
      return userProgress;
    } catch (error) {
      console.error('❌ Error loading user progress:', error);
      return null;
    }
  }, [user?.id]);

  // Find step by key
  const findStepByKey = useCallback((stepKey: string) => {
    const step = steps.find(step => step.step_key === stepKey);
    console.log(`🔍 Finding step "${stepKey}":`, step ? '✅ Found' : '❌ Not found');
    return step;
  }, [steps]);

  // Find step index
  const findStepIndex = useCallback((stepKey: string) => {
    const index = steps.findIndex(step => step.step_key === stepKey);
    console.log(`🔢 Step "${stepKey}" index:`, index);
    return index;
  }, [steps]);

  // Enhanced page navigation with proper waiting
  const navigateToStepPage = useCallback(async (step: ProductTourStep): Promise<void> => {
    const currentPath = location.pathname;
    const targetPath = step.page_route;
    
    console.log(`🧭 Navigation check: ${currentPath} → ${targetPath}`);
    
    if (currentPath !== targetPath) {
      console.log(`🚀 Navigating to: ${targetPath}`);
      
      await ProductTourService.logEvent('navigation_required', {
        userId: user?.id,
        sessionId,
        stepKey: step.step_key,
        pageRoute: targetPath,
        eventData: { from: currentPath, to: targetPath }
      });
      
      navigate(targetPath);
      
      // Enhanced wait logic - wait for route change AND DOM stabilization
      return new Promise<void>((resolve) => {
        console.log('⏳ Waiting for page navigation and DOM stabilization...');
        
        // First, wait for route to actually change
        const checkRouteChange = () => {
          if (window.location.pathname === targetPath) {
            console.log('✅ Route changed, waiting for DOM to stabilize...');
            
            // Then wait for DOM to be ready and elements to load
            setTimeout(() => {
              console.log('✅ DOM stabilization complete');
              resolve();
            }, 800); // Increased stabilization time
          } else {
            setTimeout(checkRouteChange, 100);
          }
        };
        
        checkRouteChange();
      });
    } else {
      console.log('✅ Already on correct page');
    }
  }, [location.pathname, navigate, user?.id, sessionId]);

  // Enhanced element waiting with better retry logic
  const waitForElement = useCallback((anchorId: string, maxAttempts = 20): Promise<Element | null> => {
    console.log(`⏳ Waiting for element: ${anchorId} (max ${maxAttempts} attempts)`);
    
    return new Promise((resolve) => {
      let attempts = 0;
      
      const checkElement = () => {
        const element = document.querySelector(`[data-tour-id="${anchorId}"]`);
        attempts++;
        
        if (element) {
          // Enhanced visibility check
          const rect = element.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0;
          const isInDOM = document.contains(element);
          
          console.log(`🎯 Element check ${attempts}/${maxAttempts}:`, {
            found: true,
            visible: isVisible,
            inDOM: isInDOM,
            dimensions: { width: rect.width, height: rect.height }
          });
          
          if (isVisible && isInDOM) {
            console.log(`✅ Element ready: ${anchorId}`);
            resolve(element);
            return;
          }
        } else {
          console.log(`🔍 Element check ${attempts}/${maxAttempts}: not found`);
        }
        
        if (attempts >= maxAttempts) {
          console.warn(`❌ Element "${anchorId}" not found after ${maxAttempts} attempts`);
          resolve(null);
          return;
        }
        
        // Progressive delay strategy: quick first attempts, then slower
        const delay = attempts <= 5 ? 200 : attempts <= 10 ? 500 : 1000;
        console.log(`⏳ Retrying in ${delay}ms...`);
        setTimeout(checkElement, delay);
      };
      
      checkElement();
    });
  }, []);

  // Enhanced tour start
  const startTour = useCallback(async () => {
    if (!user?.id) {
      console.warn('❌ Cannot start tour: no user');
      return;
    }
    
    console.log('🚀 Starting product tour...');
    setIsLoading(true);
    
    try {
      const tourSteps = steps.length > 0 ? steps : await loadTourSteps();
      
      if (tourSteps.length === 0) {
        console.warn('❌ No tour steps available');
        return;
      }

      console.log(`📋 Tour initialized with ${tourSteps.length} steps`);

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
      console.log(`🎯 Starting with first step: ${firstStep.step_key}`);
      
      setCurrentStep(firstStep);
      setCurrentStepIndex(0);
      setIsActive(true);

      // Navigate to first step page and wait for readiness
      await navigateToStepPage(firstStep);
      
    } catch (error) {
      console.error('❌ Error starting tour:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, steps, loadTourSteps, sessionId, navigateToStepPage]);

  // Enhanced step navigation
  const goToStep = useCallback(async (stepKey: string) => {
    if (!user?.id || !canNavigate) {
      console.warn('❌ Cannot navigate to step: no user or currently loading');
      return;
    }
    
    const step = findStepByKey(stepKey);
    const stepIndex = findStepIndex(stepKey);
    
    if (!step || stepIndex === -1) {
      console.warn(`❌ Step "${stepKey}" not found`);
      return;
    }

    console.log(`🎯 Navigating to step: ${stepKey} (${stepIndex + 1}/${totalSteps})`);
    setIsLoading(true);

    try {
      // Navigate to step page first
      await navigateToStepPage(step);
      
      // Wait for element to be ready
      const element = await waitForElement(step.anchor_id);
      
      if (!element) {
        console.warn(`❌ Element for step "${stepKey}" not found, attempting auto-skip`);
        
        // Auto-skip to next available step
        if (stepIndex < steps.length - 1) {
          console.log('🦘 Auto-skipping to next step...');
          const nextStep = steps[stepIndex + 1];
          setTimeout(() => goToStep(nextStep.step_key), 1000);
        } else {
          console.log('🏁 No more steps, completing tour');
          await completeTour();
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
      console.log(`✅ Successfully navigated to step: ${stepKey}`);
      setCurrentStep(step);
      setCurrentStepIndex(stepIndex);

    } catch (error) {
      console.error(`❌ Error going to step "${stepKey}":`, error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, canNavigate, findStepByKey, findStepIndex, navigateToStepPage, waitForElement, steps, sessionId, totalSteps]);

  // Enhanced next step
  const nextStep = useCallback(async () => {
    if (!currentStep || isLastStep || !canNavigate) {
      console.warn('❌ Cannot go to next step:', { currentStep: !!currentStep, isLastStep, canNavigate });
      return;
    }
    
    console.log(`➡️  Moving to next step from: ${currentStep.step_key}`);
    
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
    } else {
      console.log('🏁 No next step, completing tour');
      await completeTour();
    }
  }, [currentStep, isLastStep, canNavigate, user?.id, sessionId, currentStepIndex, steps, goToStep]);

  // Enhanced previous step
  const previousStep = useCallback(async () => {
    if (!currentStep || isFirstStep || !canNavigate) {
      console.warn('❌ Cannot go to previous step:', { currentStep: !!currentStep, isFirstStep, canNavigate });
      return;
    }
    
    console.log(`⬅️  Moving to previous step from: ${currentStep.step_key}`);
    
    const prevStepIndex = currentStepIndex - 1;
    const prevStepObj = steps[prevStepIndex];
    
    if (prevStepObj) {
      await goToStep(prevStepObj.step_key);
    }
  }, [currentStep, isFirstStep, canNavigate, currentStepIndex, steps, goToStep]);

  // Enhanced tour completion
  const completeTour = useCallback(async () => {
    if (!user?.id) return;
    
    console.log('🏁 Completing product tour...');
    
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

      console.log('✅ Tour completed successfully');

      // Reset state
      setIsActive(false);
      setCurrentStep(null);
      setCurrentStepIndex(0);
      
      // Reload progress
      await loadUserProgress();
      
    } catch (error) {
      console.error('❌ Error completing tour:', error);
    }
  }, [user?.id, currentStep, sessionId, currentStepIndex, totalSteps, loadUserProgress]);

  // Enhanced tour skip
  const skipTour = useCallback(async () => {
    if (!user?.id) return;
    
    console.log('🦘 Skipping product tour...');
    
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

      console.log('✅ Tour skipped successfully');

      // Reset state
      setIsActive(false);
      setCurrentStep(null);
      setCurrentStepIndex(0);
      
      // Reload progress
      await loadUserProgress();
      
    } catch (error) {
      console.error('❌ Error skipping tour:', error);
    }
  }, [user?.id, sessionId, currentStep, currentStepIndex, totalSteps, loadUserProgress]);

  // Enhanced initialization
  useEffect(() => {
    const initializeTour = async () => {
      if (!user?.id) return;
      
      console.log('🔧 Initializing product tour system...');
      setIsLoading(true);
      
      try {
        // Check if tour is enabled globally
        const tourEnabled = await ProductTourService.isTourEnabled();
        console.log(`🎛️  Tour enabled: ${tourEnabled}`);
        
        if (!tourEnabled) {
          console.log('❌ Tour disabled, skipping initialization');
          setIsLoading(false);
          return;
        }

        // Load all tour steps
        const allSteps = await ProductTourService.getTourSteps();
        setSteps(allSteps);
        setTotalSteps(allSteps.length);
        console.log(`📋 Loaded ${allSteps.length} tour steps`);

        // Load user progress
        const userProgress = await ProductTourService.getUserProgress(user.id);
        setProgress(userProgress);

        // Check if should auto-start tour with enhanced delay
        setTimeout(async () => {
          const shouldAutoStart = await ProductTourService.shouldAutoStartTour(user.id);
          console.log(`🚀 Should auto-start: ${shouldAutoStart}`);
          
          if (shouldAutoStart && allSteps.length > 0) {
            console.log('⏰ Auto-starting tour in 2 seconds...');
            setTimeout(() => {
              startTour();
            }, 2000); // Give more time for page to fully load
          }
        }, 1000);
        
      } catch (error) {
        console.error('❌ Error initializing tour:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTour();
  }, [user?.id, startTour]);

  // Enhanced route change handling
  useEffect(() => {
    if (!isActive || !currentStep || !user?.id) return;

    console.log(`🛤️  Route changed to: ${location.pathname} (tour active)`);

    const handleRouteChange = async () => {
      const currentPath = location.pathname;
      
      // If current step is for this page, just reposition
      if (currentStep.page_route === currentPath) {
        console.log('✅ Current step matches page, repositioning...');
        
        // Small delay to ensure DOM is ready, then update step to trigger reposition
        setTimeout(() => {
          const stepIndex = steps.findIndex(s => s.id === currentStep.id);
          if (stepIndex !== -1) {
            setCurrentStepIndex(stepIndex);
            console.log('🎯 Step repositioned');
          }
        }, 500);
      } else {
        // Find next appropriate step for current page
        console.log('🔍 Looking for next step on current page...');
        
        const nextStepForPage = steps.find(step => 
          step.page_route === currentPath && 
          step.step_order > (currentStep?.step_order || 0)
        );
        
        if (nextStepForPage) {
          console.log(`🎯 Found next step for page: ${nextStepForPage.step_key}`);
          await goToStep(nextStepForPage.step_key);
        } else {
          console.log('❌ No relevant step for current page');
        }
      }
    };

    handleRouteChange();
  }, [location.pathname, isActive, currentStep, steps, user?.id, goToStep]);

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