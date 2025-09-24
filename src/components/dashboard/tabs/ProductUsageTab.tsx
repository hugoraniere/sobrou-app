import React from 'react';
import { Receipt, ShoppingCart, ChefHat, CreditCard } from 'lucide-react';
import { KpiCard } from '../widgets/KpiCard';
import { TimeSeriesChart } from '../widgets/Charts';
import { DataTable, TableColumn } from '../widgets/DataTable';
import { useProductUsageMetrics } from '@/hooks/useDashboardMetrics';
import { useTopUsersByUsage, useActiveUsersTimeline } from '@/hooks/useRealData';
import { useDashboardPeriod } from '@/contexts/DashboardDateProvider';

// Mock data for top users by usage
const mockTopUsers = [
  { id: '1', name: 'João S.', email: 'joao***@gmail.com', transactions: 245, lists: 12, recipes: 8 },
  { id: '2', name: 'Maria O.', email: 'maria***@outlook.com', transactions: 189, lists: 9, recipes: 15 },
  { id: '3', name: 'Pedro L.', email: 'pedro***@yahoo.com', transactions: 156, lists: 7, recipes: 6 },
  { id: '4', name: 'Ana M.', email: 'ana***@gmail.com', transactions: 134, lists: 11, recipes: 12 },
  { id: '5', name: 'Carlos R.', email: 'carlos***@hotmail.com', transactions: 98, lists: 5, recipes: 4 }
];

// Mock active users over time data
const mockActiveUsersData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  active_users: Math.floor(Math.random() * 50) + 20 + Math.sin(i / 7) * 10
}));

export function ProductUsageTab() {
  const { dateRange } = useDashboardPeriod();
  const productMetrics = useProductUsageMetrics();
  
  const { data: topUsers, isLoading: topUsersLoading } = useTopUsersByUsage(
    dateRange.dateFrom.toISOString().split('T')[0],
    dateRange.dateTo.toISOString().split('T')[0]
  );
  
  const { data: activeUsersData, isLoading: activeUsersLoading } = useActiveUsersTimeline(
    dateRange.dateFrom.toISOString().split('T')[0],
    dateRange.dateTo.toISOString().split('T')[0]
  );

  const usageCards = [
    {
      title: 'Total de Transações',
      newValue: productMetrics.data?.new_transactions || 0,
      totalValue: productMetrics.data?.total_transactions || 0,
      icon: <Receipt className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Listas de Compras',
      newValue: productMetrics.data?.new_shopping_lists || 0,
      totalValue: productMetrics.data?.total_shopping_lists || 0,
      icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Receitas Criadas',
      newValue: productMetrics.data?.new_recipes || 0,
      totalValue: productMetrics.data?.total_recipes || 0,
      icon: <ChefHat className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Contas a Pagar',
      newValue: productMetrics.data?.new_bills || 0,
      totalValue: productMetrics.data?.total_bills || 0,
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />
    }
  ];

  const topUsersColumns: TableColumn[] = [
    { key: 'name', label: 'Nome', sortable: true },
    { 
      key: 'email', 
      label: 'E-mail', 
      sortable: true,
      className: 'font-mono text-sm'
    },
    { 
      key: 'transactions', 
      label: 'Transações', 
      sortable: true,
      className: 'text-right',
      formatter: (value) => value.toLocaleString('pt-BR')
    },
    { 
      key: 'lists', 
      label: 'Listas', 
      sortable: true,
      className: 'text-right'
    },
    { 
      key: 'recipes', 
      label: 'Receitas', 
      sortable: true,
      className: 'text-right'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Product Usage KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {usageCards.map((card, index) => (
          <div key={index} className="space-y-2">
            <KpiCard
              title={`${card.title} (Novas)`}
              value={card.newValue}
              icon={card.icon}
              isLoading={productMetrics.isLoading}
              isError={productMetrics.isError}
              lastUpdated={productMetrics.lastUpdated}
              onRefresh={() => productMetrics.refetch()}
              className="bg-primary/5 border-primary/20"
            />
            <KpiCard
              title={`${card.title} (Total)`}
              value={card.totalValue}
              icon={card.icon}
              isLoading={productMetrics.isLoading}
              isError={productMetrics.isError}
              lastUpdated={productMetrics.lastUpdated}
              className="bg-muted/30"
            />
          </div>
        ))}
      </div>

      {/* Active Users Over Time */}
      <TimeSeriesChart
        title="Usuários Ativos ao Longo do Tempo"
        data={activeUsersData || []}
        xAxisKey="date"
        yAxisKey="active_users"
        lineColor="hsl(var(--primary))"
        height={300}
        source="Analytics Events"
        isLoading={activeUsersLoading}
        isError={false}
        lastUpdated={new Date()}
        onRefresh={() => window.location.reload()}
      />

      {/* Top Users by Usage */}
      <DataTable
        title="Top Usuários por Uso"
        columns={topUsersColumns}
        data={topUsers || []}
        pageSize={10}
        emptyMessage="Nenhum usuário com atividade no período"
        actions={[
          {
            label: 'Ver Perfil',
            onClick: (user) => console.log('View user profile:', user.id),
            variant: 'outline'
          }
        ]}
        source="Aggregated Data"
        isLoading={topUsersLoading}
        isError={false}
        lastUpdated={new Date()}
        onRefresh={() => window.location.reload()}
      />
    </div>
  );
}