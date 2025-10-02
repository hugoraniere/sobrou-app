import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface PreviewToolbarProps {
  viewportSize: ViewportSize;
  onViewportChange: (size: ViewportSize) => void;
}

const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  viewportSize,
  onViewportChange,
}) => {
  const viewportOptions = [
    {
      key: 'desktop' as const,
      label: 'Desktop',
      icon: Monitor,
      width: '100%',
    },
    {
      key: 'tablet' as const,
      label: 'Tablet',
      icon: Tablet,
      width: '820px',
    },
    {
      key: 'mobile' as const,
      label: 'Mobile',
      icon: Smartphone,
      width: '390px',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Preview</h3>
      
      {/* Viewport Selector */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {viewportOptions.map((option) => {
          const IconComponent = option.icon;
          
          return (
            <Button
              key={option.key}
              variant={viewportSize === option.key ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'flex-1 gap-2 text-xs font-medium transition-all duration-200',
                viewportSize === option.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => onViewportChange(option.key)}
            >
              <IconComponent className="w-3 h-3" />
              {option.label}
            </Button>
          );
        })}
      </div>

      {/* Current Viewport Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Resolução:</span>
        <Badge variant="outline" className="text-xs">
          {viewportOptions.find(opt => opt.key === viewportSize)?.width}
        </Badge>
      </div>

      {/* Responsive Design Tips */}
      {viewportSize !== 'desktop' && (
        <div className="p-3 bg-accent/30 rounded-lg border border-accent">
          <div className="text-xs text-muted-foreground">
            <strong>Modo {viewportSize === 'tablet' ? 'Tablet' : 'Mobile'}:</strong>
            <br />
            Teste a responsividade do design nesta resolução.
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewToolbar;