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

  async getConfig(sectionKey: string, forceRefresh: boolean = false): Promise<LandingPageConfig | null> {
    // Check cache first (skip if force refresh)
    const cachedConfig = this.cache.get(sectionKey);
    const now = Date.now();
    
    if (!forceRefresh && cachedConfig && (now - this.lastFetch) < this.CACHE_DURATION) {
      console.log(`[LandingPageService] Using cached config for ${sectionKey}`, { cachedConfig });
      return cachedConfig;
    }

    try {
      console.log(`[LandingPageService] Fetching fresh config for ${sectionKey}, forceRefresh: ${forceRefresh}`);
      
      // Add timestamp to force cache busting
      const timestamp = Date.now();
      const { data, error } = await supabase
        .from('landing_page_config')
        .select('*')
        .eq('section_key', sectionKey)
        .limit(1)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching landing page config:', error);
        return null;
      }

      const config = data?.[0] || null;
      console.log(`[LandingPageService] Fetched config for ${sectionKey}:`, { config });

      if (config) {
        this.cache.set(sectionKey, config);
        this.lastFetch = now;
      }

      return config;
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

  async updateConfig(sectionKey: string, content: any, isVisible?: boolean, order?: number, displayName?: string): Promise<boolean> {
    try {
      const updateData: any = {
        content,
        updated_at: new Date().toISOString()
      };

      if (isVisible !== undefined) {
        updateData.is_visible = isVisible;
      }

      if (order !== undefined) {
        updateData.section_order = order;
      }

      if (displayName !== undefined) {
        updateData.display_name = displayName;
      }

      // Try to update first
      const { data: updateResult, error: updateError } = await supabase
        .from('landing_page_config')
        .update(updateData)
        .eq('section_key', sectionKey)
        .select();

      // If no rows were updated, insert new record (upsert behavior)
      if (!updateError && (!updateResult || updateResult.length === 0)) {
        const { error: insertError } = await supabase
          .from('landing_page_config')
          .insert({
            section_key: sectionKey,
            content,
            is_visible: isVisible !== undefined ? isVisible : true
          });

        if (insertError) {
          console.error('Error inserting landing page config:', insertError);
          toast("Não foi possível salvar as alterações. Tente novamente.");
          return false;
        }
      } else if (updateError) {
        console.error('Error updating landing page config:', updateError);
        toast("Não foi possível salvar as alterações. Tente novamente.");
        return false;
      }

      // Clear cache to force refetch
      this.cache.delete(sectionKey);
      
      return true;
    } catch (error) {
      console.error('Error in updateConfig:', error);
      toast("Ocorreu um erro inesperado. Tente novamente.");
      return false;
    }
  }

  async uploadImage(file: File, section: string): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucketName', 'landing-page');
      formData.append('uploadSource', `landing-page-${section}`);
      formData.append('category', section);
      formData.append('altText', `${section} image`);
      formData.append('tags', JSON.stringify([section, 'landing-page']));

      const { data, error } = await supabase.functions.invoke('optimize-image', {
        body: formData
      });

      if (error) {
        console.error('Error in optimize-image function:', error);
        toast("Não foi possível fazer upload da imagem.");
        return null;
      }

      if (!data.success) {
        console.error('Optimization failed:', data.error);
        toast(data.error || "Erro ao processar imagem.");
        return null;
      }

      return data.data.publicUrl;
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