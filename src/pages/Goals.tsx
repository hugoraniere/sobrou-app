
import React from 'react';
import { useTranslation } from 'react-i18next';
import SavingGoals from '../components/SavingGoals';
import { useSavingGoals } from '../hooks/useSavingGoals';
import { Card } from '@/components/ui/card';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';

const Goals = () => {
  const { t } = useTranslation();
  const {
    savingGoals,
    isLoading,
    error,
    refetchGoals
  } = useSavingGoals();

  if (isLoading) {
    return (
      <ResponsivePageContainer>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando metas...</p>
          </div>
        </div>
      </ResponsivePageContainer>
    );
  }

  if (error) {
    return (
      <ResponsivePageContainer>
        <div className="text-center py-8">
          <p className="text-destructive mb-4">Erro ao carregar metas: {error.message}</p>
          <button 
            onClick={refetchGoals} 
            className="text-primary hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <ResponsivePageHeader 
        title={t('goals.title')}
        description={t('goals.subtitle')}
      />
      
      <div className="space-y-6">
        <Card className="p-4 sm:p-6">
          <SavingGoals 
            savingGoals={savingGoals}
            onGoalAdded={refetchGoals}
            onGoalUpdated={refetchGoals}
          />
        </Card>
      </div>
    </ResponsivePageContainer>
  );
};

export default Goals;
