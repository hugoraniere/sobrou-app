import React, { useMemo } from 'react';
import { useAuth } from './AuthContext';
import { OnboardingProvider } from './OnboardingContext';
import { ProductTourProvider } from './ProductTourProvider';
import { OnboardingVisibilityProvider } from './OnboardingVisibilityContext';

interface ConditionalOnboardingProviderProps {
  children: React.ReactNode;
}

export const ConditionalOnboardingProvider: React.FC<ConditionalOnboardingProviderProps> = ({ 
  children 
}) => {
  // Always provide all contexts to prevent hook errors
  // The components inside can handle their own conditional logic
  return (
    <OnboardingVisibilityProvider>
      <OnboardingProvider>
        <ProductTourProvider>
          {children}
        </ProductTourProvider>
      </OnboardingProvider>
    </OnboardingVisibilityProvider>
  );
};