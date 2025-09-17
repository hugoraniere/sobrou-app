import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingConfigService } from '@/services/OnboardingConfigService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const WelcomeModal: React.FC = () => {
  const { isWelcomeModalOpen, setWelcomeModalOpen, showStepper } = useOnboarding();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = React.useState({
    title: "Bem-vindo ao Sobrou 👋",
    subtitle: "Este onboarding pode ser configurado no Admin. Em 1 minuto você deixa tudo pronto.",
    image: "",
    cta_start: "Começar",
    cta_close: "Fechar",
    show_admin_button: true
  });
  
  // Check if user is admin
  const isAdmin = false; // TODO: Implement admin check when roles are ready

  React.useEffect(() => {
    const loadConfig = async () => {
      try {
        const welcomeConfig = await OnboardingConfigService.getWelcomeModalConfig();
        setConfig(welcomeConfig);
      } catch (error) {
        console.error('Error loading welcome modal config:', error);
      }
    };
    
    if (isWelcomeModalOpen) {
      loadConfig();
    }
  }, [isWelcomeModalOpen]);

  const handleStart = async () => {
    await showStepper();
    setWelcomeModalOpen(false);
  };

  const handleClose = () => {
    setWelcomeModalOpen(false);
  };

  const handleAdminConfig = () => {
    navigate('/admin/onboarding');
    setWelcomeModalOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleStart();
    } else if (event.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    if (isWelcomeModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isWelcomeModalOpen]);

  return (
    <Dialog open={isWelcomeModalOpen} onOpenChange={setWelcomeModalOpen}>
      <DialogContent 
        className="max-w-md"
        role="dialog"
        aria-labelledby="welcome-title"
      >
        <DialogHeader className="text-center">
          <DialogTitle id="welcome-title" className="text-2xl">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {config.subtitle}
          </DialogDescription>
        </DialogHeader>

        {config.image && (
          <div className="flex justify-center my-4">
            <img 
              src={config.image} 
              alt="Onboarding" 
              className="max-w-full h-auto max-h-48 rounded-lg"
            />
          </div>
        )}

        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={handleStart}
            size="lg"
            className="w-full"
          >
            {config.cta_start}
          </Button>
          
          <Button
            onClick={handleClose}
            variant="outline"
            size="lg"
            className="w-full"
          >
            {config.cta_close}
          </Button>

          {isAdmin && config.show_admin_button && (
            <Button
              onClick={handleAdminConfig}
              variant="ghost"
              size="sm"
              className="mt-2 text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurar no Admin
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center mt-4">
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> para iniciar • <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd> para fechar
        </div>
      </DialogContent>
    </Dialog>
  );
};