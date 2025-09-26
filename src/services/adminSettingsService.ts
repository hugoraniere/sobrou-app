import { supabase } from '@/integrations/supabase/client';

export interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export class AdminSettingsService {
  static async getSetting(key: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', key)
        .single();

      if (error) throw error;
      return data?.setting_value;
    } catch (error) {
      console.error('Error getting admin setting:', error);
      return null;
    }
  }

  static async updateSetting(key: string, value: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: key,
          setting_value: value
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating admin setting:', error);
      throw error;
    }
  }

  static async getAllSettings(): Promise<AdminSetting[]> {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('setting_key');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting all admin settings:', error);
      return [];
    }
  }
}