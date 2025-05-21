
import React from 'react';
import { Transaction } from '@/services/transactions';
import { SavingGoal } from '@/services/SavingsService';
import DashboardOverview from './tabs/DashboardOverview';
import DashboardInsights from './tabs/DashboardInsights';
import RecentTransactions from './RecentTransactions';
import DashboardCharts from './DashboardCharts';
import { Grid } from 'lucide-react';

interface DashboardContentProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  savingGoals: SavingGoal[];
  filters: {
    category: string;
    type: string;
    dateRange: string;
    minAmount: string;
    maxAmount: string;
  };
  isLoading: boolean;
  hasTransactions: boolean;
  onTransactionUpdated: () => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  whatsAppConnected: boolean;
  onSavingGoalAdded: () => void;
  onSavingGoalUpdated: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  transactions,
  savingGoals,
  isLoading,
  hasTransactions,
  onTransactionUpdated,
}) => {
  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* Visão Geral */}
      <div className="space-y-6">
        <DashboardOverview 
          transactions={transactions} 
          savingGoals={savingGoals} 
        />
      </div>
      
      {/* Seção de Últimas Transações e Gastos por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={transactions} />
        
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-medium mb-4">Gastos por Categoria</h3>
          <ExpensesByCategoryChart expenses={transactions.filter(t => t.type === 'expense')} chartConfig={{}} />
        </div>
      </div>
      
      {/* Insights */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-semibold mb-6">Insights</h2>
        <DashboardInsights transactions={transactions} />
      </div>
    </div>
  );
};

export default DashboardContent;

// Importar o componente de gráfico de despesas por categoria
import ExpensesByCategoryChart from '../charts/ExpensesByCategoryChart';
