import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, CheckCheck, Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/services/notificationsService';

interface NotificationsDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  open,
  onOpenChange,
  trigger,
}) => {
  const { t } = useTranslation();
  const { 
    notifications, 
    loading, 
    groupNotificationsByDate, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const unreadNotifications = notifications.filter(n => !n.read_at);
  const readNotifications = notifications.filter(n => n.read_at);

  const unreadGrouped = groupNotificationsByDate(unreadNotifications);
  const readGrouped = groupNotificationsByDate(readNotifications);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const renderNotificationGroup = (
    title: string,
    notifications: Notification[],
    showMarkAsRead: boolean = false
  ) => {
    if (notifications.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">{title}</h4>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${
                notification.read_at ? 'bg-muted/30' : 'bg-background'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-sm">{notification.title}</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.body}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(notification.created_at), 'HH:mm', { locale: ptBR })}
                  </p>
                </div>
                {showMarkAsRead && !notification.read_at && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="ml-2 p-1 h-8 w-8"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNotifications = (grouped: ReturnType<typeof groupNotificationsByDate>, showMarkAsRead: boolean = false) => {
    const hasNotifications = grouped.today.length > 0 || grouped.yesterday.length > 0 || grouped.older.length > 0;

    if (!hasNotifications) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Bell className="h-8 w-8 text-muted-foreground mb-3" />
          <h3 className="text-sm font-medium text-muted-foreground">
            {t('notifications.empty', 'Nenhuma notificação')}
          </h3>
        </div>
      );
    }

    return (
      <div>
        {renderNotificationGroup('Hoje', grouped.today, showMarkAsRead)}
        {renderNotificationGroup('Ontem', grouped.yesterday, showMarkAsRead)}
        {grouped.older.map(({ date, notifications }) =>
          renderNotificationGroup(date, notifications, showMarkAsRead)
        )}
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 bg-popover border shadow-lg z-50" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{t('notifications.title', 'Notificações')}</h3>
            {unreadNotifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs h-8"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                {t('notifications.markAllAsRead', 'Marcar todas como lidas')}
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="unread" className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="unread" className="relative text-xs">
                {t('notifications.unread', 'Não lidas')}
                {unreadNotifications.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs">
                    {unreadNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read" className="text-xs">
                {t('notifications.read', 'Lidas')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="unread" className="mt-2 p-4 pt-2">
            <ScrollArea className="h-80">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                renderNotifications(unreadGrouped, true)
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="read" className="mt-2 p-4 pt-2">
            <ScrollArea className="h-80">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                renderNotifications(readGrouped, false)
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};