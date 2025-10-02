import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw, Globe } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { toast } from "sonner";
import ViewportControls from '@/components/admin/inline-editor/ViewportControls';
import { EditorButton } from '@/components/ui/editor-button';
import StatusIndicator from '@/components/ui/status-indicator';
import { SectionManagementProvider } from '@/contexts/SectionManagementContext';
import SectionToolbar from '@/components/admin/section-toolbar/SectionToolbar';

// Import original landing page components
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

  // Auto-save silencioso (sem toast nem timers artificiais)
  useEffect(() => {
    if (editorState.isDirty && !editorState.isSaving) {
      const timer = setTimeout(() => {
        setEditorState(prev => ({ ...prev, isDirty: false, lastSaved: new Date() }));
      }, 800); // Salvamento mais rápido
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
        return { width: '390px', height: '844px', overflow: 'auto' };
      case 'tablet':
        return { width: '820px', height: '1180px', overflow: 'auto' };
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
    <SectionManagementProvider>
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
          <div className="flex items-center gap-3">
            {/* Status indicator discreto */}
            <StatusIndicator
              status={
                editorState.isDirty ? 'saving' : 
                editorState.lastSaved ? 'saved' : 'idle'
              }
              timestamp={editorState.lastSaved}
              size="sm"
            />

            <div className="h-5 w-px bg-border/60" />

            <EditorButton
              variant="ghost"
              size="icon-sm"
              onClick={handleRefresh}
              isLoading={isRefreshing}
              title="Atualizar configurações"
              icon={<RefreshCw className="w-4 h-4" />}
            />

            <EditorButton
              variant="ghost"
              size="icon-sm"
              onClick={handlePreviewInNewTab}
              title="Abrir preview em nova aba"
              icon={<Eye className="w-4 h-4" />}
            />

            <div className="h-5 w-px bg-border/60" />

            <EditorButton
              variant="primary"
              size="sm"
              onClick={handlePublish}
              isLoading={editorState.isSaving}
              icon={<Globe className="w-4 h-4" />}
            >
              {editorState.isSaving ? 'Publicando' : 'Publicar'}
            </EditorButton>
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
            <div className="min-h-full">
              <HeroSection editMode />
              <ModuleTourSection editMode />
              <WhatsAppVoiceSection editMode />
              <StatementImportSection editMode />
              <AutomationAISection editMode />
              <SecurityPrivacySection editMode />
              <FAQSection editMode />
              <CtaSection editMode />
            </div>
          </div>
        </div>
      </main>
      
      {/* Section Management Toolbar */}
      <SectionToolbar />
    </div>
  </SectionManagementProvider>
  );
};

export default VisualLandingPageEditor;