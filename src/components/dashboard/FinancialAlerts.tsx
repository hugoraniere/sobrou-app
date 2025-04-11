
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Info, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FinancialAlertsProps {
  alerts: {
    id: string;
    title: string;
    description: string;
    type: 'warning' | 'info' | 'success';
  }[];
}

const FinancialAlerts: React.FC<FinancialAlertsProps> = ({ alerts }) => {
  const { t } = useTranslation();
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{t('dashboard.alerts.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('dashboard.alerts.noAlerts')}
          </p>
        ) : (
          <ul className="space-y-4">
            {alerts.map((alert) => (
              <li key={alert.id} className="flex gap-3">
                {getAlertIcon(alert.type)}
                <div>
                  <h4 className="text-sm font-medium">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground no-underline hover:no-underline">
                    {alert.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialAlerts;
