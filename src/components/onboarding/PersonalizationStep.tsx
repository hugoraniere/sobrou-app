import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OnboardingGoal } from '@/types/onboarding';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { AnalyticsService } from '@/services/AnalyticsService';
import { CreditCard, TrendingUp, Target } from 'lucide-react';

const goals = [
  {
    id: 'dividas' as OnboardingGoal,
    title: 'Quitar dívidas',
    description: 'Organizar e acompanhar suas dívidas',
    icon: CreditCard,
  },
  {
    id: 'organizar' as OnboardingGoal,
    title: 'Organizar gastos',
    description: 'Controlar onde seu dinheiro vai',
    icon: TrendingUp,
  },
  {
    id: 'cartao' as OnboardingGoal,
    title: 'Acompanhar cartão',
    description: 'Monitorar gastos do cartão de crédito',
    icon: Target,
  },
];

const effortOptions = [
  { minutes: 5, label: '5min' },
  { minutes: 15, label: '15min' },
  { minutes: 30, label: '30min' },
];

interface PersonalizationStepProps {
  onComplete: () => void;
}

export const PersonalizationStep: React.FC<PersonalizationStepProps> = ({ onComplete }) => {
  const { updateProgress } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState<OnboardingGoal | null>(null);
  const [selectedEffort, setSelectedEffort] = useState<number | null>(null);

  const handleGoalSelect = (goal: OnboardingGoal) => {
    setSelectedGoal(goal);
    AnalyticsService.trackGoalSelected(goal);
  };

  const handleEffortSelect = (minutes: number) => {
    setSelectedEffort(minutes);
    AnalyticsService.trackEffortSelected(minutes);
  };

  const handleContinue = async () => {
    if (selectedGoal && selectedEffort) {
      await updateProgress({
        goal: selectedGoal,
        effort_minutes: selectedEffort,
      });
      onComplete();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedGoal && selectedEffort) {
      e.preventDefault();
      handleContinue();
    }
  };

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown}>
      <div>
        <h2 className="text-lg font-semibold mb-2">Qual seu objetivo principal?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;
            
            return (
              <Card
                key={goal.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleGoalSelect(goal.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Objetivo: ${goal.title} - ${goal.description}`}
              >
                <CardHeader className="text-center pb-2">
                  <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <CardTitle className="text-sm">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs text-center">
                    {goal.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium mb-3">Quanto tempo você tem hoje?</h3>
        <div className="flex gap-2 justify-center">
          {effortOptions.map((option) => (
            <Badge
              key={option.minutes}
              variant={selectedEffort === option.minutes ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => handleEffortSelect(option.minutes)}
              role="button"
              tabIndex={0}
              aria-pressed={selectedEffort === option.minutes}
              aria-label={`Tempo disponível: ${option.label}`}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedGoal || !selectedEffort}
          aria-label="Continuar para próximo passo"
        >
          Continuar
        </Button>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Use Enter para continuar após selecionar as opções
      </div>
    </div>
  );
};