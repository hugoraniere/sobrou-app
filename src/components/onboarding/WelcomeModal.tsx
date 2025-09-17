import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { AnalyticsService } from '@/services/AnalyticsService';

export const WelcomeModal: React.FC = () => {
  const { 
    isWelcomeModalOpen, 
    setWelcomeModalOpen, 
    skipOnboarding,
    setChecklistOpen 
  } = useOnboarding();

  const handleStart = () => {
    setWelcomeModalOpen(false);
    setChecklistOpen(true);
    AnalyticsService.trackOnboardingStarted();
  };

  const handleSkip = () => {
    skipOnboarding();
    AnalyticsService.trackOnboardingSkipped();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleStart();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleSkip();
    }
  };

  return (
    <Dialog open={isWelcomeModalOpen} onOpenChange={setWelcomeModalOpen}>
      <DialogContent 
        className="max-w-md"
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-labelledby="welcome-title"
        aria-describedby="welcome-description"
      >
        <DialogHeader>
          <DialogTitle id="welcome-title" className="text-xl font-semibold">
            Bem-vindo ao Sobrou 👋
          </DialogTitle>
          <DialogDescription id="welcome-description" className="text-muted-foreground">
            Em 1 minuto você dá o primeiro passo e já vê resultado.
            <br />
            Pode pular quando quiser.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button 
            onClick={handleStart}
            className="w-full"
            aria-label="Começar onboarding de 1 minuto"
          >
            Começar (1 min)
          </Button>
          
          <Button 
            onClick={handleSkip}
            variant="ghost"
            className="w-full"
            aria-label="Pular onboarding"
          >
            Pular
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center mt-2">
          Use Enter para começar ou ESC para pular
        </div>
      </DialogContent>
    </Dialog>
  );
};