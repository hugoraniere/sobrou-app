import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Target, Image, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';

interface ComponentSelectorProps {
  value: string;
  onChange: (anchorId: string) => void;
  className?: string;
}

interface DetectedComponent {
  id: string;
  element: HTMLElement;
  tagName: string;
  classes: string[];
  text: string;
  position: { x: number; y: number; width: number; height: number };
  thumbnail?: string;
  loadingThumbnail?: boolean;
}

export const ComponentSelector: React.FC<ComponentSelectorProps> = ({
  value,
  onChange,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [detectedComponents, setDetectedComponents] = useState<DetectedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string>(value);
  const [thumbnailCache, setThumbnailCache] = useState<Map<string, string>>(new Map());

  // Generate thumbnail for component with timeout
  const generateThumbnail = useCallback(async (element: HTMLElement): Promise<string | undefined> => {
    try {
      // Set a timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      const canvasPromise = html2canvas(element, {
        width: 200,
        height: 120,
        scale: 0.5,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const canvas = await Promise.race([canvasPromise, timeoutPromise]);
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.warn('Failed to generate thumbnail:', error);
      return undefined;
    }
  }, []);

  // Scan page for selectable components without thumbnails initially
  const scanComponents = useCallback(() => {
    try {
      const elements = document.querySelectorAll('[data-tour-id], [id], button, input, .card, .btn, [role="button"]');
      const components: DetectedComponent[] = [];

      for (const element of Array.from(elements)) {
        const htmlElement = element as HTMLElement;
        
        // Skip if element is not visible
        const rect = htmlElement.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        
        // Skip if element is in admin interface
        if (htmlElement.closest('[data-admin-interface]')) continue;

        const id = htmlElement.getAttribute('data-tour-id') || 
                   htmlElement.id || 
                   `${htmlElement.tagName.toLowerCase()}-${components.length}`;
        
        const classes = Array.from(htmlElement.classList);
        const text = htmlElement.textContent?.trim().substring(0, 50) || '';
        
        components.push({
          id,
          element: htmlElement,
          tagName: htmlElement.tagName.toLowerCase(),
          classes,
          text,
          position: {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
          },
          thumbnail: thumbnailCache.get(id),
          loadingThumbnail: false
        });
      }

      // Sort by priority: data-tour-id first, then id, then others
      components.sort((a, b) => {
        const aPriority = a.element.getAttribute('data-tour-id') ? 0 : a.element.id ? 1 : 2;
        const bPriority = b.element.getAttribute('data-tour-id') ? 0 : b.element.id ? 1 : 2;
        return aPriority - bPriority;
      });

      setDetectedComponents(components);
    } catch (error) {
      console.error('Error scanning components:', error);
    }
  }, [thumbnailCache]);

  // Load thumbnail on demand
  const loadThumbnailForComponent = useCallback(async (componentId: string) => {
    const component = detectedComponents.find(c => c.id === componentId);
    if (!component || component.thumbnail || component.loadingThumbnail) return;

    // Mark as loading
    setDetectedComponents(prev => 
      prev.map(c => c.id === componentId ? { ...c, loadingThumbnail: true } : c)
    );

    const thumbnail = await generateThumbnail(component.element);
    
    if (thumbnail) {
      setThumbnailCache(prev => new Map(prev).set(componentId, thumbnail));
      setDetectedComponents(prev => 
        prev.map(c => c.id === componentId ? { ...c, thumbnail, loadingThumbnail: false } : c)
      );
    } else {
      setDetectedComponents(prev => 
        prev.map(c => c.id === componentId ? { ...c, loadingThumbnail: false } : c)
      );
    }
  }, [detectedComponents, generateThumbnail]);

  // Filter components based on search
  const filteredComponents = detectedComponents.filter(component => 
    component.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Highlight component on hover
  const highlightComponent = (component: DetectedComponent) => {
    // Remove previous highlights
    document.querySelectorAll('.tour-component-highlight').forEach(el => {
      el.classList.remove('tour-component-highlight');
    });

    // Add highlight to current component
    component.element.classList.add('tour-component-highlight');
    
    // Scroll to component
    component.element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  };

  // Remove highlights
  const removeHighlight = () => {
    document.querySelectorAll('.tour-component-highlight').forEach(el => {
      el.classList.remove('tour-component-highlight');
    });
  };

  // Select component
  const selectComponent = (component: DetectedComponent) => {
    setSelectedComponent(component.id);
    onChange(component.id);
    removeHighlight();
  };

  useEffect(() => {
    // Scan components immediately when component mounts
    scanComponents();
    
    // Add CSS for highlighting
    const style = document.createElement('style');
    style.textContent = `
      .tour-component-highlight {
        outline: 2px solid hsl(var(--primary)) !important;
        outline-offset: 2px !important;
        background-color: hsl(var(--primary) / 0.1) !important;
        transition: all 0.2s ease !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
      removeHighlight();
    };
  }, [scanComponents]);

  return (
    <div className={cn("space-y-4", className)} data-admin-interface>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-4 h-4" />
            Seletor de Componentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Manual input */}
          <div className="space-y-2">
            <Label htmlFor="manual-id">ID do Elemento</Label>
            <Input
              id="manual-id"
              value={selectedComponent}
              onChange={(e) => {
                setSelectedComponent(e.target.value);
                onChange(e.target.value);
              }}
              placeholder="Insira o ID manualmente"
            />
          </div>

          {/* Components list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Componentes Disponíveis ({filteredComponents.length})</Label>
            </div>

            {/* Search components */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar componentes..."
                className="pl-10"
              />
            </div>

            {/* Components list */}
            <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2">
              {filteredComponents.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Nenhum componente encontrado
                </div>
              ) : (
                filteredComponents.map((component) => (
                  <Card
                    key={component.id}
                    className={cn(
                      "p-3 cursor-pointer transition-all hover:shadow-md",
                      selectedComponent === component.id && "ring-2 ring-primary"
                    )}
                    onClick={() => selectComponent(component)}
                    onMouseEnter={() => {
                      highlightComponent(component);
                      if (!component.thumbnail && !component.loadingThumbnail) {
                        loadThumbnailForComponent(component.id);
                      }
                    }}
                    onMouseLeave={removeHighlight}
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-16 h-12 border rounded overflow-hidden bg-muted">
                        {component.loadingThumbnail ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                          </div>
                        ) : component.thumbnail ? (
                          <img 
                            src={component.thumbnail} 
                            alt={`Preview of ${component.id}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {/* Component Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="font-mono text-sm font-medium">
                              {component.id}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {component.tagName}
                              </Badge>
                              {component.classes.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {component.classes.slice(0, 2).join(' ')}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {selectedComponent === component.id && (
                            <Target className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        {component.text && (
                          <div className="text-xs text-muted-foreground">
                            "{component.text}"
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};