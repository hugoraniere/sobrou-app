
import React from 'react';
import FinancialAlerts from './FinancialAlerts';
import GoalsRecommendations from './GoalsRecommendations';
import { useTranslation } from 'react-i18next';

interface DashboardInsightsProps {
  alerts: {
    id: string;
    title: string;
    description: string;
    type: 'warning' | 'info' | 'success';
  }[];
  recommendations: {
    id: string;
    title: string;
    description: string;
    type: 'goal' | 'saving' | 'tip';
    progress?: number;
  }[];
}

const DashboardInsights: React.FC<DashboardInsightsProps> = ({ 
  alerts, 
  recommendations 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FinancialAlerts alerts={alerts} />
      <GoalsRecommendations recommendations={recommendations} />
    </div>
  );
};

export default DashboardInsights;
