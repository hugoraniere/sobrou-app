import React, { useMemo } from 'react';
import { useAuth } from './AuthContext';
import { OnboardingProvider } from './OnboardingContext';
import { ProductTourProvider } from './ProductTourProvider';
import { OnboardingVisibilityProvider } from './OnboardingVisibilityContext';

interface ConditionalOnboardingProviderProps {
  children: React.ReactNode;
  forceLoad?: boolean;
}

export const ConditionalOnboardingProvider: React.FC<ConditionalOnboardingProviderProps> = ({ 
  children, 
  forceLoad = false 
}) => {
  const { user } = useAuth();
  
  // Only load onboarding contexts when needed
  const shouldLoadOnboarding = useMemo(() => {
    if (forceLoad) return true;
    if (!user) return false;
    
    // Load when on admin/onboarding routes
    const isOnboardingRoute = window.location.pathname.includes('/admin') || 
                             window.location.pathname.includes('/onboarding');
    
    return isOnboardingRoute;
  }, [user, forceLoad]);

  if (!shouldLoadOnboarding) {
    return <>{children}</>;
  }

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