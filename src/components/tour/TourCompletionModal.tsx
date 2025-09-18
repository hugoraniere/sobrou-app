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
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { ProductTourService } from '@/services/productTourService';

interface TourCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSteps: number;
}

export const TourCompletionModal: React.FC<TourCompletionModalProps> = ({
  isOpen,
  onClose,
  totalSteps
}) => {
  const [messages, setMessages] = useState({
    completion_title: "Parabéns! 🎉",
    completion_description: "Você completou o tour. Agora você já sabe usar o Sobrou!"
  });

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const settings = await ProductTourService.getTourSettings();
        const tourMessages = settings.tour_messages || {};
        
        if (tourMessages.completion_title || tourMessages.completion_description) {
          setMessages({
            completion_title: tourMessages.completion_title || messages.completion_title,
            completion_description: tourMessages.completion_description || messages.completion_description
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

  const achievements = [
    'Conheceu o Dashboard principal',
    'Aprendeu a adicionar transações',
    'Explorou relatórios financeiros',
    'Descobriu as metas de economia',
    'Viu como organizar contas a pagar'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            {messages.completion_title}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {messages.completion_description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-6">
          {/* Completion status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {totalSteps}/{totalSteps}
            </div>
            <div className="text-sm text-green-700 mb-2">
              passos completados
            </div>
            <Progress value={100} className="h-2" />
          </div>

          {/* Achievement list */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-text-primary flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              O que você aprendeu:
            </h4>
            <div className="space-y-2">
              {achievements.slice(0, Math.min(5, totalSteps)).map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span className="text-text-secondary">{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-sm text-text-primary flex items-center gap-2 mb-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              Próximos passos:
            </h4>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Comece adicionando suas primeiras transações</li>
              <li>• Configure suas metas financeiras</li>
              <li>• Explore os relatórios e gráficos</li>
              <li>• Use o suporte se tiver dúvidas</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1"
          >
            Começar a usar!
          </Button>
        </div>

        {/* Footer note */}
        <div className="text-center text-xs text-text-secondary/80 mt-2">
          Você pode reiniciar o tour a qualquer momento no menu de Ajuda
        </div>
      </DialogContent>
    </Dialog>
  );
};