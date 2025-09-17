import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { AnalyticsService } from '@/services/AnalyticsService';
import { CreditCard, Receipt, Upload, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickWinDirectionsProps {
  onComplete: () => void;
}

export const QuickWinDirections: React.FC<QuickWinDirectionsProps> = ({ onComplete }) => {
  const { progress, updateProgress } = useOnboarding();
  const { toast } = useToast();

  const shouldShowPayableOption = progress?.goal === 'dividas' || progress?.goal === 'organizar';

  React.useEffect(() => {
    const defaultOption = shouldShowPayableOption ? 'payable' : 'transaction';
    AnalyticsService.trackQuickWinOpened(defaultOption);
  }, [shouldShowPayableOption]);

  const handleActionClick = async (actionType: string) => {
    // Marcar quick win como done
    await updateProgress({ quickwin_done: true });
    AnalyticsService.trackEvent('quick_win_action_selected', { action: actionType });
    
    toast({
      message: "Perfeito! Agora você será direcionado para a funcionalidade completa.",
      type: 'success'
    });

    // Completar o onboarding e prosseguir
    onComplete();
  };

  const handleUploadClick = async () => {
    await handleActionClick('upload_ia');
    toast({
      message: "💡 Dica: Use o botão de upload no canto superior direito para carregar extratos com IA!",
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Vamos fazer acontecer! ⚡</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Escolha uma ação e você será direcionado para a funcionalidade completa:
        </p>

        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Upload com IA - Destaque principal */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    Carregar extrato com IA 
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                      RECOMENDADO
                    </span>
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    Nosso diferencial! Carregue PDF/foto do extrato e a IA organiza tudo automaticamente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button onClick={handleUploadClick} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Usar IA para carregar dados
              </Button>
            </CardContent>
          </Card>

          {/* Opções convencionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {shouldShowPayableOption && (
              <Card className="cursor-pointer hover:shadow-md transition-all">
                <CardHeader className="text-center pb-2">
                  <Receipt className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <CardTitle className="text-sm">Criar conta a pagar</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs text-center mb-3">
                    Evite atraso: cadastre uma conta que vence este mês
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleActionClick('payable')}
                  >
                    Abrir formulário
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <Card className="cursor-pointer hover:shadow-md transition-all">
              <CardHeader className="text-center pb-2">
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <CardTitle className="text-sm">Registrar transação</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs text-center mb-3">
                  Registre uma despesa manualmente
                </CardDescription>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleActionClick('transaction')}
                >
                  Abrir formulário
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onComplete}>
          Pular por agora
        </Button>
        
        <Button onClick={handleUploadClick} className="px-8">
          <Sparkles className="mr-2 h-4 w-4" />
          Usar IA (Recomendado)
        </Button>
      </div>
    </div>
  );
};