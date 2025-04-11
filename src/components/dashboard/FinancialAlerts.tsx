
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FinancialAlert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success';
}

interface FinancialAlertsProps {
  alerts: FinancialAlert[];
}

const FinancialAlerts: React.FC<FinancialAlertsProps> = ({ alerts }) => {
  const { t } = useTranslation();
  
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {alerts.map(alert => (
        <Alert 
          key={alert.id} 
          variant={alert.type === 'warning' ? 'destructive' : 'default'}
          className={`border-l-4 ${
            alert.type === 'warning' 
              ? 'border-l-red-500'
              : alert.type === 'success' 
                ? 'border-l-green-500'
                : 'border-l-blue-500'
          }`}
        >
          {alert.type === 'warning' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <TrendingUp className="h-4 w-4" />
          )}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default FinancialAlerts;
