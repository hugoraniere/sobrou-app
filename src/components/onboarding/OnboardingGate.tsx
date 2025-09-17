import React, { useEffect } from 'react';
import { useOnboardingVisibility } from '@/hooks/useOnboardingVisibility';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface OnboardingGateProps {
  children: React.ReactNode;
  type: 'tour' | 'stepper';
  /** Force preview mode (admin only) */
  preview?: boolean;
}

export function OnboardingGate({ children, type, preview = false }: OnboardingGateProps) {
  const visibility = useOnboardingVisibility({ preview });

  // Loading skeleton while checking visibility
  if (visibility.loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <Skeleton className="w-48 h-4 mb-4" />
          <Skeleton className="w-32 h-4" />
        </div>
      </div>
    );
  }

  // Error state
  if (visibility.error) {
    return (
      <Alert className="fixed top-4 right-4 w-80 z-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar configurações de onboarding: {visibility.error}
        </AlertDescription>
      </Alert>
    );
  }

  // Check visibility based on type
  const shouldShow = type === 'tour' ? visibility.showProductTour : visibility.showStepper;
  
  if (!shouldShow && !preview) {
    return null;
  }

  // Preview banner for admins
  const PreviewBanner = preview && (
    <div className="fixed top-0 left-0 right-0 bg-warning text-warning-foreground text-center py-2 z-50 text-sm font-medium">
      🔍 Modo Preview (Admin) - Este {type === 'tour' ? 'tour' : 'stepper'} está sendo exibido apenas para teste
    </div>
  );

  return (
    <>
      {PreviewBanner}
      <div style={{ paddingTop: preview ? '40px' : '0' }}>
        {children}
      </div>
    </>
  );
}