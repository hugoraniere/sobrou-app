import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LazyThumbnail } from './LazyThumbnail';
import { Check, Edit2, ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OnboardingAnchor } from '@/types/onboarding-anchors';

interface AnchorListItemProps {
  anchor: OnboardingAnchor;
  isSelected: boolean;
  onSelect: () => void;
  onRename: (newName: string) => void;
}

export const AnchorListItem: React.FC<AnchorListItemProps> = ({
  anchor,
  isSelected,
  onSelect,
  onRename
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renamingValue, setRenamingValue] = useState(anchor.friendly_name);

  // Handle rename start
  const handleStartRename = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
    setRenamingValue(anchor.friendly_name);
  }, [anchor.friendly_name]);

  // Handle rename save
  const handleSaveRename = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (renamingValue.trim() && renamingValue !== anchor.friendly_name) {
      onRename(renamingValue.trim());
    }
    setIsRenaming(false);
  }, [renamingValue, anchor.friendly_name, onRename]);

  // Handle rename cancel
  const handleCancelRename = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(false);
    setRenamingValue(anchor.friendly_name);
  }, [anchor.friendly_name]);

  // Handle rename keyboard
  const handleRenameKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      handleSaveRename(e as any);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      handleCancelRename(e as any);
    }
  }, [handleSaveRename, handleCancelRename]);

  // Handle view in app
  const handleViewInApp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const url = new URL(window.location.href);
    url.pathname = anchor.route;
    url.searchParams.set('tour', 'preview');
    url.searchParams.set('anchor', anchor.anchor_id);
    window.open(url.toString(), '_blank');
  }, [anchor]);

  // Handle item click (select)
  const handleItemClick = useCallback(() => {
    if (!isRenaming) {
      onSelect();
    }
  }, [isRenaming, onSelect]);

  // Handle Enter key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isRenaming) {
      onSelect();
    }
  }, [isRenaming, onSelect]);

  // Get kind badge color
  const getKindColor = (kind: string) => {
    switch (kind) {
      case 'button': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'input': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'select': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'table': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'chart': return 'bg-pink-100 text-pink-800 hover:bg-pink-200';
      case 'card': return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      case 'list': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'tabs': return 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card
      className={cn(
        "p-3 m-1 cursor-pointer transition-all hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
      onClick={handleItemClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="option"
      aria-selected={isSelected}
    >
      <div className="flex gap-3 items-start">
        {/* Thumbnail */}
        <LazyThumbnail
          thumbUrl={anchor.thumb_url}
          alt={`Preview of ${anchor.friendly_name}`}
          className="flex-shrink-0"
          width={120}
          height={80}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Friendly Name (editable) */}
          <div className="flex items-center gap-2 mb-2">
            {isRenaming ? (
              <div className="flex items-center gap-1 flex-1">
                <Input
                  value={renamingValue}
                  onChange={(e) => setRenamingValue(e.target.value)}
                  onKeyDown={handleRenameKeyDown}
                  className="text-sm h-8"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveRename}
                  className="h-8 w-8 p-0"
                >
                  <Check className="w-3 h-3 text-green-600" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelRename}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-3 h-3 text-red-600" />
                </Button>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-foreground text-sm flex-1 truncate">
                  {anchor.friendly_name}
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleStartRename}
                  className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                  title="Renomear"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>

          {/* Anchor ID */}
          <div className="font-mono text-xs text-muted-foreground mb-2 truncate">
            {anchor.anchor_id}
          </div>

          {/* Route and Kind */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {anchor.route}
            </Badge>
            <Badge className={cn("text-xs", getKindColor(anchor.kind))}>
              {anchor.kind}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleViewInApp}
              className="h-7 px-2 text-xs"
              title="Ver no app"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Preview
            </Button>
            
            {anchor.last_verified_at && (
              <span className="text-xs text-muted-foreground ml-auto">
                Verificado em {new Date(anchor.last_verified_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};