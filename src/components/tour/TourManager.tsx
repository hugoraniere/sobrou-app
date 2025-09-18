import React from 'react';
import { useProductTour } from '@/contexts/ProductTourProvider';
import { TourSpotlight } from './TourSpotlight';
import { TourPreviewMode } from './TourPreviewMode';
import { OnboardingGate } from '@/components/onboarding/OnboardingGate';
import { useOnboardingVisibility } from '@/hooks/useOnboardingVisibility';

export const TourManager: React.FC = () => {
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    isFirstStep,
    isLastStep,
  } = useProductTour();

  const visibility = useOnboardingVisibility();

  // Don't render if tour is not active or no current step
  if (!isActive || !currentStep) {
    return null;
  }

  const handleNext = () => {
    if (isLastStep) {
      completeTour();
    } else {
      nextStep();
    }
  };

  const handleClose = () => {
    if (isLastStep) {
      completeTour();
    } else {
      skipTour();
    }
  };

  return (
    <>
      <OnboardingGate type="tour" preview={visibility.preview}>
        <TourSpotlight
          step={currentStep}
          onNext={handleNext}
          onPrevious={previousStep}
          onSkip={skipTour}
          onClose={handleClose}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
        />
      </OnboardingGate>
      
      {/* Preview mode sempre ativo para capturar mensagens */}
      <TourPreviewMode />
    </>
  );
};