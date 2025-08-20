
import React from 'react';
import { Transaction } from '@/services/transactions';
import { useFinancialInsights } from '@/hooks/useFinancialInsights';
import InsightsList from '@/components/insights/InsightsList';
import { CardContent } from '@/components/ui/card';
import FinancialInsights from '@/components/dashboard/FinancialInsights';

interface DashboardInsightsProps {
  transactions: Transaction[];
}

const DashboardInsights: React.FC<DashboardInsightsProps> = ({
  transactions
}) => {
  const {
    insights,
    isLoading,
    refreshInsights
  } = useFinancialInsights(transactions);

  return (
    <CardContent className="bg-white p-0">
      <div className="w-full space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="lg:col-span-1">
            <InsightsList insights={insights} isLoading={isLoading} onRefresh={refreshInsights} />
          </div>
          <div className="lg:col-span-1">
            {/* Traditional insights without metrics */}
            <FinancialInsights transactions={transactions} showMetrics={false} />
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default DashboardInsights;
