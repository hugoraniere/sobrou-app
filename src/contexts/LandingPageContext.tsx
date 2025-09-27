import React, { createContext, useContext, useEffect, useState } from 'react';
import { landingPageService, LandingPageConfig } from '@/services/landingPageService';

interface LandingPageContextType {
  configs: LandingPageConfig[];
  loading: boolean;
  getConfig: (sectionKey: string) => LandingPageConfig | null;
  updateConfig: (sectionKey: string, content: any, isVisible?: boolean) => Promise<boolean>;
  refreshConfigs: () => Promise<void>;
  uploadImage: (file: File, section: string) => Promise<string | null>;
}

const LandingPageContext = createContext<LandingPageContextType | undefined>(undefined);

export function LandingPageProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<LandingPageConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const allConfigs = await landingPageService.getAllConfigs();
      setConfigs(allConfigs);
    } catch (error) {
      console.error('Error loading landing page configs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const getConfig = (sectionKey: string): LandingPageConfig | null => {
    const config = configs.find(config => config.section_key === sectionKey) || null;
    console.log(`[LandingPageContext] Getting config for ${sectionKey}:`, { config, totalConfigs: configs.length });
    return config;
  };

  const updateConfig = async (sectionKey: string, content: any, isVisible?: boolean): Promise<boolean> => {
    const success = await landingPageService.updateConfig(sectionKey, content, isVisible);
    if (success) {
      await refreshConfigs();
    }
    return success;
  };

  const refreshConfigs = async (): Promise<void> => {
    landingPageService.clearCache();
    await loadConfigs();
  };

  const uploadImage = async (file: File, section: string): Promise<string | null> => {
    return await landingPageService.uploadImage(file, section);
  };

  const value: LandingPageContextType = {
    configs,
    loading,
    getConfig,
    updateConfig,
    refreshConfigs,
    uploadImage,
  };

  return (
    <LandingPageContext.Provider value={value}>
      {children}
    </LandingPageContext.Provider>
  );
}

export function useLandingPage() {
  const context = useContext(LandingPageContext);
  if (context === undefined) {
    throw new Error('useLandingPage must be used within a LandingPageProvider');
  }
  return context;
}