
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings as SettingsIcon, MessageCircle } from 'lucide-react';
import ProfileTab from '@/components/settings/ProfileTab';
import PreferencesTab from '@/components/settings/PreferencesTab';
import WhatsAppTab from '@/components/settings/WhatsAppTab';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">{t('settings.title', 'Configurações')}</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <div className="border-b">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('settings.tabs.profile', 'Perfil')}
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              {t('settings.tabs.preferences', 'Preferências')}
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {t('settings.tabs.whatsapp', 'WhatsApp')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>

        <TabsContent value="whatsapp">
          <WhatsAppTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
