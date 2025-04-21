
import React, { useState } from 'react';
import ProfileSection from '@/components/settings/ProfileSection';
import NotificationsSection from '@/components/settings/NotificationsSection';
import AppearanceSection from '@/components/settings/AppearanceSection';
import WhatsAppSection from '@/components/settings/WhatsAppSection';
import DangerZoneSection from '@/components/settings/DangerZoneSection';
import ChangePasswordSection from '@/components/profile/ChangePasswordSection';
import ProfileEditDialog from '@/components/profile/ProfileEditDialog';

const Settings = () => {
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileSection onEditClick={() => setIsProfileEditOpen(true)} />

      <div className="grid gap-6">
        <WhatsAppSection />
        <div className="grid gap-6 md:grid-cols-2">
          <NotificationsSection />
          <AppearanceSection />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <ChangePasswordSection />
          <DangerZoneSection />
        </div>
      </div>

      <ProfileEditDialog 
        isOpen={isProfileEditOpen} 
        onClose={() => setIsProfileEditOpen(false)} 
      />
    </div>
  );
};

export default Settings;
