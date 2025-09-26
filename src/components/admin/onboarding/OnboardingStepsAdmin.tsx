import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { OnboardingService } from '@/services/OnboardingService';
import { Plus, Edit2, Trash2, Eye, Users } from 'lucide-react';
import { toast } from 'sonner';

const OnboardingStepsAdmin: React.FC = () => {
  const [steps, setSteps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    try {
      setIsLoading(true);
      const data = await OnboardingService.getSteps();
      setSteps(data);
    } catch (error) {
      console.error('Error loading onboarding steps:', error);
      toast.error('Erro ao carregar passos de onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStep = async (stepId: number, isActive: boolean) => {
    try {
      await OnboardingService.updateStep(stepId, { active: isActive });
      await loadSteps();
      toast.success(isActive ? 'Passo ativado' : 'Passo desativado');
    } catch (error) {
      console.error('Error toggling step:', error);
      toast.error('Erro ao atualizar passo');
    }
  };

  const handleDeleteStep = async (stepId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este passo?')) {
      try {
        await OnboardingService.deleteStep(stepId);
        await loadSteps();
        toast.success('Passo excluído com sucesso');
      } catch (error) {
        console.error('Error deleting step:', error);
        toast.error('Erro ao excluir passo');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-text-secondary">Carregando passos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Passos de Onboarding ({steps.length})
          </h3>
          <p className="text-sm text-text-secondary">
            Configure os passos que guiam novos usuários
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Passo
        </Button>
      </div>

      <div className="grid gap-3">
        {steps.map((step) => (
          <Card key={step.id} className="relative">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">
                      {step.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {step.step_key}
                      </Badge>
                      <Badge 
                        variant={step.active ? "default" : "secondary"} 
                        className="text-xs"
                      >
                        {step.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      {step.target_count && (
                        <Badge variant="outline" className="text-xs">
                          Meta: {step.target_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={step.active}
                    onCheckedChange={(checked) => handleToggleStep(step.id, checked)}
                  />
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteStep(step.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {step.description && (
                <p className="text-sm text-text-secondary mt-2 ml-11">
                  {step.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {steps.length === 0 && (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Nenhum passo criado
          </h3>
          <p className="text-text-secondary mb-4">
            Crie seu primeiro passo de onboarding para guiar novos usuários
          </p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Primeiro Passo
          </Button>
        </Card>
      )}
    </div>
  );
};

export default OnboardingStepsAdmin;