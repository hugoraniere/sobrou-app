import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { OnboardingContext as IOnboardingContext, OnboardingStep, OnboardingProgress } from '@/types/onboarding';
import { OnboardingService } from '@/services/OnboardingService';

const OnboardingContext = createContext<IOnboardingContext | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isStepperMinimized, setIsStepperMinimized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadOnboardingData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Auto-complete steps based on event counts
  useEffect(() => {
    if (user && steps.length > 0 && Object.keys(eventCounts).length > 0) {
      autoCompleteSteps();
    }
  }, [steps, eventCounts, user]);

  const loadOnboardingData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [stepsData, progressData, eventCountsData] = await Promise.all([
        OnboardingService.getSteps(),
        OnboardingService.getProgress(user.id),
        OnboardingService.getEventCounts(user.id)
      ]);

      setSteps(stepsData);
      setProgress(progressData);
      setEventCounts(eventCountsData);
      setIsStepperMinimized(progressData?.minimized || false);

      // Show welcome modal for first-time users
      if (OnboardingService.isFirstLogin(progressData)) {
        setIsWelcomeModalOpen(true);
        // Track first visit
        await OnboardingService.trackEvent('onboarding_first_visit', user.id);
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const autoCompleteSteps = async () => {
    if (!user || !progress) return;

    const stepsToComplete = steps.filter(step => 
      !progress.completed[step.key] && 
      OnboardingService.shouldCompleteStep(step, eventCounts)
    );

    for (const step of stepsToComplete) {
      await completeStep(step.key);
    }
  };

  const completeStep = async (stepKey: string) => {
    if (!user) return;

    try {
      const updatedProgress = await OnboardingService.completeStep(user.id, stepKey);
      if (updatedProgress) {
        setProgress(updatedProgress);
        await OnboardingService.trackEvent(`step_completed_${stepKey}`, user.id);
      }
    } catch (error) {
      console.error('Error completing step:', error);
    }
  };

  const minimizeStepper = async () => {
    if (!user) return;

    try {
      const updatedProgress = await OnboardingService.updateProgress(user.id, { minimized: true });
      if (updatedProgress) {
        setProgress(updatedProgress);
        setIsStepperMinimized(true);
        await OnboardingService.trackEvent('onboarding_hidden', user.id);
      }
    } catch (error) {
      console.error('Error minimizing stepper:', error);
    }
  };

  const showStepper = async () => {
    if (!user) return;

    try {
      const updatedProgress = await OnboardingService.updateProgress(user.id, { minimized: false });
      if (updatedProgress) {
        setProgress(updatedProgress);
        setIsStepperMinimized(false);
        await OnboardingService.trackEvent('onboarding_shown', user.id);
      }
    } catch (error) {
      console.error('Error showing stepper:', error);
    }
  };

  const trackEvent = async (eventName: string, params?: Record<string, any>) => {
    if (!user) return;

    try {
      await OnboardingService.trackEvent(eventName, user.id, params, window.location.pathname);
      // Refresh event counts
      const newEventCounts = await OnboardingService.getEventCounts(user.id);
      setEventCounts(newEventCounts);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const refreshData = async () => {
    await loadOnboardingData();
  };

  const setWelcomeModalOpen = (open: boolean) => {
    setIsWelcomeModalOpen(open);
    if (open) {
      OnboardingService.trackEvent('onboarding_started', user?.id);
    } else {
      OnboardingService.trackEvent('onboarding_closed', user?.id);
    }
  };

  const value: IOnboardingContext = {
    steps,
    progress,
    eventCounts,
    isWelcomeModalOpen,
    isStepperMinimized,
    setWelcomeModalOpen,
    completeStep,
    minimizeStepper,
    showStepper,
    trackEvent,
    refreshData
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): IOnboardingContext => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};