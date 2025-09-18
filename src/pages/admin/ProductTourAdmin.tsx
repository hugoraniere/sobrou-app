import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Settings, Eye, Play, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ProductTourService } from '@/services/productTourService';
import { ProductTourAdminService, ProductTourAdminConfig } from '@/services/ProductTourAdminService';
import { ProductTourStep } from '@/types/product-tour';

export const ProductTourAdmin: React.FC = () => {
  const [config, setConfig] = useState<ProductTourAdminConfig | null>(null);
  const [steps, setSteps] = useState<ProductTourStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [configData, stepsData] = await Promise.all([
        ProductTourAdminService.getConfig(),
        ProductTourAdminService.getSteps()
      ]);
      
      setConfig(configData);
      setSteps(stepsData);
    } catch (error) {
      console.error('Error loading product tour data:', error);
      toast.error('Erro ao carregar dados do Product Tour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTour = async (enabled: boolean) => {
    if (!config) return;
    
    setIsUpdating(true);
    
    try {
      // Update config
      const updatedConfig = { ...config, enabled };
      const success = await ProductTourAdminService.updateConfig(updatedConfig);
      
      if (success) {
        // Use real-time control methods
        if (enabled) {
          await ProductTourService.enableTourGlobally();
        } else {
          await ProductTourService.disableTourGlobally();
        }
        
        setConfig(updatedConfig);
        const action = enabled ? 'habilitado' : 'desabilitado';
        toast.success(`Product Tour ${action} com sucesso`);
      } else {
        toast.error('Erro ao atualizar configuração');
      }
    } catch (error) {
      console.error('Error toggling tour:', error);
      toast.error('Erro ao atualizar Product Tour');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStep = async (stepId: string, isActive: boolean) => {
    try {
      const success = await ProductTourAdminService.updateStep(stepId, { is_active: isActive });
      if (success) {
        setSteps(prev => prev.map(step => 
          step.id === stepId ? { ...step, is_active: isActive } : step
        ));
        const action = isActive ? 'ativado' : 'desativado';
        toast.success(`Passo ${action} com sucesso`);
      } else {
        toast.error('Erro ao atualizar passo');
      }
    } catch (error) {
      console.error('Error toggling step:', error);
      toast.error('Erro ao atualizar passo');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const activeSteps = steps.filter(step => step.is_active);
  const inactiveSteps = steps.filter(step => !step.is_active);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações do Product Tour
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                Product Tour {config?.enabled ? 'Habilitado' : 'Desabilitado'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {config?.enabled 
                  ? 'O tour está ativo para novos usuários' 
                  : 'O tour está desabilitado e não será exibido'
                }
              </p>
            </div>
            <Switch
              checked={config?.enabled || false}
              onCheckedChange={handleToggleTour}
              disabled={isUpdating}
            />
          </div>

          {/* Tour Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{steps.length}</div>
              <div className="text-sm text-muted-foreground">Total de Passos</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{activeSteps.length}</div>
              <div className="text-sm text-muted-foreground">Passos Ativos</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{inactiveSteps.length}</div>
              <div className="text-sm text-muted-foreground">Passos Inativos</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Steps Management */}
      {config?.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Gerenciar Passos do Tour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum passo configurado ainda.</p>
                  <p className="text-sm">Configure os passos do tour para começar a guiar seus usuários.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {steps
                    .sort((a, b) => a.step_order - b.step_order)
                    .map((step, index) => (
                      <div key={step.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {index + 1}
                            </Badge>
                            <h4 className="font-medium">{step.title}</h4>
                            <Badge variant={step.is_active ? "default" : "secondary"}>
                              {step.is_active ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {step.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Página: {step.page_route}</span>
                            <span>Elemento: {step.anchor_id}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={step.is_active}
                            onCheckedChange={(checked) => handleToggleStep(step.id, checked)}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disabled State Message */}
      {!config?.enabled && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-orange-900">Product Tour Desabilitado</h3>
                <p className="text-sm text-orange-700 mt-1">
                  O tour está desabilitado e não será exibido para os usuários. 
                  Todos os tours ativos foram interrompidos automaticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};