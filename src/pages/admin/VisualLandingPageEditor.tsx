import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw, Save, Undo2, Redo2, Settings, Globe } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { toast } from "sonner";
import ViewportControls from '@/components/admin/inline-editor/ViewportControls';

// Import original landing page components
import { LandingPageProvider } from '@/contexts/LandingPageContext';
import HeroSection from '@/components/landing/HeroSection';
import ModuleTourSection from '@/components/landing/ModuleTourSection';
import WhatsAppVoiceSection from '@/components/landing/WhatsAppVoiceSection';
import StatementImportSection from '@/components/landing/StatementImportSection';
import AutomationAISection from '@/components/landing/AutomationAISection';
import SecurityPrivacySection from '@/components/landing/SecurityPrivacySection';
import FAQSection from '@/components/landing/FAQSection';
import CtaSection from '@/components/landing/CtaSection';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface EditorState {
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

const VisualLandingPageEditor: React.FC = () => {
  const { configs, loading, refreshConfigs } = useLandingPage();
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editorState, setEditorState] = useState<EditorState>({
    isDirty: false,
    isSaving: false,
    lastSaved: null
  });

  // Auto-save indicator
  useEffect(() => {
    if (editorState.isDirty && !editorState.isSaving) {
      const timer = setTimeout(() => {
        setEditorState(prev => ({ ...prev, isDirty: false, lastSaved: new Date() }));
        toast("Alterações salvas automaticamente", { duration: 2000 });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [editorState.isDirty, editorState.isSaving]);

  const handleConfigChange = () => {
    setEditorState(prev => ({ ...prev, isDirty: true }));
  };

  const handlePublish = async () => {
    setEditorState(prev => ({ ...prev, isSaving: true }));
    try {
      // Simulate publish action - in real app this would move draft to published
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast("Landing page publicada com sucesso!");
      setEditorState(prev => ({ ...prev, isDirty: false, isSaving: false, lastSaved: new Date() }));
    } catch (error) {
      toast("Erro ao publicar. Tente novamente.");
      setEditorState(prev => ({ ...prev, isSaving: false }));
    }
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

  const getViewportStyles = () => {
    switch (viewportSize) {
      case 'mobile':
        return { width: '375px', minHeight: '100vh' };
      case 'tablet':
        return { width: '768px', minHeight: '100vh' };
      default:
        return { width: '100%', minHeight: '100vh' };
    }
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
      {/* Fixed Top Toolbar */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left side - Viewport Controls */}
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Editor Visual</h1>
            <div className="h-6 w-px bg-border" />
            <ViewportControls
              currentViewport={viewportSize}
              onViewportChange={setViewportSize}
            />
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Status indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {editorState.isDirty && (
                <span className="text-orange-600">● Salvando...</span>
              )}
              {editorState.lastSaved && !editorState.isDirty && (
                <span className="text-green-600">✓ Salvo {editorState.lastSaved.toLocaleTimeString()}</span>
              )}
            </div>

            <div className="h-6 w-px bg-border" />

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

            <div className="h-6 w-px bg-border" />

            <Button 
              size="sm" 
              onClick={handlePublish}
              disabled={editorState.isSaving}
              className="bg-primary hover:bg-primary/90"
            >
              <Globe className="w-4 h-4 mr-2" />
              {editorState.isSaving ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Preview Area */}
      <main className="flex-1 overflow-auto bg-gray-100">
        <div className="min-h-full flex justify-center p-6">
          <div 
            className="bg-white shadow-xl transition-all duration-300"
            style={getViewportStyles()}
          >
            <LandingPageProvider>
              <div className="min-h-full">
                <HeroSection editMode />
                <ModuleTourSection editMode />
                <WhatsAppVoiceSection />
                <StatementImportSection />
                <AutomationAISection />
                <SecurityPrivacySection />
                <FAQSection editMode />
                <CtaSection />
              </div>
            </LandingPageProvider>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VisualLandingPageEditor;