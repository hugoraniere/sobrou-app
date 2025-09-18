import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProductTourAdminConfig } from '@/services/ProductTourAdminService';

interface BehaviorSettingsProps {
  config: ProductTourAdminConfig;
  onUpdate: (updates: Partial<ProductTourAdminConfig>) => void;
}

export function BehaviorSettings({ config, onUpdate }: BehaviorSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Comportamento</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Permitir pular passos</Label>
              <p className="text-sm text-muted-foreground">
                Usuários podem pular passos individuais durante o tour
              </p>
            </div>
            <Switch
              checked={config.allow_skip}
              onCheckedChange={(checked) => onUpdate({ allow_skip: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Mostrar progresso</Label>
              <p className="text-sm text-muted-foreground">
                Exibir barra de progresso durante o tour
              </p>
            </div>
            <Switch
              checked={config.show_progress}
              onCheckedChange={(checked) => onUpdate({ show_progress: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}