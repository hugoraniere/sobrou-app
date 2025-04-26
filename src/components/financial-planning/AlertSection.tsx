
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface AlertSectionProps {
  show: boolean;
}

const AlertSection: React.FC<AlertSectionProps> = ({ show }) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{t('common.attention', 'Atenção')}</AlertTitle>
      <AlertDescription>
        {t('financialPlanning.riskAlert', 'Suas despesas previstas superam sua receita mensal.')}
      </AlertDescription>
    </Alert>
  );
};

export default AlertSection;
