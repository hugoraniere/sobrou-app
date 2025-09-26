import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSectionManagement } from '@/contexts/SectionManagementContext';
import SectionList from './SectionList';

const SectionToolbar: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { sections } = useSectionManagement();

  const visibleSections = sections.filter(s => s.isVisible);

  if (!isVisible) {
    return (
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsVisible(true)}
          className="shadow-lg"
          title="Mostrar painel de seções"
        >
          <Layers className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed right-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-300",
      isMinimized ? "w-12" : "w-80"
    )}>
      <Card className="bg-card/95 backdrop-blur-sm border shadow-xl">
        {/* Header */}
        <div className="p-3 border-b flex items-center justify-between">
          {!isMinimized && (
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Seções</span>
              <Badge variant="secondary" className="text-xs">
                {visibleSections.length}
              </Badge>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            {!isMinimized && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible(false)}
                className="w-6 h-6"
                title="Ocultar painel"
              >
                <EyeOff className="w-3 h-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-6 h-6"
              title={isMinimized ? "Expandir" : "Minimizar"}
            >
              {isMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-3">
            <SectionList />
          </div>
        )}

        {/* Minimized view */}
        {isMinimized && (
          <div className="p-2 flex flex-col items-center gap-1">
            {visibleSections.slice(0, 3).map((section, index) => (
              <div
                key={section.id}
                className="w-2 h-2 bg-primary/60 rounded-full"
                title={section.displayName}
              />
            ))}
            {visibleSections.length > 3 && (
              <div className="w-2 h-2 bg-muted-foreground/40 rounded-full" title={`+${visibleSections.length - 3} mais`} />
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SectionToolbar;