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
    show_on: 'first_access' | 'until_completion' | 'always';
    target_users: 'all' | 'new_users' | 'existing_users';
  };
  colors: {
    primary: string;
    background: string;
    text: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ModalInformativoSlide {
  id: string;
  modal_id: string;
  slide_order: number;
  title: string;
  subtitle?: string;
  description?: string;
  cta_text?: string;
  cta_url?: string;
  media_url?: string;
  media_type: 'image' | 'video' | 'gif';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class ModalInformativoService {
  // Config methods
  static async getConfigs(): Promise<ModalInformativoConfig[]> {
    try {
      const { data, error } = await supabase
        .from('modal_informativo_config')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        visibility_rules: item.visibility_rules as any,
        colors: item.colors as any
      }));
    } catch (error) {
      console.error('Error getting modal configs:', error);
      return [];
    }
  }

  static async createConfig(config: Partial<ModalInformativoConfig>): Promise<ModalInformativoConfig | null> {
    try {
      const { data, error } = await supabase
        .from('modal_informativo_config')
        .insert({
          name: config.name || 'Novo Modal',
          ...config
        })
        .select()
        .single();

      if (error) throw error;
      return data ? {
        ...data,
        visibility_rules: data.visibility_rules as any,
        colors: data.colors as any
      } : null;
    } catch (error) {
      console.error('Error creating modal config:', error);
      return null;
    }
  }

  static async updateConfig(id: string, updates: Partial<ModalInformativoConfig>): Promise<ModalInformativoConfig | null> {
    try {
      const { data, error } = await supabase
        .from('modal_informativo_config')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? {
        ...data,
        visibility_rules: data.visibility_rules as any,
        colors: data.colors as any
      } : null;
    } catch (error) {
      console.error('Error updating modal config:', error);
      return null;
    }
  }

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

  // Slide methods
  static async getSlides(modalId: string): Promise<ModalInformativoSlide[]> {
    try {
      const { data, error } = await supabase
        .from('modal_informativo_slides')
        .select('*')
        .eq('modal_id', modalId)
        .order('slide_order');

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        media_type: item.media_type as 'image' | 'video' | 'gif'
      }));
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
          title: slide.title || 'Novo Slide',
          ...slide
        })
        .select()
        .single();

      if (error) throw error;
      return data ? {
        ...data,
        media_type: data.media_type as 'image' | 'video' | 'gif'
      } : null;
    } catch (error) {
      console.error('Error creating modal slide:', error);
      return null;
    }
  }

  static async updateSlide(id: string, updates: Partial<ModalInformativoSlide>): Promise<ModalInformativoSlide | null> {
    try {
      const { data, error } = await supabase
        .from('modal_informativo_slides')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? {
        ...data,
        media_type: data.media_type as 'image' | 'video' | 'gif'
      } : null;
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

  static async reorderSlides(modalId: string, slideIds: string[]): Promise<boolean> {
    try {
      const promises = slideIds.map((id, index) =>
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

  // Active modal
  static async getActiveModal(): Promise<{ config: ModalInformativoConfig; slides: ModalInformativoSlide[] } | null> {
    try {
      const { data: config, error: configError } = await supabase
        .from('modal_informativo_config')
        .select('*')
        .eq('is_active', true)
        .single();

      if (configError || !config) return null;

      const slides = await this.getSlides(config.id);
      
      return { 
        config: {
          ...config,
          visibility_rules: config.visibility_rules as any,
          colors: config.colors as any
        }, 
        slides: slides.filter(s => s.is_active) 
      };
    } catch (error) {
      console.error('Error getting active modal:', error);
      return null;
    }
  }
}