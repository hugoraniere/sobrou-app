import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PersonalizationStep } from './PersonalizationStep';
import { QuickWinStep } from './QuickWinStep';
import { useOnboarding } from '@/contexts/OnboardingContext';

type OnboardingDialogStep = 'personalization' | 'quickwin' | 'completed';

export const OnboardingDialog: React.FC = () => {
  const { 
    isWelcomeModalOpen, 
    setWelcomeModalOpen, 
    setChecklistOpen 
  } = useOnboarding();
  
  const [currentDialogStep, setCurrentDialogStep] = useState<OnboardingDialogStep>('personalization');

  const handlePersonalizationComplete = () => {
    setCurrentDialogStep('quickwin');
  };

  const handleQuickWinComplete = () => {
    setCurrentDialogStep('completed');
    setWelcomeModalOpen(false);
    setChecklistOpen(true);
  };

  const renderCurrentStep = () => {
    switch (currentDialogStep) {
      case 'personalization':
        return <PersonalizationStep onComplete={handlePersonalizationComplete} />;
      case 'quickwin':
        return <QuickWinStep onComplete={handleQuickWinComplete} />;
      case 'completed':
        return null;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentDialogStep) {
      case 'personalization':
        return 'Personalização';
      case 'quickwin':
        return 'Primeira ação';
      default:
        return '';
    }
  };

  return (
    <Dialog 
      open={isWelcomeModalOpen && currentDialogStep !== 'completed'} 
      onOpenChange={setWelcomeModalOpen}
    >
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="onboarding-title"
      >
        <DialogHeader>
          <DialogTitle id="onboarding-title">
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription>
            Passo {currentDialogStep === 'personalization' ? '1' : '2'} de 2
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {renderCurrentStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};