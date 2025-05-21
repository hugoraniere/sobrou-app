
import React from 'react';
import { Transaction } from '@/services/transactions';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';

interface DashboardChartsProps {
  transactions: Transaction[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ transactions }) => {
  const { t } = useTranslation();
  
  // Este componente foi removido pois seus gráficos estavam duplicados em OverviewDashboard
  return null;
};

export default DashboardCharts;
