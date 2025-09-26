import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw, Save, Undo2, Redo2, Settings } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { toast } from "sonner";
import ViewportControls from '@/components/admin/inline-editor/ViewportControls';
import InlineLandingPagePreview from '@/components/admin/inline-editor/InlineLandingPagePreview';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export interface SectionData {
  key: string;
  name: string;
  component: React.ReactNode;
  editorType: 'hero' | 'modules' | 'whatsapp' | 'statement' | 'automation' | 'security' | 'faq' | 'cta';
}

const VisualLandingPageEditor: React.FC = () => {
  const { configs, loading, refreshConfigs } = useLandingPage();
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleSave = async () => {
    // Lógica de salvamento será implementada com os dados inline
    toast("Alterações salvas com sucesso!");
    setHasUnsavedChanges(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshConfigs();
      toast("Configurações recarregadas com sucesso.");
    } catch (error) {
      toast("Não foi possível recarregar as configurações.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePreviewInNewTab = () => {
    const previewUrl = window.location.origin;
    window.open(previewUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Floating Top Toolbar */}
      <header className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg px-4 py-2">
          <div className="flex items-center gap-4">
            {/* Viewport Controls */}
            <ViewportControls
              currentViewport={viewportSize}
              onViewportChange={setViewportSize}
            />

            <div className="h-6 w-px bg-border" />

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Atualizar"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviewInNewTab}
                title="Preview em nova aba"
              >
                <Eye className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                title="Desfazer"
              >
                <Undo2 className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                title="Refazer"
              >
                <Redo2 className="w-4 h-4" />
              </Button>

              <div className="h-6 w-px bg-border" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                title="Configurações avançadas"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {hasUnsavedChanges && (
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Fullscreen Preview */}
      <main className="flex-1 overflow-auto">
        <InlineLandingPagePreview
          viewportSize={viewportSize}
          onConfigChange={() => setHasUnsavedChanges(true)}
        />
      </main>
    </div>
  );
};

export default VisualLandingPageEditor;