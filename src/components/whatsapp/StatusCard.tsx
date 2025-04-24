
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const StatusCard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user?.user_metadata?.whatsapp_number) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="h-5 w-5 mr-2" />
          {t('whatsapp.status', 'Status')}
        </CardTitle>
        <CardDescription>
          {t('whatsapp.statusDescription', 'Seu número está conectado')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full" />
            <p className="text-green-700">
              {t('whatsapp.connected', 'Conectado')}: {user.user_metadata.whatsapp_number}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
