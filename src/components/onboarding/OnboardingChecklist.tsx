import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle, ArrowRight } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingService } from '@/services/OnboardingService';
import { AnalyticsService } from '@/services/AnalyticsService';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  actionText: string;
  onAction: () => void;
  quickValue?: string;
}

export const OnboardingChecklist: React.FC = () => {
  const { 
    isChecklistOpen, 
    setChecklistOpen, 
    progress, 
    completeStep 
  } = useOnboarding();

  if (!isChecklistOpen || !progress) return null;

  const items: ChecklistItem[] = [
    {
      id: 'checklist_payable',
      title: 'Criar 1 conta a pagar',
      description: 'Organize suas contas e evite atrasos',
      isCompleted: OnboardingService.isStepCompleted(progress, 'checklist_payable') || progress.quickwin_done,
      actionText: 'Criar agora',
      onAction: () => {
        // Abrir modal/página de criação de conta
        AnalyticsService.trackEvent('checklist_action_clicked', { action: 'create_payable' });
      }
    },
    {
      id: 'checklist_transactions',
      title: 'Registrar 3 transações',
      description: 'Veja seus gastos tomando forma',
      isCompleted: OnboardingService.isStepCompleted(progress, 'checklist_transactions'),
      actionText: 'Adicionar',
      onAction: () => {
        // Abrir modal de transação
        AnalyticsService.trackEvent('checklist_action_clicked', { action: 'add_transaction' });
      },
      quickValue: 'R$ 25,50' // Sugestão de valor
    },
    {
      id: 'checklist_budget',
      title: 'Definir 1 orçamento',
      description: 'Estabeleça limites para uma categoria',
      isCompleted: OnboardingService.isStepCompleted(progress, 'checklist_budget'),
      actionText: 'Definir',
      onAction: () => {
        // Abrir modal de orçamento
        AnalyticsService.trackEvent('checklist_action_clicked', { action: 'set_budget' });
      }
    }
  ];

  const completedCount = items.filter(item => item.isCompleted).length;
  const progressPercentage = (completedCount / items.length) * 100;

  const handleClose = () => {
    setChecklistOpen(false);
    AnalyticsService.trackEvent('checklist_closed');
  };

  const handleSkip = (itemId: string) => {
    completeStep(itemId);
    AnalyticsService.trackEvent('checklist_step_skipped', { step: itemId });
  };

  return (
    <Card className="fixed top-4 right-4 w-80 z-50 shadow-lg border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold">
              3 passos pra fazer o dinheiro SOBRAR
            </CardTitle>
            <CardDescription className="text-xs">
              {completedCount}/3 concluídos
            </CardDescription>
          </div>
          
          <Button
            variant="ghost" 
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
            aria-label="Fechar checklist"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-1.5" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {Math.round(progressPercentage)}% completo
            </span>
            {completedCount === items.length && (
              <Badge variant="secondary" className="text-xs">
                🎉 Concluído!
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              item.isCompleted 
                ? 'bg-green-50 border-green-200' 
                : 'bg-muted/30 border-muted-foreground/20 hover:bg-muted/50'
            }`}
          >
            <div className="flex-shrink-0">
              <CheckCircle 
                className={`h-4 w-4 ${
                  item.isCompleted ? 'text-green-600' : 'text-muted-foreground'
                }`}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-medium ${
                item.isCompleted ? 'text-green-800' : 'text-foreground'
              }`}>
                {item.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>

            {!item.isCompleted && (
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  onClick={item.onAction}
                  className="h-7 px-2 text-xs"
                >
                  {item.actionText}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
                
                {item.quickValue && (
                  <div className="text-xs text-muted-foreground text-center">
                    Ex: {item.quickValue}
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSkip(item.id)}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Pular
                </Button>
              </div>
            )}
          </div>
        ))}

        {completedCount === items.length && (
          <div className="text-center pt-2">
            <Button
              onClick={() => {
                setChecklistOpen(false);
                AnalyticsService.trackOnboardingCompleted();
              }}
              className="w-full text-sm"
            >
              🎉 Explorar painel completo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};