import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AnalyticsEvent {
  user_id: string;
  event_name: string;
  event_params?: Record<string, any>;
  page?: string;
}

const BATCH_SIZE = 10;
const BATCH_TIMEOUT = 2000; // 2 seconds

export function useAnalyticsBatch() {
  const batchRef = useRef<AnalyticsEvent[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  const flushBatch = useCallback(async () => {
    if (batchRef.current.length === 0) return;

    const eventsToSend = [...batchRef.current];
    batchRef.current = [];

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert(eventsToSend);

      if (error) {
        console.error('Error sending analytics batch:', error);
        // Re-add failed events to batch for retry
        batchRef.current = [...eventsToSend, ...batchRef.current];
      }
    } catch (err) {
      console.error('Failed to send analytics batch:', err);
      // Re-add failed events to batch for retry
      batchRef.current = [...eventsToSend, ...batchRef.current];
    }
  }, []);

  const trackEvent = useCallback((
    eventName: string,
    eventParams?: Record<string, any>,
    page?: string
  ) => {
    if (!user?.id) return; // Don't track if no user
    
    const event: AnalyticsEvent = {
      user_id: user.id,
      event_name: eventName,
      event_params: eventParams,
      page: page || window.location.pathname
    };

    batchRef.current.push(event);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If batch is full, flush immediately
    if (batchRef.current.length >= BATCH_SIZE) {
      flushBatch();
    } else {
      // Otherwise, set timeout to flush
      timeoutRef.current = setTimeout(flushBatch, BATCH_TIMEOUT);
    }
  }, [flushBatch, user?.id]);

  const flushNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    flushBatch();
  }, [flushBatch]);

  return { trackEvent, flushNow };
}
