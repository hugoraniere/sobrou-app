import { supabase } from '@/integrations/supabase/client';

export interface ModalInformativoConfig {
  id: string;
  name: string;
  is_active: boolean;
  auto_transition: boolean;
  transition_time: number;
  show_indicators: boolean;
  show_navigation: boolean;
  visibility_rules: {
    show_on: string;
    target_users: string;
  };
  colors: {
    text: string;
    primary: string;
    background: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ModalInformativoSlide {
  id: string;
  modal_id: string;
  slide_order: number;
  is_active: boolean;
  title: string;
  subtitle?: string;
  description?: string;
  cta_text?: string;
  cta_url?: string;
  media_url?: string;
  media_type?: string;
  created_at: string;
  updated_at: string;
}

export class ModalInformativoService {
  // Get modal configuration
  static async getConfig(): Promise<ModalInformativoConfig | null> {
    try {
      const { data, error } = await supabase
        .from('modal_informativo_config')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;
      
      // Cast database types to our interface
      return {
        ...data,
        visibility_rules: data.visibility_rules as { show_on: string; target_users: string },
        colors: data.colors as { text: string; primary: string; background: string }
      };
    } catch (error) {
      console.error('Error getting modal config:', error);
      return null;
    }
  }

  // Get or create default config
  static async getOrCreateConfig(): Promise<ModalInformativoConfig> {
    const existing = await this.getConfig();
    if (existing) return existing;

    // Create default config
    return this.createConfig({
      name: 'Modal Informativo',
      is_active: false, // Default disabled
      auto_transition: false,
      transition_time: 5000,
      show_indicators: true,
      show_navigation: true,
      visibility_rules: {
        show_on: 'first_access',
        target_users: 'all'
      },
      colors: {
        text: '#374151',
        primary: '#10b981',
        background: '#ffffff'
      }
    });
  }

  // Create new modal config
  static async createConfig(config: Partial<ModalInformativoConfig>): Promise<ModalInformativoConfig> {
    try {
      const { data, error } = await supabase
        .from('modal_informativo_config')
        .insert({
          name: config.name || 'Modal Informativo',
          is_active: config.is_active ?? false,
          auto_transition: config.auto_transition ?? false,
          transition_time: config.transition_time ?? 5000,
          show_indicators: config.show_indicators ?? true,
          show_navigation: config.show_navigation ?? true,
          visibility_rules: config.visibility_rules ?? {
            show_on: 'first_access',
            target_users: 'all'
          },
          colors: config.colors ?? {
            text: '#374151',
            primary: '#10b981',
            background: '#ffffff'
          }
        })
        .select()
        .single();

      if (error) throw error;
      
      // Cast database types to our interface
      return {
        ...data,
        visibility_rules: data.visibility_rules as { show_on: string; target_users: string },
        colors: data.colors as { text: string; primary: string; background: string }
      };
    } catch (error) {
      console.error('Error creating modal config:', error);
      throw error;
    }
  }

  // Update modal configuration
  static async updateConfig(idOrUpdates: string | Partial<ModalInformativoConfig>, updates?: Partial<ModalInformativoConfig>): Promise<ModalInformativoConfig | null> {
    try {
      let finalUpdates: Partial<ModalInformativoConfig>;
      let targetId: string | undefined;

      if (typeof idOrUpdates === 'string') {
        // Called with (id, updates)
        targetId = idOrUpdates;
        finalUpdates = updates || {};
      } else {
        // Called with (updates)
        finalUpdates = idOrUpdates;
        const existing = await this.getConfig();
        if (!existing) {
          return this.createConfig(finalUpdates);
        }
        targetId = existing.id;
      }

      const { data, error } = await supabase
        .from('modal_informativo_config')
        .update({
          ...finalUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetId)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        visibility_rules: data.visibility_rules as { show_on: string; target_users: string },
        colors: data.colors as { text: string; primary: string; background: string }
      };
    } catch (error) {
      console.error('Error updating modal config:', error);
      return null;
    }
  }

  // Check if modal is enabled
  static async isEnabled(): Promise<boolean> {
    try {
      const config = await this.getConfig();
      return config?.is_active === true;
    } catch (error) {
      console.error('Error checking if modal is enabled:', error);
      return false;
    }
  }

  // Enable modal globally
  static async enable(): Promise<boolean> {
    try {
      await this.updateConfig({ is_active: true });
      return true;
    } catch (error) {
      console.error('Error enabling modal:', error);
      return false;
    }
  }

  // Disable modal globally
  static async disable(): Promise<boolean> {
    try {
      await this.updateConfig({ is_active: false });
      return true;
    } catch (error) {
      console.error('Error disabling modal:', error);
      return false;
    }
  }

  // Get all configurations (alias for compatibility)
  static async getConfigs(): Promise<ModalInformativoConfig[]> {
    const config = await this.getConfig();
    return config ? [config] : [];
  }

  // Delete configuration
  static async deleteConfig(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('modal_informativo_config')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting modal config:', error);
      return false;
    }
  }

  // Slide management methods
  static async getSlides(modalId?: string): Promise<ModalInformativoSlide[]> {
    try {
      let query = supabase
        .from('modal_informativo_slides')
        .select('*')
        .order('slide_order');

      if (modalId) {
        query = query.eq('modal_id', modalId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting modal slides:', error);
      return [];
    }
  }

  static async createSlide(slide: Partial<ModalInformativoSlide>): Promise<ModalInformativoSlide | null> {
    try {
      const { data, error } = await supabase
        .from('modal_informativo_slides')
        .insert({
          modal_id: slide.modal_id || '',
          slide_order: slide.slide_order || 0,
          is_active: slide.is_active ?? true,
          title: slide.title || 'Novo Slide',
          subtitle: slide.subtitle,
          description: slide.description,
          cta_text: slide.cta_text,
          cta_url: slide.cta_url,
          media_url: slide.media_url,
          media_type: slide.media_type || 'image'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating modal slide:', error);
      return null;
    }
  }

  static async updateSlide(id: string, updates: Partial<ModalInformativoSlide>): Promise<ModalInformativoSlide | null> {
    try {
      const { data, error } = await supabase
        .from('modal_informativo_slides')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating modal slide:', error);
      return null;
    }
  }

  static async deleteSlide(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('modal_informativo_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting modal slide:', error);
      return false;
    }
  }

  static async reorderSlides(modalIdOrSlideIds: string, slideIds?: string[]): Promise<boolean> {
    try {
      const ids = slideIds || (Array.isArray(modalIdOrSlideIds) ? modalIdOrSlideIds : []);
      
      const promises = ids.map((id, index) =>
        supabase
          .from('modal_informativo_slides')
          .update({ slide_order: index })
          .eq('id', id)
      );

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error reordering slides:', error);
      return false;
    }
  }
}