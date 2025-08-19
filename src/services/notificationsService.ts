import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  type: 'bill_due' | 'spending_alert' | 'goal' | 'system';
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
  metadata: Record<string, any>;
  source_id: string | null;
  source_table: string | null;
  day_bucket: string;
}

export interface NotificationSettings {
  spending_alerts: boolean;
  goal_achieved: boolean;
  auto_suggestions: boolean;
  bill_due: boolean;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  due_date: string;
  is_paid: boolean;
}

class NotificationsService {
  async listNotifications({ read, limit = 50 }: { read?: boolean; limit?: number } = {}) {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (read !== undefined) {
      if (read) {
        query = query.not('read_at', 'is', null);
      } else {
        query = query.is('read_at', null);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Notification[];
  }

  async getUnreadCount(): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .is('read_at', null);

    if (error) throw error;
    return count || 0;
  }

  async markAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  async markAllAsRead() {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .is('read_at', null);

    if (error) throw error;
  }

  async createBillDueNotificationIfNeeded(bill: Bill) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'bill_due',
        title: 'Conta vencendo hoje',
        body: `A conta "${bill.title}" de R$ ${bill.amount.toFixed(2)} vence hoje.`,
        metadata: { amount: bill.amount },
        source_id: bill.id,
        source_table: 'bills_to_pay',
        day_bucket: today
      });

    // Ignore duplicate key errors (constraint unique_user_notification_per_day)
    if (error && !error.message.includes('duplicate key')) {
      throw error;
    }
  }

  async getPreferences(): Promise<NotificationSettings> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_preferences')
      .select('notification_settings')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const settings = data?.notification_settings;
    
    // Type guard to ensure we have the correct structure
    if (settings && typeof settings === 'object' && !Array.isArray(settings)) {
      const s = settings as Record<string, any>;
      if (typeof s.spending_alerts === 'boolean' && 
          typeof s.goal_achieved === 'boolean' && 
          typeof s.auto_suggestions === 'boolean' && 
          typeof s.bill_due === 'boolean') {
        return s as NotificationSettings;
      }
    }
    
    return {
      spending_alerts: true,
      goal_achieved: true,
      auto_suggestions: false,
      bill_due: true
    };
  }

  async updatePreferences(settings: Partial<NotificationSettings>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const currentPrefs = await this.getPreferences();
    const updatedSettings = { ...currentPrefs, ...settings };

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        notification_settings: updatedSettings
      });

    if (error) throw error;
  }
}

export const notificationsService = new NotificationsService();