import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'monthly' | 'all';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  className
}) => {
  return (
    <div className={cn("flex gap-1 bg-muted p-1 rounded-lg", className)}>
      <Button
        variant={viewMode === 'monthly' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('monthly')}
        className={cn(
          "flex items-center gap-2 text-xs rounded-md",
          viewMode === 'monthly' 
            ? "bg-background shadow-sm text-foreground" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Calendar className="h-3 w-3" />
        Visão Mensal
      </Button>
      <Button
        variant={viewMode === 'all' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('all')}
        className={cn(
          "flex items-center gap-2 text-xs rounded-md",
          viewMode === 'all' 
            ? "bg-background shadow-sm text-foreground" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <List className="h-3 w-3" />
        Todas
      </Button>
    </div>
  );
};

export default ViewModeToggle;