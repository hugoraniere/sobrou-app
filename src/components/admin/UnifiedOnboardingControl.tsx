import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Route, 
  List, 
  MessageSquare, 
  Settings, 
  Eye, 
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { ProductTourService } from '@/services/productTourService';
import { ProductTourAdminService } from '@/services/ProductTourAdminService';

interface OnboardingFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  status: 'active' | 'inactive' | 'error';
  lastUpdated?: string;
}

export const UnifiedOnboardingControl: React.FC = () => {
  const [features, setFeatures] = useState<OnboardingFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    setIsLoading(true);
    try {
      // Load all feature states
      const [tourEnabled, tourConfig] = await Promise.all([
        ProductTourService.isTourEnabled(),
        ProductTourAdminService.getConfig().catch(() => null)
      ]);

      const features: OnboardingFeature[] = [
        {
          id: 'product-tour',
          name: 'Product Tour',
          description: 'Tour guiado para novos usuários',
          icon: <Route className="w-4 h-4" />,
          enabled: tourEnabled,
          status: tourEnabled ? 'active' : 'inactive'
        },
        {
          id: 'stepper',
          name: 'Get Started Stepper',
          description: 'Checklist de primeiros passos',
          icon: <List className="w-4 h-4" />,
          enabled: true, // TODO: Get from stepper config
          status: 'active'
        },
        {
          id: 'modal',
          name: 'Modal Informativo',
          description: 'Release notes e avisos',
          icon: <MessageSquare className="w-4 h-4" />,
          enabled: false, // TODO: Get from modal config
          status: 'inactive'
        }
      ];

      setFeatures(features);
    } catch (error) {
      console.error('Error loading features:', error);
      toast.error('Erro ao carregar recursos de onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFeature = async (featureId: string, enabled: boolean) => {
    setIsUpdating(featureId);
    
    try {
      switch (featureId) {
        case 'product-tour':
          if (enabled) {
            await ProductTourService.enableTourGlobally();
          } else {
            await ProductTourService.disableTourGlobally();
          }
          break;
        
        case 'stepper':
          // TODO: Implement stepper toggle
          break;
          
        case 'modal':
          // TODO: Implement modal toggle
          break;

        default:
          throw new Error(`Feature ${featureId} not implemented`);
      }

      // Update local state optimistically
      setFeatures(prev => prev.map(f => 
        f.id === featureId 
          ? { ...f, enabled, status: enabled ? 'active' : 'inactive' }
          : f
      ));

      const action = enabled ? 'habilitado' : 'desabilitado';
      toast.success(`Recurso ${action} com sucesso`);

    } catch (error) {
      console.error('Error toggling feature:', error);
      toast.error('Erro ao atualizar recurso');
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Controle Unificado de Onboarding
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie todos os recursos de onboarding em um local
            </p>
          </div>
          <Button onClick={loadFeatures} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.map((feature) => (
          <div 
            key={feature.id} 
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              {feature.icon}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{feature.name}</h4>
                  {getStatusIcon(feature.status)}
                  <Badge 
                    variant={feature.enabled ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {feature.enabled ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // TODO: Open preview for each feature
                  toast.info('Preview em desenvolvimento');
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={feature.enabled}
                  onCheckedChange={(checked) => handleToggleFeature(feature.id, checked)}
                  disabled={isUpdating === feature.id}
                />
                <Label className="sr-only">
                  {feature.enabled ? 'Desabilitar' : 'Habilitar'} {feature.name}
                </Label>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};