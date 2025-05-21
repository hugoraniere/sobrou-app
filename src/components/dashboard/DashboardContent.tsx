
import React from 'react';
import { Transaction } from '@/services/transactions';
import { SavingGoal } from '@/services/SavingsService';
import DashboardOverview from './tabs/DashboardOverview';
import DashboardBigNumbers from './DashboardBigNumbers';
import RecentTransactions from './RecentTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import ExpensesByCategoryChart from '../charts/ExpensesByCategoryChart';
import RevenueVsExpenseChart from '../charts/RevenueVsExpenseChart';
import DailyBarChart from '../charts/DailyBarChart';
import { cn } from '@/lib/utils';

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
  const isMobile = useIsMobile();
  
  // Calcular valores para os big numbers
  const totalSavings = savingGoals.reduce((total, goal) => total + goal.current_amount, 0);
  
  // Default chart config com cores consistentes
  const chartConfig = {
    income: {
      label: "Receita",
      theme: {
        light: "#22c55e",
        dark: "#22c55e"
      }
    },
    expense: {
      label: "Despesa",
      theme: {
        light: "#ef4444",
        dark: "#ef4444"
      }
    },
    balance: {
      label: "Saldo",
      theme: {
        light: "#3b82f6",
        dark: "#3b82f6"
      }
    }
  };
  
  // Limitar transações recentes às 5 mais recentes
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-8 px-4 md:px-0">
      {/* Big Numbers - Visão Geral */}
      <div>
        <Card className="w-full min-w-[300px]">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl">Visão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardBigNumbers 
              transactions={transactions} 
              totalSavings={totalSavings} 
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Seção de Últimas Transações e Gastos por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Transações */}
        <div className={cn("min-w-[300px]", isMobile ? "w-full" : "min-h-[350px]")}>
          <h2 className="text-xl font-semibold mb-4">Últimas transações</h2>
          
          {recentTransactions.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Nenhuma transação encontrada
            </div>
          ) : (
            <div className="space-y-4">
              <RecentTransactions transactions={recentTransactions} />
              
              <div className="flex justify-end mt-4">
                <Link to="/transactions">
                  <Button variant="outline">Ver todas</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Gastos por Categoria */}
        <Card className="min-w-[300px]">
          <CardHeader>
            <CardTitle className="text-xl">Gastos por categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ExpensesByCategoryChart 
              expenses={transactions.filter(t => t.type === 'expense')} 
              chartConfig={chartConfig} 
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Seção de Gráficos - Segunda linha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receita vs Despesa */}
        <Card className="min-w-[300px]">
          <CardHeader>
            <CardTitle className="text-xl">Receita vs Despesa</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <RevenueVsExpenseChart 
              transactions={transactions} 
              chartConfig={chartConfig} 
            />
          </CardContent>
        </Card>
        
        {/* Evolução Diária */}
        <Card className="min-w-[300px]">
          <CardHeader>
            <CardTitle className="text-xl">Evolução Diária</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <DailyBarChart transactions={transactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
