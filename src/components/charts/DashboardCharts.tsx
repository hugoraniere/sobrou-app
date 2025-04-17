
import React from 'react';
import { useTranslation } from 'react-i18next';
import DailyBarChart from '../charts/DailyBarChart';
import ExpensesByCategoryChart from '../charts/ExpensesByCategoryChart';
import MonthlyComparisonChart from '../charts/MonthlyComparisonChart';
import { Transaction } from '@/services/TransactionService';

interface DashboardChartsProps {
  transactions: Transaction[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ transactions }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-100 min-h-[300px]">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.charts.dailyEvolution')}</h3>
          <DailyBarChart transactions={transactions} />
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100 min-h-[300px]">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.charts.categoryBreakdown')}</h3>
          <ExpensesByCategoryChart expenses={transactions} chartConfig={{}} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-100 min-h-[300px] mt-6">
        <h3 className="text-lg font-semibold mb-2">{t('dashboard.charts.balanceEvolution')}</h3>
        <MonthlyComparisonChart expenses={transactions} chartConfig={{}} />
      </div>
    </>
  );
};

export default DashboardCharts;
