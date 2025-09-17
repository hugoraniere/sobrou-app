import { supabase } from '@/integrations/supabase/client';
import { ProductTourStep } from '@/types/product-tour';

export interface ProductTourAdminConfig {
  enabled: boolean;
  auto_start_for_new_users: boolean;
  version: string;
  total_steps: number;
  show_progress: boolean;
  allow_skip: boolean;
  visibility_rules: {
    show_on: 'first_access' | 'until_completion' | 'never_show_again';
    target_users: 'all' | 'new_users' | 'existing_users';
  };
  colors: {
    primary: string;
    background: string;
    text: string;
    overlay: string;
  };
}

export class ProductTourAdminService {
  // Configuration methods
  static async getConfig(): Promise<ProductTourAdminConfig> {
    try {
      const { data, error } = await supabase
        .from('tour_settings')
        .select('*')
        .eq('setting_key', 'general_config')
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return this.getDefaultConfig();
      }

      return data.setting_value as ProductTourAdminConfig;
    } catch (error) {
      console.error('Error getting tour config:', error);
      return this.getDefaultConfig();
    }
  }

  static async updateConfig(config: ProductTourAdminConfig): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tour_settings')
        .upsert({
          setting_key: 'general_config',
          setting_value: config,
          is_active: true
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating tour config:', error);
      return false;
    }
  }

  private static getDefaultConfig(): ProductTourAdminConfig {
    return {
      enabled: true,
      auto_start_for_new_users: true,
      version: '1.0',
      total_steps: 0,
      show_progress: true,
      allow_skip: true,
      visibility_rules: {
        show_on: 'first_access',
        target_users: 'new_users'
      },
      colors: {
        primary: '#10b981',
        background: '#ffffff',
        text: '#374151',
        overlay: 'rgba(0, 0, 0, 0.5)'
      }
    };
  }

  // Steps management
  static async getSteps(): Promise<ProductTourStep[]> {
    try {
      const { data, error } = await supabase
        .from('product_tour_steps')
        .select('*')
        .order('step_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting tour steps:', error);
      return [];
    }
  }

  static async createStep(step: Partial<ProductTourStep>): Promise<ProductTourStep | null> {
    try {
      const { data, error } = await supabase
        .from('product_tour_steps')
        .insert(step)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating tour step:', error);
      return null;
    }
  }

  static async updateStep(id: string, updates: Partial<ProductTourStep>): Promise<ProductTourStep | null> {
    try {
      const { data, error } = await supabase
        .from('product_tour_steps')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating tour step:', error);
      return null;
    }
  }

  static async deleteStep(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('product_tour_steps')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting tour step:', error);
      return false;
    }
  }

  static async reorderSteps(stepIds: string[]): Promise<boolean> {
    try {
      const promises = stepIds.map((id, index) =>
        supabase
          .from('product_tour_steps')
          .update({ step_order: index })
          .eq('id', id)
      );

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error reordering steps:', error);
      return false;
    }
  }

  // Group steps by page
  static groupStepsByPage(steps: ProductTourStep[]): Record<string, ProductTourStep[]> {
    return steps.reduce((groups, step) => {
      const page = step.page_route || 'default';
      if (!groups[page]) {
        groups[page] = [];
      }
      groups[page].push(step);
      return groups;
    }, {} as Record<string, ProductTourStep[]>);
  }
}