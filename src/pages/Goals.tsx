
import React from 'react';
import { useTranslation } from 'react-i18next';
import SavingGoals from '../components/SavingGoals';
import { useSavingGoals } from '../hooks/useSavingGoals';
import { Card } from '@/components/ui/card';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const Goals = () => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const {
    savingGoals,
    isLoading,
    error,
    refetchGoals
  } = useSavingGoals();

  if (isLoading) {
    return (
      <div className={cn(
        "w-full",
        isMobile ? "px-4 py-8" : "container mx-auto max-w-screen-xl py-8"
      )}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando metas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "w-full",
        isMobile ? "px-4 py-8" : "container mx-auto max-w-screen-xl py-8"
      )}>
        <div className="text-center py-8">
          <p className="text-destructive mb-4">Erro ao carregar metas: {error.message}</p>
          <button 
            onClick={refetchGoals} 
            className="text-primary hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full",
      isMobile ? "px-4 py-8" : "container mx-auto max-w-screen-xl py-8"
    )}>
      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold">{t('goals.title', 'Metas de Economia')}</h1>
        <p className="text-gray-600">Defina e acompanhe suas metas financeiras</p>
      </div>
      
      <Card className="p-6">
        <SavingGoals 
          savingGoals={savingGoals}
          onGoalAdded={refetchGoals}
          onGoalUpdated={refetchGoals}
        />
      </Card>
    </div>
  );
};

export default Goals;
