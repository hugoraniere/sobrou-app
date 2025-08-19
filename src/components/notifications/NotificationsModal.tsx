import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, CheckCheck, Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/services/notificationsService';

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  open,
  onOpenChange,
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
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{t('notifications.title', 'Notificações')}</DialogTitle>
            {unreadNotifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                {t('notifications.markAllAsRead', 'Marcar todas como lidas')}
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="unread" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unread" className="relative">
              {t('notifications.unread', 'Não lidas')}
              {unreadNotifications.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {unreadNotifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">
              {t('notifications.read', 'Lidas')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                renderNotifications(unreadGrouped, true)
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="read" className="mt-4">
            <ScrollArea className="h-[400px] pr-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                renderNotifications(readGrouped, false)
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};