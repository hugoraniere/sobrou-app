import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

type TelemetryEventName = 
  | 'tour_started'
  | 'tour_step_viewed' 
  | 'tour_step_completed'
  | 'tour_step_skipped_missing_anchor'
  | 'tour_finished'
  | 'tour_skipped'
  | 'tour_visibility_error'
  | 'stepper_started'
  | 'stepper_step_completed'
  | 'stepper_hidden'
  | 'stepper_finished';

interface TelemetryEvent {
  eventName: TelemetryEventName;
  params?: Record<string, any>;
  stepKey?: string;
  route?: string;
}

export function useTelemetry() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const trackEvent = async ({ eventName, params = {}, stepKey, route }: TelemetryEvent) => {
    if (!user) return;

    const eventData = {
      user_id: user.id,
      event_name: eventName,
      event_params: {
        ...params,
        step_key: stepKey,
        route: route || window.location.pathname,
        version: params.version || '1.0',
        timestamp: Date.now()
      },
      page: window.location.pathname
    };

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert(eventData);

      if (error) {
        console.error('Error tracking telemetry event:', error);
      }
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  };

  // Convenient methods for common events
  const trackTourEvent = (eventName: Extract<TelemetryEventName, `tour_${string}`>, stepKey?: string, params?: Record<string, any>) => {
    trackEvent({ eventName, stepKey, params });
  };

  const trackStepperEvent = (eventName: Extract<TelemetryEventName, `stepper_${string}`>, stepKey?: string, params?: Record<string, any>) => {
    trackEvent({ eventName, stepKey, params });
  };

  return {
    trackEvent,
    trackTourEvent,
    trackStepperEvent
  };
}

// Hook for automatic event tracking in components
export function useAutoTelemetry(componentName: string) {
  const { trackEvent } = useTelemetry();
  
  useEffect(() => {
    trackEvent({
      eventName: 'tour_step_viewed' as TelemetryEventName,
      params: { component: componentName }
    });
  }, [componentName, trackEvent]);

  return { trackEvent };
}