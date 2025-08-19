import { useState, useEffect } from 'react';
import { notificationsService, Notification, NotificationSettings } from '@/services/notificationsService';
import { isToday, isYesterday, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface GroupedNotifications {
  today: Notification[];
  yesterday: Notification[];
  older: { date: string; notifications: Notification[] }[];
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationSettings>({
    spending_alerts: true,
    goal_achieved: true,
    auto_suggestions: false,
    bill_due: true
  });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const [allNotifications, count, prefs] = await Promise.all([
        notificationsService.listNotifications(),
        notificationsService.getUnreadCount(),
        notificationsService.getPreferences()
      ]);
      
      setNotifications(allNotifications);
      setUnreadCount(count);
      setPreferences(prefs);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupNotificationsByDate = (notifications: Notification[]): GroupedNotifications => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const older: { [key: string]: Notification[] } = {};

    notifications.forEach(notification => {
      const date = new Date(notification.created_at);
      
      if (isToday(date)) {
        today.push(notification);
      } else if (isYesterday(date)) {
        yesterday.push(notification);
      } else {
        const dateKey = format(date, 'yyyy-MM-dd');
        const displayDate = format(date, 'dd/MM/yyyy', { locale: ptBR });
        
        if (!older[dateKey]) {
          older[dateKey] = [];
        }
        older[dateKey].push(notification);
      }
    });

    const olderArray = Object.entries(older)
      .sort(([a], [b]) => b.localeCompare(a)) // Sort by date descending
      .map(([dateKey, notifications]) => ({
        date: format(new Date(dateKey), 'dd/MM/yyyy', { locale: ptBR }),
        notifications
      }));

    return { today, yesterday, older: olderArray };
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      await fetchNotifications(); // Refresh after marking as read
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      await fetchNotifications(); // Refresh after marking all as read
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const updatePreferences = async (settings: Partial<NotificationSettings>) => {
    try {
      await notificationsService.updatePreferences(settings);
      setPreferences(prev => ({ ...prev, ...settings }));
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    preferences,
    groupNotificationsByDate,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    updatePreferences
  };
};