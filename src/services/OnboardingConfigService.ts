import { supabase } from '@/integrations/supabase/client';

export interface OnboardingConfig {
  id: string;
  section_key: string;
  content: any;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export class OnboardingConfigService {
  // Get configuration by section key
  static async getConfig(sectionKey: string): Promise<OnboardingConfig | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_config')
        .select('*')
        .eq('section_key', sectionKey)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting onboarding config:', error);
      return null;
    }
  }

  // Get all configurations
  static async getAllConfigs(): Promise<OnboardingConfig[]> {
    try {
      const { data, error } = await supabase
        .from('onboarding_config')
        .select('*')
        .order('section_key');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting all onboarding configs:', error);
      return [];
    }
  }

  // Update configuration
  static async updateConfig(sectionKey: string, updates: Partial<OnboardingConfig>): Promise<OnboardingConfig | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding_config')
        .upsert({
          section_key: sectionKey,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating onboarding config:', error);
      return null;
    }
  }

  // Update visibility
  static async updateVisibility(sectionKey: string, isVisible: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('onboarding_config')
        .update({ 
          is_visible: isVisible,
          updated_at: new Date().toISOString()
        })
        .eq('section_key', sectionKey);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating visibility:', error);
      return false;
    }
  }

  // Get welcome modal config
  static async getWelcomeModalConfig() {
    const config = await this.getConfig('welcome_modal');
    return config?.content || {
      title: "Bem-vindo ao Sobrou 👋",
      subtitle: "Este onboarding pode ser configurado no Admin. Em 1 minuto você deixa tudo pronto.",
      image: "",
      enabled: false, // Default disabled
      cta_start: "Começar",
      cta_close: "Fechar",
      show_admin_button: true
    };
  }

  // Get stepper config
  static async getStepperConfig() {
    const config = await this.getConfig('get_started_stepper');
    return config?.content || {
      title: "Primeiros Passos",
      enabled: false, // Default disabled
      show_progress: true,
      show_minimize: true,
      completion_message: "Parabéns! Você concluiu todos os passos.",
      colors: {
        primary: "#10b981",
        background: "#ffffff",
        text: "#374151"
      }
    };
  }

  // Get general settings
  static async getGeneralSettings() {
    const config = await this.getConfig('general_settings');
    return config?.content || {
      auto_show_welcome: false, // Default disabled
      auto_complete_steps: true,
      show_completion_celebration: true,
      reset_on_new_users: false
    };
  }

  // Check if stepper is enabled
  static async isStepperEnabled(): Promise<boolean> {
    try {
      const config = await this.getConfig('get_started_stepper');
      return config?.content?.enabled === true && config?.is_visible === true;
    } catch (error) {
      console.error('Error checking if stepper is enabled:', error);
      return false;
    }
  }

  // Enable stepper
  static async enableStepper(): Promise<boolean> {
    try {
      const config = await this.getConfig('get_started_stepper');
      const content = config?.content || {};
      
      await this.updateConfig('get_started_stepper', {
        content: { ...content, enabled: true },
        is_visible: true
      });
      
      return true;
    } catch (error) {
      console.error('Error enabling stepper:', error);
      return false;
    }
  }

  // Disable stepper
  static async disableStepper(): Promise<boolean> {
    try {
      const config = await this.getConfig('get_started_stepper');
      const content = config?.content || {};
      
      await this.updateConfig('get_started_stepper', {
        content: { ...content, enabled: false },
        is_visible: false
      });
      
      return true;
    } catch (error) {
      console.error('Error disabling stepper:', error);
      return false;
    }
  }
}