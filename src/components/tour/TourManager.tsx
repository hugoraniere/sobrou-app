import React from 'react';
import { useProductTour } from '@/contexts/ProductTourProvider';
import { TourSpotlight } from './TourSpotlight';

export const TourManager: React.FC = () => {
  console.log('TourManager: Component rendering...');
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
  
  console.log('TourManager: Tour state - isActive:', isActive, 'currentStep:', currentStep?.title);

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
  );
};