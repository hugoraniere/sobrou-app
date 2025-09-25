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
      auto_show_welcome: true,
      auto_complete_steps: true,
      show_completion_celebration: true,
      reset_on_new_users: false
    };
  }

  // Get Get Started config
  static async getGetStartedConfig() {
    const config = await this.getConfig('get_started_config');
    return config?.content || {
      title: 'Get Started',
      subtitle: 'Complete estas tarefas para aproveitar melhor o Sobrou',
      is_enabled: true,
      show_progress_bar: true,
      show_minimize_button: true,
      completion_message: 'Parabéns! Você concluiu todos os passos.'
    };
  }

  // Update Get Started config
  static async updateGetStartedConfig(config: any) {
    return await this.updateConfig('get_started_config', { content: config });
  }

  // Get Get Started tasks
  static async getGetStartedTasks() {
    const config = await this.getConfig('get_started_tasks');
    return config?.content || [
      {
        id: 'task_1',
        title: 'Adicionar primeira transação',
        description: 'Registre sua primeira movimentação financeira',
        cta_text: 'Ir agora',
        cta_url: '/transactions',
        cta_enabled: true,
        completion_event: 'transaction_created',
        sort_order: 0,
        is_active: true
      },
      {
        id: 'task_2',
        title: 'Criar lista de compras',
        description: 'Organize suas compras com uma lista',
        cta_text: 'Criar lista',
        cta_url: '/shopping-lists',
        cta_enabled: true,
        completion_event: 'shopping_list_created',
        sort_order: 1,
        is_active: true
      }
    ];
  }

  // Update Get Started tasks
  static async updateGetStartedTasks(tasks: any[]) {
    return await this.updateConfig('get_started_tasks', { content: tasks });
  }
}