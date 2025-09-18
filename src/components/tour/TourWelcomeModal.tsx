import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, Zap, Target } from 'lucide-react';
import { ProductTourService } from '@/services/productTourService';

interface TourWelcomeModalProps {
  isOpen: boolean;
  onStart: () => void;
  onSkip: () => void;
  totalSteps: number;
}

export const TourWelcomeModal: React.FC<TourWelcomeModalProps> = ({
  isOpen,
  onStart,
  onSkip,
  totalSteps
}) => {
  const [messages, setMessages] = useState({
    welcome_title: "Bem-vindo ao Sobrou! 👋",
    welcome_description: "Vamos fazer um tour rápido para você conhecer as principais funcionalidades"
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const settings = await ProductTourService.getTourSettings();
        const tourMessages = settings.tour_messages || {};
        
        if (tourMessages.welcome_title || tourMessages.welcome_description) {
          setMessages({
            welcome_title: tourMessages.welcome_title || messages.welcome_title,
            welcome_description: tourMessages.welcome_description || messages.welcome_description
          });
        }
      } catch (error) {
        console.error('Error loading tour messages:', error);
      }
    };

    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  const handleStart = () => {
    setIsLoading(true);
    onStart();
  };

  const features = [
    {
      icon: MapPin,
      title: 'Navegação Guiada',
      description: 'Vamos percorrer todas as páginas principais'
    },
    {
      icon: Zap,
      title: 'Funcionalidades Principais',
      description: 'Conheça as ferramentas mais importantes'
    },
    {
      icon: Target,
      title: 'Dicas Práticas',
      description: 'Aprenda como usar cada recurso na prática'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onSkip()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">
            {messages.welcome_title}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {messages.welcome_description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-6">
          {/* Tour info */}
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {totalSteps}
            </div>
            <div className="text-sm text-text-secondary">
              passos no tour
            </div>
            <div className="mt-2">
              <Progress value={0} className="h-2" />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-text-primary">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onSkip}
            disabled={isLoading}
            className="flex-1"
          >
            Pular Tour
          </Button>
          <Button
            onClick={handleStart}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Iniciando...' : 'Começar Tour'}
          </Button>
        </div>

        {/* Keyboard hint */}
        <div className="text-center text-xs text-text-secondary/80 mt-2">
          Você pode usar as setas ← → para navegar durante o tour
        </div>
      </DialogContent>
    </Dialog>
  );
};