
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSafeAuth } from '@/hooks/useSafeAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserPreferences {
  restaurant_calculator: boolean;
}

interface NavigationContextValue {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  isLoading: boolean;
}

export const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const { user } = useSafeAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    restaurant_calculator: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_preferences')
        .select('optional_pages')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
        return;
      }

      if (data?.optional_pages) {
        // Safely convert the data with proper type checking
        const optionalPages = data.optional_pages as unknown;
        if (optionalPages && typeof optionalPages === 'object' && 'restaurant_calculator' in optionalPages) {
          setPreferences(optionalPages as UserPreferences);
        } else {
          // Create default preferences if data structure is invalid
          await createDefaultPreferences();
        }
      } else {
        // Criar preferências padrão se não existirem
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultPreferences = async () => {
    try {
      const defaultPrefs = { restaurant_calculator: false };
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user?.id,
          optional_pages: defaultPrefs,
        });

      if (error) {
        console.error('Error creating default preferences:', error);
      } else {
        setPreferences(defaultPrefs);
      }
    } catch (error) {
      console.error('Error creating default preferences:', error);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          optional_pages: updatedPreferences,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error updating preferences:', error);
        throw error;
      }

      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        preferences,
        updatePreferences,
        isLoading,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
