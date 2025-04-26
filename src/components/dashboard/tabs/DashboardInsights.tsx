
import React from 'react';
import { Transaction } from '@/services/transactions';
import { useFinancialInsights } from '@/hooks/useFinancialInsights';
import InsightsList from '@/components/insights/InsightsList';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import FinancialInsights from '@/components/dashboard/FinancialInsights';

interface DashboardInsightsProps {
  transactions: Transaction[];
}

const DashboardInsights: React.FC<DashboardInsightsProps> = ({ transactions }) => {
  const { insights, isLoading, error, refreshInsights } = useFinancialInsights(transactions);

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InsightsList 
            insights={insights} 
            isLoading={isLoading} 
            onRefresh={refreshInsights} 
          />
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
              <CardDescription>Seu saldo e principais métricas</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Traditional insights with charts and metrics */}
              <FinancialInsights transactions={transactions} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardInsights;
