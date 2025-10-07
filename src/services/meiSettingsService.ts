import { supabase } from '@/integrations/supabase/client';
import type { MEISettings } from '@/types/mei';

export class MEISettingsService {
  static async getSettings(): Promise<MEISettings | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mei_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting MEI settings:', error);
      return null;
    }
  }

  static async createDefaultSettings(): Promise<MEISettings> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mei_settings')
        .insert({
          user_id: user.id,
          tax_reserve_percentage: 6,
          annual_limit: 81000
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating MEI settings:', error);
      throw error;
    }
  }

  static async updateSettings(updates: Partial<Omit<MEISettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<MEISettings> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('mei_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating MEI settings:', error);
      throw error;
    }
  }

  static async getOrCreateSettings(): Promise<MEISettings> {
    const settings = await this.getSettings();
    if (settings) return settings;
    return await this.createDefaultSettings();
  }
}
