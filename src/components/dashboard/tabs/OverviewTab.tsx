import React from 'react';
import { 
  Users, 
  Activity, 
  UserCheck, 
  TrendingUp, 
  CheckCircle,
  Receipt,
  ShoppingCart,
  ChefHat
} from 'lucide-react';
import { KpiCard } from '../widgets/KpiCard';
import { TimeSeriesChart, StackedBarChart } from '../widgets/Charts';
import { DataTable, TableColumn } from '../widgets/DataTable';
import { useOverviewMetrics, useProductUsageMetrics, useSupportMetrics, useContentMetrics } from '@/hooks/useDashboardMetrics';
import { calcDelta } from '@/utils/dashboardUtils';
import { useDashboardPeriod } from '@/contexts/DashboardDateProvider';

export function OverviewTab() {
  const { compareEnabled } = useDashboardPeriod();
  const overviewMetrics = useOverviewMetrics();
  const productMetrics = useProductUsageMetrics();
  const supportMetrics = useSupportMetrics();
  const contentMetrics = useContentMetrics();

  const kpiCards = [
    {
      title: 'Usuários Cadastrados',
      value: overviewMetrics.data?.totalUsers || 0,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      trend: compareEnabled && overviewMetrics.data?.prevTotalUsers 
        ? calcDelta(overviewMetrics.data.totalUsers, overviewMetrics.data.prevTotalUsers)
        : undefined,
      isLoading: overviewMetrics.isLoading,
      isError: overviewMetrics.isError,
      lastUpdated: overviewMetrics.lastUpdated,
      onClick: () => console.log('Navigate to users')
    },
    {
      title: 'Usuários Ativos',
      value: overviewMetrics.data?.activeUsers || 0,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      trend: compareEnabled && overviewMetrics.data?.prevActiveUsers
        ? calcDelta(overviewMetrics.data.activeUsers, overviewMetrics.data.prevActiveUsers)
        : undefined,
      isLoading: overviewMetrics.isLoading,
      isError: overviewMetrics.isError,
      lastUpdated: overviewMetrics.lastUpdated,
      onClick: () => console.log('Navigate to active users')
    },
    {
      title: 'Assinantes',
      value: overviewMetrics.data?.subscribers || 0,
      icon: <UserCheck className="h-4 w-4 text-muted-foreground" />,
      trend: compareEnabled && overviewMetrics.data?.prevSubscribers
        ? calcDelta(overviewMetrics.data.subscribers, overviewMetrics.data.prevSubscribers)
        : undefined,
      isLoading: overviewMetrics.isLoading,
      isError: overviewMetrics.isError,
      lastUpdated: overviewMetrics.lastUpdated,
      onClick: () => console.log('Navigate to subscriptions')
    },
    {
      title: 'Conversão p/ Cadastro',
      value: overviewMetrics.data?.conversionRate || 0,
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      format: 'percentage' as const,
      isLoading: overviewMetrics.isLoading,
      isError: overviewMetrics.isError,
      lastUpdated: overviewMetrics.lastUpdated
    },
    {
      title: 'SLA Cumprido',
      value: overviewMetrics.data?.slaCompliance || 0,
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      format: 'percentage' as const,
      isLoading: overviewMetrics.isLoading,
      isError: overviewMetrics.isError,
      lastUpdated: overviewMetrics.lastUpdated,
      onClick: () => console.log('Navigate to support')
    }
  ];

  const productUsageCards = [
    {
      title: 'Transações',
      value: productMetrics.data?.new_transactions || 0,
      total: productMetrics.data?.total_transactions || 0,
      icon: <Receipt className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Listas de Compras',
      value: productMetrics.data?.new_shopping_lists || 0,
      total: productMetrics.data?.total_shopping_lists || 0,
      icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Receitas',
      value: productMetrics.data?.new_recipes || 0,
      total: productMetrics.data?.total_recipes || 0,
      icon: <ChefHat className="h-4 w-4 text-muted-foreground" />
    }
  ];

  const supportStatusData = supportMetrics.data?.tickets_by_status?.map(item => ({
    name: item.status,
    value: item.count
  })) || [];

  const topArticlesColumns: TableColumn[] = [
    { key: 'title', label: 'Artigo', sortable: true },
    { 
      key: 'helpful_percentage', 
      label: 'Taxa "Ajudou"', 
      sortable: true,
      formatter: (value) => `${value}%`,
      className: 'text-right'
    },
    { 
      key: 'total_votes', 
      label: 'Total Votos', 
      sortable: true,
      className: 'text-right'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpiCards.map((card, index) => (
          <KpiCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend ? {
              value: card.trend.deltaPct,
              direction: card.trend.trend,
              label: 'período anterior'
            } : undefined}
            format={card.format}
            isLoading={card.isLoading}
            isError={card.isError}
            lastUpdated={card.lastUpdated}
            onClick={card.onClick}
            onRefresh={() => overviewMetrics.refetch()}
          />
        ))}
      </div>

      {/* Product Usage Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {productUsageCards.map((card, index) => (
          <KpiCard
            key={index}
            title={`${card.title} (Novas)`}
            value={card.value}
            icon={card.icon}
            isLoading={productMetrics.isLoading}
            isError={productMetrics.isError}
            lastUpdated={productMetrics.lastUpdated}
            onRefresh={() => productMetrics.refetch()}
            className="bg-muted/30"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Status Overview */}
        <StackedBarChart
          title="Tickets por Status"
          data={[{ name: 'Status', ...supportStatusData.reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {}) }]}
          xAxisKey="name"
          stackKeys={supportStatusData.map((item, index) => ({
            key: item.name,
            color: `hsl(${index * 60}, 70%, 50%)`,
            label: item.name
          }))}
          isLoading={supportMetrics.isLoading}
          isError={supportMetrics.isError}
          lastUpdated={supportMetrics.lastUpdated}
          onRefresh={() => supportMetrics.refetch()}
          height={250}
        />

        {/* Top Helpful Articles */}
        <DataTable
          title="Top Artigos que Ajudam"
          columns={topArticlesColumns}
          data={contentMetrics.data?.top_helpful_articles || []}
          isLoading={contentMetrics.isLoading}
          isError={contentMetrics.isError}
          lastUpdated={contentMetrics.lastUpdated}
          onRefresh={() => contentMetrics.refetch()}
          pageSize={5}
          emptyMessage="Nenhum artigo com votos encontrado"
        />
      </div>
    </div>
  );
}