import React from 'react';
import { useProductTour } from '@/contexts/ProductTourProvider';
import { TourSpotlight } from './TourSpotlight';

const TourManager: React.FC = () => {
  try {
    const { isActive, currentStep } = useProductTour();
    
    if (!isActive || !currentStep) {
      return null;
    }

    return <TourSpotlight 
      step={currentStep}
      onNext={() => {}}
      onPrevious={() => {}}
      onSkip={() => {}}
      onClose={() => {}}
      isFirstStep={false}
      isLastStep={false}
      currentStepIndex={0}
      totalSteps={1}
    />;
  } catch (error) {
    // Safely handle case where ProductTourProvider is not available
    console.warn('TourManager: ProductTourProvider not available');
    return null;
  }
};

export default TourManager;