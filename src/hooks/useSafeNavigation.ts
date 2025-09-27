import { useContext } from 'react';
import { NavigationContext } from '@/contexts/NavigationContext';

interface UserPreferences {
  restaurant_calculator: boolean;
}

interface NavigationContextValue {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
}

export const useSafeNavigation = (): NavigationContextValue => {
  const context = useContext(NavigationContext);
  
  // Return default values if context is not available
  if (!context) {
    return {
      preferences: {
        restaurant_calculator: false,
      },
      updatePreferences: async () => {},
      isLoading: false,
    };
  }
  
  return context;
};