import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Eye, RefreshCw, Save, Undo2, Redo2 } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { toast } from "sonner";
import LandingPagePreview from '@/components/admin/visual-landing/LandingPagePreview';
import SectionSelector from '@/components/admin/visual-landing/SectionSelector';
import ContextualEditor from '@/components/admin/visual-landing/ContextualEditor';
import PreviewToolbar from '@/components/admin/visual-landing/PreviewToolbar';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export interface SectionData {
  key: string;
  name: string;
  component: React.ReactNode;
  editorType: 'hero' | 'modules' | 'whatsapp' | 'statement' | 'automation' | 'security' | 'faq' | 'cta';
}

const VisualLandingPageEditor: React.FC = () => {
  const { configs, loading, refreshConfigs } = useLandingPage();
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const sections: SectionData[] = [
    { key: 'hero', name: 'Hero', component: null, editorType: 'hero' },
    { key: 'modules', name: 'Módulos', component: null, editorType: 'modules' },
    { key: 'whatsapp', name: 'WhatsApp', component: null, editorType: 'whatsapp' },
    { key: 'statement', name: 'Extratos', component: null, editorType: 'statement' },
    { key: 'automation', name: 'IA', component: null, editorType: 'automation' },
    { key: 'security', name: 'Segurança', component: null, editorType: 'security' },
    { key: 'faq', name: 'FAQ', component: null, editorType: 'faq' },
    { key: 'cta', name: 'CTA', component: null, editorType: 'cta' },
  ];

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Editor Visual da Landing Page</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviewInNewTab}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            {hasUnsavedChanges && (
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Salvar Mudanças
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Section Navigator */}
        <aside className="w-80 bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground mb-2">Seções</h2>
            <SectionSelector
              sections={sections}
              selectedSection={selectedSection}
              onSectionSelect={setSelectedSection}
            />
          </div>

          {/* Preview Toolbar */}
          <div className="p-4 border-b border-border">
            <PreviewToolbar
              viewportSize={viewportSize}
              onViewportChange={setViewportSize}
            />
          </div>
        </aside>

        {/* Center - Preview */}
        <main className="flex-1 bg-muted/30 overflow-auto">
          <div className="p-6 h-full">
            <LandingPagePreview
              selectedSection={selectedSection}
              onSectionSelect={setSelectedSection}
              viewportSize={viewportSize}
              sections={sections}
            />
          </div>
        </main>

        {/* Right Sidebar - Contextual Editor */}
        <aside className="w-96 bg-card border-l border-border overflow-auto">
          <div className="p-4">
            <ContextualEditor
              selectedSection={selectedSection}
              sections={sections}
              onConfigChange={() => setHasUnsavedChanges(true)}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default VisualLandingPageEditor;