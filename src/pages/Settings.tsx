
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings as SettingsIcon, MessageCircle, Layout, Building2 } from 'lucide-react';
import ProfileTab from '@/components/settings/ProfileTab';
import PreferencesTab from '@/components/settings/PreferencesTab';
import WhatsAppTab from '@/components/settings/WhatsAppTab';
import PagesTab from '@/components/settings/PagesTab';
import { MEITab } from '@/components/settings/MEITab';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location]);

  return (
    <div className={cn(
      "w-full",
      isMobile ? "px-4" : "container mx-auto max-w-screen-xl"
    )}>
      <div className="mt-6 mb-6">
        <h1 className="text-3xl font-bold">{t('settings.title', 'Configurações')}</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('settings.tabs.profile', 'Perfil')}
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              {t('settings.tabs.preferences', 'Preferências')}
            </TabsTrigger>
            <TabsTrigger value="mei" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              MEI
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              {t('settings.tabs.pages', 'Páginas')}
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

        <TabsContent value="mei">
          <MEITab />
        </TabsContent>

        <TabsContent value="pages">
          <PagesTab />
        </TabsContent>

        <TabsContent value="whatsapp">
          <WhatsAppTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
