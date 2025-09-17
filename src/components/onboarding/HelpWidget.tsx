import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, MessageCircle, BookOpen, X } from 'lucide-react';
import { AnalyticsService } from '@/services/AnalyticsService';

export const HelpWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (newState) {
      AnalyticsService.trackHelpOpened();
    }
  };

  const handleCentralHelp = () => {
    // Navegar para central de ajuda ou abrir modal de FAQ
    AnalyticsService.trackEvent('help_center_opened');
    setIsOpen(false);
  };

  const handleOpenTicket = () => {
    // Navegar para página de criação de ticket
    AnalyticsService.trackSupportTicketOpened();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="mb-4 w-72 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Precisa de ajuda?</CardTitle>
                <CardDescription className="text-xs">
                  Estamos aqui para ajudar você
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
                aria-label="Fechar ajuda"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            <Button
              onClick={handleCentralHelp}
              variant="outline"
              className="w-full justify-start text-sm h-auto p-3"
            >
              <BookOpen className="mr-3 h-4 w-4 text-primary" />
              <div className="text-left">
                <div className="font-medium">Central de Ajuda</div>
                <div className="text-xs text-muted-foreground">
                  FAQ e artigos úteis
                </div>
              </div>
            </Button>

            <Button
              onClick={handleOpenTicket}
              variant="outline"
              className="w-full justify-start text-sm h-auto p-3"
            >
              <MessageCircle className="mr-3 h-4 w-4 text-primary" />
              <div className="text-left">
                <div className="font-medium">Abrir Ticket</div>
                <div className="text-xs text-muted-foreground">
                  Fale diretamente conosco
                </div>
              </div>
            </Button>

            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              Resposta em até 24h úteis
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={handleToggle}
        size="icon"
        className="rounded-full shadow-lg h-12 w-12"
        aria-label={isOpen ? "Fechar ajuda" : "Abrir ajuda"}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};