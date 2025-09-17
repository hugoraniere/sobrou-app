import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { OnboardingProgress, OnboardingStep, OnboardingContext as IOnboardingContext } from '@/types/onboarding';
import { OnboardingService } from '@/services/OnboardingService';
import { AnalyticsService } from '@/services/AnalyticsService';
import { useAuth } from './AuthContext';

const OnboardingContext = createContext<IOnboardingContext | null>(null);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(null);
  const [isWelcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [isChecklistOpen, setChecklistOpen] = useState(false);
  const [isTourActive, setTourActive] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load progress when user is authenticated
  useEffect(() => {
    const loadProgress = async () => {
      if (!user || isLoading || isInitialized) return;

      try {
        const userProgress = await OnboardingService.getProgress(user.id);
        setProgress(userProgress);

        // Check if this is first login (no progress exists)
        if (!userProgress) {
          setIsFirstLogin(true);
          setWelcomeModalOpen(true);
          AnalyticsService.trackEvent('user_first_login');
        } else {
          // Check if onboarding is completed
          if (OnboardingService.isOnboardingCompleted(userProgress)) {
            setCurrentStep('completed');
          } else {
            // Determine current step based on progress
            if (!userProgress.goal) {
              setCurrentStep('personalization');
            } else if (!userProgress.quickwin_done) {
              setCurrentStep('quickwin');
            } else {
              setCurrentStep('checklist');
            }
          }

          // Show checklist if onboarding is not completed
          const shouldShowChecklist = !OnboardingService.isOnboardingCompleted(userProgress);
          setChecklistOpen(shouldShowChecklist);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading onboarding progress:', error);
        setIsInitialized(true);
      }
    };

    if (isAuthenticated && user && !isLoading) {
      loadProgress();
    }
  }, [user, isAuthenticated, isLoading, isInitialized]);

  const updateProgress = async (updates: Partial<OnboardingProgress>): Promise<void> => {
    if (!user) return;

    try {
      let updatedProgress: OnboardingProgress | null = null;

      if (!progress) {
        // Create new progress
        updatedProgress = await OnboardingService.createProgress(
          user.id,
          updates.goal,
          updates.effort_minutes
        );
      } else {
        // Update existing progress
        updatedProgress = await OnboardingService.updateProgress(user.id, updates);
      }

      if (updatedProgress) {
        setProgress(updatedProgress);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const completeStep = async (step: string): Promise<void> => {
    if (!user) return;

    try {
      const updatedProgress = await OnboardingService.completeStep(user.id, step);
      if (updatedProgress) {
        setProgress(updatedProgress);
        AnalyticsService.trackChecklistStepDone(step);

        // Check if onboarding is now completed
        if (OnboardingService.isOnboardingCompleted(updatedProgress)) {
          setCurrentStep('completed');
          setChecklistOpen(false);
          AnalyticsService.trackOnboardingCompleted();
        }
      }
    } catch (error) {
      console.error('Error completing step:', error);
    }
  };

  const skipOnboarding = async (): Promise<void> => {
    if (!user) return;

    try {
      // Create progress with skipped flag
      const skippedProgress = await OnboardingService.createProgress(user.id);
      if (skippedProgress) {
        setProgress(skippedProgress);
        setCurrentStep('completed');
        setWelcomeModalOpen(false);
        setChecklistOpen(false);
        AnalyticsService.trackOnboardingSkipped();
      }
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  const restartOnboarding = async (): Promise<void> => {
    if (!user) return;

    try {
      // Reset progress
      const resetProgress = await OnboardingService.updateProgress(user.id, {
        goal: undefined,
        effort_minutes: undefined,
        steps_completed: [],
        quickwin_done: false
      });

      if (resetProgress) {
        setProgress(resetProgress);
        setCurrentStep('personalization');
        setWelcomeModalOpen(true);
        setChecklistOpen(true);
        AnalyticsService.trackEvent('onboarding_restarted');
      }
    } catch (error) {
      console.error('Error restarting onboarding:', error);
    }
  };

  const contextValue: IOnboardingContext = {
    progress,
    currentStep,
    isWelcomeModalOpen,
    isChecklistOpen,
    isTourActive,
    isFirstLogin,
    setWelcomeModalOpen: setWelcomeModalOpen,
    setChecklistOpen: setChecklistOpen,
    setTourActive: setTourActive,
    updateProgress,
    completeStep,
    skipOnboarding,
    restartOnboarding
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): IOnboardingContext => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};