import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { BookOpen, X } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { AnalyticsService } from '@/services/AnalyticsService';

export const OnboardingBanner: React.FC = () => {
  const { progress, setWelcomeModalOpen, skipOnboarding } = useOnboarding();

  // Só mostra se o usuário pulou o onboarding inicial
  const shouldShow = progress && !progress.goal && !progress.quickwin_done;
  
  if (!shouldShow) return null;

  const handleStartOnboarding = () => {
    setWelcomeModalOpen(true);
    AnalyticsService.trackEvent('onboarding_banner_clicked');
  };

  const handleDismiss = () => {
    skipOnboarding();
    AnalyticsService.trackEvent('onboarding_banner_dismissed');
  };

  return (
    <Alert className="mb-6 border-primary/20 bg-primary/5">
      <BookOpen className="h-4 w-4 text-primary" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <span className="font-medium">Novo aqui?</span>
          {' '}
          <span className="text-muted-foreground">
            Em 1 minuto você aprende a usar o Sobrou e já vê resultado.
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            onClick={handleStartOnboarding}
            size="sm"
            className="text-xs"
          >
            Começar onboarding
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            aria-label="Dispensar banner"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};