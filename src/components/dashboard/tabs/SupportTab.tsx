import React from 'react';
import { Clock, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { KpiCard } from '../widgets/KpiCard';
import { StackedBarChart, SimplePieChart } from '../widgets/Charts';
import { DataTable, TableColumn, TableAction } from '../widgets/DataTable';
import { useSupportMetrics } from '@/hooks/useDashboardMetrics';
import { useSupportBacklog } from '@/hooks/useRealData';

// Mock backlog data
const mockBacklogTickets = [
  {
    id: 'SUP-001234',
    subject: 'Problema com sincronização de dados',
    priority: 'alta',
    hours_open: 78.5,
    status: 'aberto'
  },
  {
    id: 'SUP-001235', 
    subject: 'Erro ao importar extrato bancário',
    priority: 'media',
    hours_open: 45.2,
    status: 'em_andamento'
  },
  {
    id: 'SUP-001236',
    subject: 'Dúvida sobre categorização automática',
    priority: 'baixa',
    hours_open: 95.8,
    status: 'aguardando_cliente'
  }
];

export function SupportTab() {
  const supportMetrics = useSupportMetrics();
  const { data: backlogTickets, isLoading: backlogLoading } = useSupportBacklog(72);

  const slaMetrics = [
    {
      title: 'Mediana até 1ª Resposta',
      value: supportMetrics.data?.avg_first_response_hours || 0,
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      format: 'number' as const,
      suffix: 'h'
    },
    {
      title: 'SLA Cumprido',
      value: supportMetrics.data?.sla_compliance || 0,
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      format: 'percentage' as const
    },
    {
      title: 'Tickets em Backlog',
      value: supportMetrics.data?.backlog_count || 0,
      icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />
    }
  ];

  const backlogColumns: TableColumn[] = [
    { 
      key: 'id', 
      label: 'ID', 
      sortable: true,
      className: 'font-mono text-sm'
    },
    { 
      key: 'subject', 
      label: 'Assunto', 
      sortable: true,
      formatter: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    { 
      key: 'priority', 
      label: 'Prioridade', 
      sortable: true,
      formatter: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'alta' ? 'bg-red-100 text-red-800' :
          value === 'media' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'hours_open', 
      label: 'Horas em Aberto', 
      sortable: true,
      className: 'text-right',
      formatter: (value) => `${value.toFixed(1)}h`
    }
  ];

  const backlogActions: TableAction[] = [
    {
      label: 'Ver Ticket',
      icon: <ExternalLink className="h-3 w-3" />,
      onClick: (ticket) => console.log('View ticket:', ticket.id),
      variant: 'outline'
    }
  ];

  // Transform data for charts
  const ticketsByStatus = supportMetrics.data?.tickets_by_status?.map(item => ({
    name: item.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: item.count,
    color: item.status === 'resolvido' ? '#10b981' :
           item.status === 'aberto' ? '#ef4444' :
           item.status === 'em_andamento' ? '#f59e0b' :
           'hsl(var(--muted-foreground))'
  })) || [];

  const ticketsByType = supportMetrics.data?.tickets_by_type?.map(item => ({
    name: item.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: item.count
  })) || [];

  return (
    <div className="space-y-6">
      {/* SLA Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slaMetrics.map((metric, index) => (
          <KpiCard
            key={index}
            title={metric.title}
            value={metric.suffix ? `${metric.value}${metric.suffix}` : metric.value}
            icon={metric.icon}
            format={metric.suffix ? 'number' : metric.format}
            isLoading={supportMetrics.isLoading}
            isError={supportMetrics.isError}
            lastUpdated={supportMetrics.lastUpdated}
            onRefresh={() => supportMetrics.refetch()}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets by Status */}
        <StackedBarChart
          title="Tickets por Status"
          data={[{ 
            category: 'Status',
            ...ticketsByStatus.reduce((acc, item) => ({ 
              ...acc, 
              [item.name]: item.value 
            }), {})
          }]}
          xAxisKey="category"
          stackKeys={ticketsByStatus.map(item => ({
            key: item.name,
            color: item.color || 'hsl(var(--primary))',
            label: item.name
          }))}
          isLoading={supportMetrics.isLoading}
          isError={supportMetrics.isError}
          lastUpdated={supportMetrics.lastUpdated}
          onRefresh={() => supportMetrics.refetch()}
          height={300}
        />

        {/* Tickets by Type */}
        <SimplePieChart
          title="Tickets por Tipo"
          data={ticketsByType}
          isLoading={supportMetrics.isLoading}
          isError={supportMetrics.isError}
          lastUpdated={supportMetrics.lastUpdated}
          onRefresh={() => supportMetrics.refetch()}
          height={300}
        />
      </div>

      {/* Backlog Table */}
      <DataTable
        title="Backlog (>72h)"
        columns={backlogColumns}
        data={backlogTickets || []}
        actions={backlogActions}
        pageSize={10}
        emptyMessage="Nenhum ticket em backlog"
        source="Analytics Events"
        isLoading={backlogLoading}
        isError={false}
        lastUpdated={new Date()}
        onRefresh={() => window.location.reload()}
      />
    </div>
  );
}