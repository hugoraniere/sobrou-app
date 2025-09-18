import React, { useState, useCallback, useEffect } from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerFooter,
  DrawerClose 
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useAnchorSearch } from '@/hooks/useAnchorSearch';
import { AnchorSearch } from './AnchorSearch';
import { AnchorListItem } from './AnchorListItem';
import { AnchorPickingManager } from '../anchor-picking/AnchorPickingManager';
import { AnchorMaintenancePanel } from '../anchor-maintenance/AnchorMaintenancePanel';
import { AnchorStatusBadge } from '../anchor-maintenance/AnchorStatusBadge';
import { useAnchorMaintenance } from '@/hooks/useAnchorMaintenance';
import type { OnboardingAnchor } from '@/types/onboarding-anchors';
import { Plus, X } from 'lucide-react';

interface AnchorPickerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (anchorId: string) => void;
  defaultRoute?: string;
}

const ITEM_HEIGHT = 100; // Height for each list item
const VISIBLE_ITEMS = 5; // Number of items visible at once
const LIST_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export const AnchorPickerDrawer: React.FC<AnchorPickerDrawerProps> = ({
  open,
  onOpenChange,
  value,
  onChange,
  defaultRoute = ''
}) => {
  const [selectedAnchorId, setSelectedAnchorId] = useState(value);
  const [routeFilter, setRouteFilter] = useState(defaultRoute);
  const [kindFilter, setKindFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    anchors,
    loading,
    error,
    hasMore,
    total,
    search,
    loadMore,
    clear
  } = useAnchorSearch();

  // Perform search when filters change
  useEffect(() => {
    if (open) {
      search({
        route: routeFilter && routeFilter !== 'all' ? routeFilter : undefined,
        kind: kindFilter && kindFilter !== 'all' ? kindFilter as any : undefined,
        query: searchQuery || undefined,
        limit: 50
      });
    }
  }, [open, routeFilter, kindFilter, searchQuery, search]);

  // Clear search when drawer closes
  useEffect(() => {
    if (!open) {
      clear();
      setSearchQuery('');
    }
  }, [open, clear]);

  // Handle anchor selection
  const handleSelectAnchor = useCallback((anchor: OnboardingAnchor) => {
    setSelectedAnchorId(anchor.anchor_id);
    onChange(anchor.anchor_id);
    onOpenChange(false);
  }, [onChange, onOpenChange]);

  // Handle confirm selection
  const handleConfirmSelection = useCallback(() => {
    if (selectedAnchorId) {
      onChange(selectedAnchorId);
      onOpenChange(false);
    }
  }, [selectedAnchorId, onChange, onOpenChange]);

  // Handle create new anchor
  const handleCreateNewAnchor = useCallback(() => {
    // TODO: Implementar na Etapa 3
    console.log('Criar nova âncora - será implementado na Etapa 3');
  }, []);

  // Handle anchor picked from app
  const handleAnchorPickedFromApp = useCallback((anchorId: string) => {
    onChange(anchorId);
    onOpenChange(false);
  }, [onChange, onOpenChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
    } else if (e.key === 'Enter' && selectedAnchorId) {
      handleConfirmSelection();
    }
  }, [selectedAnchorId, onOpenChange, handleConfirmSelection]);

  // Fallback renderer when react-window fails
  const renderAnchorsList = useCallback(() => {
    return (
      <div className="max-h-96 overflow-y-auto space-y-1 border rounded-md p-2">
        {anchors.map((anchor) => (
          <AnchorListItem
            key={anchor.id}
            anchor={anchor}
            isSelected={selectedAnchorId === anchor.anchor_id}
            onSelect={() => handleSelectAnchor(anchor)}
            onRename={(newName) => {
              // TODO: Implementar rename via AnchorService.updateAnchor
              console.log('Renomear âncora:', anchor.id, 'para:', newName);
            }}
          />
        ))}
      </div>
    );
  }, [anchors, selectedAnchorId, handleSelectAnchor]);


  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent 
        className="h-[80vh] flex flex-col"
        onKeyDown={handleKeyDown}
      >
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle>Selecionar Componente</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </DrawerClose>
          </div>
          
          <AnchorSearch
            routeFilter={routeFilter}
            onRouteFilterChange={setRouteFilter}
            kindFilter={kindFilter}
            onKindFilterChange={setKindFilter}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        </DrawerHeader>

        <div className="flex-1 overflow-hidden p-4">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          {anchors.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-muted-foreground mb-2">Nenhuma âncora encontrada</div>
              <div className="text-sm text-muted-foreground mb-4">
                Use "Criar nova âncora" para adicionar componentes
              </div>
              <Button onClick={handleCreateNewAnchor} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Criar nova âncora
              </Button>
            </div>
          ) : (
            <div className="h-full">
              <div className="mb-2 text-sm text-muted-foreground">
                {loading ? 'Carregando...' : `${total} âncoras encontradas`}
              </div>
              
              {renderAnchorsList()}
              
              {hasMore && (
                <div className="mt-2 text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? 'Carregando...' : 'Carregar mais'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <DrawerFooter className="border-t">
          <AnchorPickingManager 
            onAnchorSelected={handleAnchorPickedFromApp}
            disabled={false}
          />
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleCreateNewAnchor}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Criar nova âncora
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmSelection}
                disabled={!selectedAnchorId}
              >
                Selecionar
              </Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};