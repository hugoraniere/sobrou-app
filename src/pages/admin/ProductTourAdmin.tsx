import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Settings, Eye, BarChart3, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductTourService } from '@/services/productTourService';
import { ProductTourStep } from '@/types/product-tour';

export default function ProductTourAdmin() {
  const [tourEnabled, setTourEnabled] = useState(false);
  const [autoStartEnabled, setAutoStartEnabled] = useState(false);
  const [tourSteps, setTourSteps] = useState<ProductTourStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load current settings
  useEffect(() => {
    loadTourSettings();
  }, []);

  const loadTourSettings = async () => {
    try {
      setIsLoading(true);
      
      // Load tour enabled status
      const enabled = await ProductTourService.isTourEnabled();
      setTourEnabled(enabled);
      
      // Load tour settings
      const settings = await ProductTourService.getTourSettings();
      const tourConfig = settings.tour_config || {};
      setAutoStartEnabled(tourConfig.auto_start_for_new_users || false);
      
      // Load tour steps
      const steps = await ProductTourService.getTourSteps();
      setTourSteps(steps);
      
    } catch (error) {
      console.error('Error loading tour settings:', error);
      toast({
        message: 'Não foi possível carregar as configurações do tour.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTourEnabledChange = async (enabled: boolean) => {
    try {
      // Update tour enabled status using the new service method
      await ProductTourService.setTourEnabled(enabled);
      
      setTourEnabled(enabled);
      
      toast({
        message: enabled 
          ? 'O Product Tour está agora ativo para novos usuários.' 
          : 'O Product Tour foi desabilitado globalmente.',
        type: 'success',
      });
      
      // If disabling, we could add logic here to stop active tours
      if (!enabled) {
        console.log('Tour disabled - active tours should be stopped');
      }
      
    } catch (error) {
      console.error('Error updating tour status:', error);
      toast({
        message: 'Não foi possível atualizar o status do tour.',
        type: 'error',
      });
      // Revert the switch
      setTourEnabled(!enabled);
    }
  };

  const handleAutoStartChange = async (enabled: boolean) => {
    try {
      // Update auto-start configuration using the new service method
      await ProductTourService.updateTourConfig({ 
        auto_start_for_new_users: enabled 
      });
      
      setAutoStartEnabled(enabled);
      
      toast({
        message: enabled 
          ? 'Tour será iniciado automaticamente para novos usuários.' 
          : 'Tour não será mais iniciado automaticamente.',
        type: 'success',
      });
      
    } catch (error) {
      console.error('Error updating auto-start setting:', error);
      toast({
        message: 'Não foi possível atualizar a configuração.',
        type: 'error',
      });
      setAutoStartEnabled(!enabled);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Product Tour</h1>
        <p className="text-text-secondary mt-1">
          Configure e gerencie o tour guiado para novos usuários
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Tour</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={tourEnabled ? "default" : "secondary"}>
                {tourEnabled ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Passos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tourSteps.length}</div>
            <p className="text-xs text-muted-foreground">
              {tourSteps.filter(s => s.is_active).length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-início</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={autoStartEnabled ? "default" : "secondary"}>
                {autoStartEnabled ? "Habilitado" : "Desabilitado"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Configuration */}
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="steps">Passos do Tour</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure o comportamento global do Product Tour
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">Habilitar Product Tour</div>
                  <div className="text-sm text-text-secondary">
                    Controla se o tour está disponível globalmente
                  </div>
                </div>
                <Switch
                  checked={tourEnabled}
                  onCheckedChange={handleTourEnabledChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">Auto-iniciar para novos usuários</div>
                  <div className="text-sm text-text-secondary">
                    Inicia automaticamente o tour para usuários novos (últimas 24h)
                  </div>
                </div>
                <Switch
                  checked={autoStartEnabled}
                  onCheckedChange={handleAutoStartChange}
                  disabled={!tourEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Passos do Tour</CardTitle>
              <CardDescription>
                Visualize e gerencie os passos do tour guiado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tourSteps.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-secondary">Nenhum passo configurado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tourSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-text-secondary">
                            {step.page_route} • {step.anchor_id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={step.is_active ? "default" : "secondary"}>
                          {step.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics do Tour</CardTitle>
              <CardDescription>
                Estatísticas de uso do Product Tour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-text-secondary">
                  Analytics em desenvolvimento...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Testar Tour</span>
            </Button>
            <Button variant="outline" onClick={loadTourSettings}>
              Atualizar Dados
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}