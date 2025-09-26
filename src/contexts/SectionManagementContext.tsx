import React, { createContext, useContext, useState, useCallback } from 'react';
import { landingPageService } from '@/services/landingPageService';

export interface LandingSection {
  id: string;
  name: string;
  displayName: string;
  order: number;
  isVisible: boolean;
  component: string;
}

interface SectionManagementContextType {
  sections: LandingSection[];
  loading: boolean;
  updateSectionOrder: (sections: LandingSection[]) => Promise<void>;
  updateSectionName: (sectionId: string, newName: string) => Promise<void>;
  toggleSectionVisibility: (sectionId: string) => Promise<void>;
  refreshSections: () => Promise<void>;
}

const SectionManagementContext = createContext<SectionManagementContextType | undefined>(undefined);

const defaultSections: LandingSection[] = [
  { id: 'hero', name: 'hero', displayName: 'Seção Hero', order: 0, isVisible: true, component: 'HeroSection' },
  { id: 'modules', name: 'modules', displayName: 'Tour dos Módulos', order: 1, isVisible: true, component: 'ModuleTourSection' },
  { id: 'whatsapp', name: 'whatsapp', displayName: 'WhatsApp & Voz', order: 2, isVisible: true, component: 'WhatsAppVoiceSection' },
  { id: 'statement', name: 'statement', displayName: 'Importação de Extrato', order: 3, isVisible: true, component: 'StatementImportSection' },
  { id: 'automation', name: 'automation', displayName: 'Automação com IA', order: 4, isVisible: true, component: 'AutomationAISection' },
  { id: 'security', name: 'security', displayName: 'Segurança & Privacidade', order: 5, isVisible: true, component: 'SecurityPrivacySection' },
  { id: 'faq', name: 'faq', displayName: 'Perguntas Frequentes', order: 6, isVisible: true, component: 'FAQSection' },
  { id: 'cta', name: 'cta', displayName: 'Chamada para Ação', order: 7, isVisible: true, component: 'CtaSection' },
];

export const SectionManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sections, setSections] = useState<LandingSection[]>(defaultSections);
  const [loading, setLoading] = useState(false);

  const updateSectionOrder = useCallback(async (newSections: LandingSection[]) => {
    setLoading(true);
    try {
      // Update order in each section
      for (const section of newSections) {
        await landingPageService.updateConfig(section.name, {}, section.isVisible, section.order, section.displayName);
      }
      setSections(newSections);
    } catch (error) {
      console.error('Error updating section order:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSectionName = useCallback(async (sectionId: string, newName: string) => {
    setLoading(true);
    try {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        await landingPageService.updateConfig(section.name, {}, section.isVisible, section.order, newName);
        setSections(prev => 
          prev.map(s => s.id === sectionId ? { ...s, displayName: newName } : s)
        );
      }
    } catch (error) {
      console.error('Error updating section name:', error);
    } finally {
      setLoading(false);
    }
  }, [sections]);

  const toggleSectionVisibility = useCallback(async (sectionId: string) => {
    setLoading(true);
    try {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        const newVisibility = !section.isVisible;
        await landingPageService.updateConfig(section.name, {}, newVisibility, section.order, section.displayName);
        setSections(prev => 
          prev.map(s => s.id === sectionId ? { ...s, isVisible: newVisibility } : s)
        );
      }
    } catch (error) {
      console.error('Error toggling section visibility:', error);
    } finally {
      setLoading(false);
    }
  }, [sections]);

  const refreshSections = useCallback(async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from the database
      // For now, we'll use the default sections with any customizations
      setSections(defaultSections);
    } catch (error) {
      console.error('Error refreshing sections:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SectionManagementContext.Provider value={{
      sections,
      loading,
      updateSectionOrder,
      updateSectionName,
      toggleSectionVisibility,
      refreshSections
    }}>
      {children}
    </SectionManagementContext.Provider>
  );
};

export const useSectionManagement = () => {
  const context = useContext(SectionManagementContext);
  if (context === undefined) {
    throw new Error('useSectionManagement must be used within a SectionManagementProvider');
  }
  return context;
};