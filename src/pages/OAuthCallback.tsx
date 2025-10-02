import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('[OAuthCallback] Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[OAuthCallback] Session error:', error);
          throw error;
        }

        if (session) {
          console.log('[OAuthCallback] Session found, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        } else if (retryCount < 2) {
          // Retry once after a short delay
          console.log('[OAuthCallback] No session yet, retrying...');
          setTimeout(() => setRetryCount(prev => prev + 1), 500);
        } else {
          // Fallback to login after retries
          console.log('[OAuthCallback] No session after retries, redirecting to login');
          navigate('/?auth=1&tab=login', { replace: true });
        }
      } catch (error) {
        console.error('[OAuthCallback] Error:', error);
        navigate('/?auth=1&tab=login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, retryCount]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Finalizando login...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
