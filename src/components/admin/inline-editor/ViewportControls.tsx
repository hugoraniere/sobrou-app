import React from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface ViewportControlsProps {
  currentViewport: ViewportSize;
  onViewportChange: (viewport: ViewportSize) => void;
}

const ViewportControls: React.FC<ViewportControlsProps> = ({
  currentViewport,
  onViewportChange
}) => {
  const viewports = [
    {
      key: 'desktop' as ViewportSize,
      icon: Monitor,
      label: 'Desktop',
      width: '1200px',
      description: '1200px e acima'
    },
    {
      key: 'tablet' as ViewportSize,
      icon: Tablet,
      label: 'Tablet',
      width: '768px',
      description: '768px - 1199px'
    },
    {
      key: 'mobile' as ViewportSize,
      icon: Smartphone,
      label: 'Mobile',
      width: '375px',
      description: '375px - 767px'
    }
  ];

  return (
    <div className="flex items-center gap-1 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-1">
      {viewports.map((viewport) => {
        const Icon = viewport.icon;
        const isActive = currentViewport === viewport.key;
        
        return (
          <Button
            key={viewport.key}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewportChange(viewport.key)}
            className={cn(
              'gap-2 transition-all duration-200',
              isActive && 'bg-primary text-primary-foreground shadow-sm'
            )}
            title={`${viewport.label} (${viewport.description})`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{viewport.label}</span>
          </Button>
        );
      })}
      
      <div className="ml-2 px-2 py-1 text-xs text-muted-foreground bg-muted/50 rounded">
        {viewports.find(v => v.key === currentViewport)?.width}
      </div>
    </div>
  );
};

export default ViewportControls;