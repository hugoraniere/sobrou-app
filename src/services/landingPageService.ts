import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LandingPageConfig {
  id: string;
  section_key: string;
  content: any;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  cta_text: string;
  cta_url: string;
  background_image: string;
  benefits: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface ModuleConfig {
  icon: string;
  title: string;
  description: string;
  image: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

class LandingPageService {
  private cache: Map<string, LandingPageConfig> = new Map();
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getConfig(sectionKey: string): Promise<LandingPageConfig | null> {
    // Check cache first
    const cachedConfig = this.cache.get(sectionKey);
    const now = Date.now();
    
    if (cachedConfig && (now - this.lastFetch) < this.CACHE_DURATION) {
      return cachedConfig;
    }

    try {
      const { data, error } = await supabase
        .from('landing_page_config')
        .select('*')
        .eq('section_key', sectionKey)
        .single();

      if (error) {
        console.error('Error fetching landing page config:', error);
        return null;
      }

      if (data) {
        this.cache.set(sectionKey, data);
        this.lastFetch = now;
      }

      return data;
    } catch (error) {
      console.error('Error in getConfig:', error);
      return null;
    }
  }

  async getAllConfigs(): Promise<LandingPageConfig[]> {
    try {
      const { data, error } = await supabase
        .from('landing_page_config')
        .select('*')
        .order('section_key');

      if (error) {
        console.error('Error fetching all landing page configs:', error);
        return [];
      }

      // Update cache
      if (data) {
        this.lastFetch = Date.now();
        data.forEach(config => {
          this.cache.set(config.section_key, config);
        });
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllConfigs:', error);
      return [];
    }
  }

  async updateConfig(sectionKey: string, content: any, isVisible?: boolean): Promise<boolean> {
    try {
      const updateData: any = { content };
      if (isVisible !== undefined) {
        updateData.is_visible = isVisible;
      }

      const { error } = await supabase
        .from('landing_page_config')
        .update(updateData)
        .eq('section_key', sectionKey);

      if (error) {
        console.error('Error updating landing page config:', error);
        toast("Não foi possível salvar as alterações. Tente novamente.");
        return false;
      }

      // Clear cache to force refetch
      this.cache.delete(sectionKey);
      
      toast("As alterações foram salvas.");
      
      return true;
    } catch (error) {
      console.error('Error in updateConfig:', error);
        toast("Ocorreu um erro inesperado. Tente novamente.");
      return false;
    }
  }

  async uploadImage(file: File, section: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${section}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('landing-page')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast("Não foi possível fazer upload da imagem.");
        return null;
      }

      const { data: publicUrl } = supabase.storage
        .from('landing-page')
        .getPublicUrl(filePath);

      return publicUrl.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      toast("Ocorreu um erro inesperado no upload.");
      return null;
    }
  }

  clearCache(): void {
    this.cache.clear();
    this.lastFetch = 0;
  }

  // Typed getters for specific sections
  async getHeroConfig(): Promise<HeroConfig | null> {
    const config = await this.getConfig('hero');
    return config?.content as HeroConfig | null;
  }

  async getModulesConfig(): Promise<{ title: string; subtitle: string; modules: ModuleConfig[] } | null> {
    const config = await this.getConfig('modules');
    return config?.content as { title: string; subtitle: string; modules: ModuleConfig[] } | null;
  }

  async getFAQConfig(): Promise<{ title: string; subtitle: string; questions: FAQItem[] } | null> {
    const config = await this.getConfig('faq');
    return config?.content as { title: string; subtitle: string; questions: FAQItem[] } | null;
  }
}

export const landingPageService = new LandingPageService();