import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Palette, 
  Settings,
  Info
} from 'lucide-react';
import { FEATURE_MODULES, PlanFeature } from '@/constants/planFeatures';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const iconMap = {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Palette,
  Settings
};

interface PlanFeatureData {
  id: string;
  enabled: boolean;
  limit?: string;
}

interface PlanFeatureManagerProps {
  selectedFeatures: PlanFeatureData[];
  onFeatureChange: (featureId: string, enabled: boolean, limit?: string) => void;
}

const PlanFeatureManager: React.FC<PlanFeatureManagerProps> = ({
  selectedFeatures,
  onFeatureChange
}) => {
  const isFeatureSelected = (featureId: string): PlanFeatureData | undefined => {
    return selectedFeatures.find(f => f.id === featureId);
  };

  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    const currentFeature = isFeatureSelected(featureId);
    onFeatureChange(featureId, enabled, currentFeature?.limit);
  };

  const handleLimitChange = (featureId: string, limit: string) => {
    const currentFeature = isFeatureSelected(featureId);
    if (currentFeature) {
      onFeatureChange(featureId, currentFeature.enabled, limit);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Funcionalidades por Módulo</h3>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure quais funcionalidades estarão disponíveis neste plano.</p>
              <p>Funcionalidades são diferentes de permissões de usuário.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {FEATURE_MODULES.map((module) => {
            const IconComponent = iconMap[module.icon as keyof typeof iconMap];
            const enabledCount = module.features.filter(feature => 
              isFeatureSelected(feature.id)?.enabled
            ).length;

            return (
              <Card key={module.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{module.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {enabledCount}/{module.features.length}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {module.features.map((feature) => {
                    const selectedFeature = isFeatureSelected(feature.id);
                    const isEnabled = selectedFeature?.enabled || false;

                    return (
                      <div key={feature.id} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium cursor-pointer">
                                {feature.name}
                              </Label>
                              {feature.type !== 'boolean' && (
                                <Badge variant="secondary" className="text-xs">
                                  {feature.type === 'limit' ? 'Limite' : 'Texto'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {feature.description}
                            </p>
                          </div>
                        </div>

                        {isEnabled && feature.type !== 'boolean' && (
                          <div className="ml-8">
                            <Input
                              placeholder={
                                feature.type === 'limit' 
                                  ? feature.defaultLimit || "Ex: 100/mês" 
                                  : "Valor personalizado"
                              }
                              value={selectedFeature?.limit || ''}
                              onChange={(e) => handleLimitChange(feature.id, e.target.value)}
                              className="text-xs h-8"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PlanFeatureManager;