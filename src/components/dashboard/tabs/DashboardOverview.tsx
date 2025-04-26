
import React from 'react';
import OverviewDashboard from '../OverviewDashboard';
import { Transaction } from '@/services/transactions';
import { SavingGoal } from '@/services/SavingsService';

interface DashboardOverviewProps {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  transactions,
  savingGoals
}) => {
  return (
    <OverviewDashboard 
      transactions={transactions} 
      savingGoals={savingGoals} 
    />
  );
};

export default DashboardOverview;
