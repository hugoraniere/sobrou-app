
import React from 'react';
import FinancialInsights from '@/components/dashboard/FinancialInsights';
import { Transaction } from '@/services/transactions';

interface DashboardInsightsProps {
  transactions: Transaction[];
}

const DashboardInsights: React.FC<DashboardInsightsProps> = ({ transactions }) => {
  return (
    <div className="w-full">
      <FinancialInsights transactions={transactions} />
    </div>
  );
};

export default DashboardInsights;
