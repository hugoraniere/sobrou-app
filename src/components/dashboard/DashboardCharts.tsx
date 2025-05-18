
import React from 'react';
import DailyBarChart from '../charts/DailyBarChart';
import ExpensesByCategoryChart from '../charts/ExpensesByCategoryChart';
import MonthlyComparisonChart from '../charts/MonthlyComparisonChart';
import { Transaction } from '@/services/transactions';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardChartsProps {
  transactions: Transaction[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ transactions }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-100 min-h-[300px]">
          <CardHeader className="pb-2">
            <CardTitle>{t('dashboard.charts.dailyEvolution', 'Movimentações diárias')}</CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <DailyBarChart transactions={transactions} />
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-100 min-h-[300px]">
          <CardHeader className="pb-2">
            <CardTitle>{t('dashboard.charts.expensesByCategory', 'Gastos por Categoria')}</CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <ExpensesByCategoryChart expenses={transactions} chartConfig={{}} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-100 min-h-[300px] mt-6">
        <CardHeader className="pb-2">
          <CardTitle>{t('dashboard.charts.balanceEvolution', 'Evolução do Saldo')}</CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <MonthlyComparisonChart expenses={transactions} chartConfig={{}} />
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardCharts;
