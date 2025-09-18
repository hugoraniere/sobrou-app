import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface BillsSearchAndToggleProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  hidePaid: boolean;
  onHidePaidChange: (hide: boolean) => void;
  paidCount: number;
}

export const BillsSearchAndToggle: React.FC<BillsSearchAndToggleProps> = ({
  searchTerm,
  onSearchChange,
  hidePaid,
  onHidePaidChange,
  paidCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Campo de busca */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar conta por nome..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-neutral-50"
        />
      </div>

      {/* Toggle de contas pagas */}
      <div className="flex items-center space-x-2 whitespace-nowrap">
        <Switch
          id="hide-paid"
          checked={!hidePaid}
          onCheckedChange={(checked) => onHidePaidChange(!checked)}
        />
        <Label htmlFor="hide-paid" className="text-sm">
          Mostrar pagas ({paidCount})
        </Label>
      </div>
    </div>
  );
};