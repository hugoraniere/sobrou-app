import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { AnchorService } from '@/services/AnchorService';

interface AnchorSearchProps {
  routeFilter: string;
  onRouteFilterChange: (route: string) => void;
  kindFilter: string;
  onKindFilterChange: (kind: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const KIND_OPTIONS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'button', label: 'Button' },
  { value: 'input', label: 'Input' },
  { value: 'select', label: 'Select' },
  { value: 'table', label: 'Table' },
  { value: 'chart', label: 'Chart' },
  { value: 'card', label: 'Card' },
  { value: 'list', label: 'List' },
  { value: 'tabs', label: 'Tabs' },
  { value: 'other', label: 'Other' },
];

export const AnchorSearch: React.FC<AnchorSearchProps> = ({
  routeFilter,
  onRouteFilterChange,
  kindFilter,
  onKindFilterChange,
  searchQuery,
  onSearchQueryChange
}) => {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [availableRoutes, setAvailableRoutes] = useState<string[]>([]);

  // Debounce search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchQueryChange(debouncedQuery);
    }, 250);

    return () => clearTimeout(timer);
  }, [debouncedQuery, onSearchQueryChange]);

  // Load available routes on mount
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        // Get unique routes by searching all anchors
        const result = await AnchorService.searchAnchors({ limit: 1000 });
        const routes = Array.from(new Set(result.anchors.map(anchor => anchor.route)))
          .filter(Boolean)
          .sort();
        setAvailableRoutes(routes);
      } catch (error) {
        console.error('Failed to load routes:', error);
      }
    };

    loadRoutes();
  }, []);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedQuery(e.target.value);
  }, []);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={debouncedQuery}
          onChange={handleSearchInputChange}
          placeholder="Buscar por nome ou anchor_id..."
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4">
        {/* Route Filter */}
        <div className="space-y-2">
          <Label className="text-sm">Filtrar por Rota</Label>
          <Select value={routeFilter} onValueChange={onRouteFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as rotas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as rotas</SelectItem>
              {availableRoutes.map((route) => (
                <SelectItem key={route} value={route}>
                  {route}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Kind Filter */}
        <div className="space-y-2">
          <Label className="text-sm">Filtrar por Tipo</Label>
          <Select value={kindFilter} onValueChange={onKindFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              {KIND_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};