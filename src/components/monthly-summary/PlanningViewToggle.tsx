
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PlanningViewToggleProps {
  isDetailedView: boolean;
  onToggle: (detailed: boolean) => void;
}

export const PlanningViewToggle: React.FC<PlanningViewToggleProps> = ({
  isDetailedView,
  onToggle
}) => {
  return (
    <div className="flex items-center space-x-3">
      <Label htmlFor="view-toggle" className="text-sm font-medium">
        Visão Simples
      </Label>
      <Switch
        id="view-toggle"
        checked={isDetailedView}
        onCheckedChange={onToggle}
      />
      <Label htmlFor="view-toggle" className="text-sm font-medium">
        Visão Detalhada
      </Label>
    </div>
  );
};
