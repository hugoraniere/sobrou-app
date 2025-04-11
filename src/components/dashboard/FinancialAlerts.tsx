
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-2">
      {alerts.map(alert => (
        <TooltipProvider key={alert.id}>
          <Alert 
            variant={alert.type === 'warning' ? 'destructive' : 'default'}
            className={`border-l-4 hover:no-underline ${
              alert.type === 'warning' 
                ? 'border-l-red-500'
                : alert.type === 'success' 
                  ? 'border-l-green-500'
                  : 'border-l-blue-500'
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertTitle className="cursor-help no-underline">{alert.title}</AlertTitle>
                  </TooltipTrigger>
                  <TooltipContent>
                    {alert.description}
                  </TooltipContent>
                </Tooltip>
                <AlertDescription>{alert.description}</AlertDescription>
              </div>
            </div>
          </Alert>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default FinancialAlerts;
