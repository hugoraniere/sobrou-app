
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const InstructionsCard = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('whatsapp.howToUse', 'Como usar')}</CardTitle>
        <CardDescription>
          {t('whatsapp.howToUseDesc', 'Instruções para usar o WhatsApp')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">
              {t('whatsapp.examples', 'Exemplos de mensagens')}
            </h3>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="text-sm">Gastei R$50 no mercado</p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="text-sm">Recebi R$1000 de salário</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructionsCard;
