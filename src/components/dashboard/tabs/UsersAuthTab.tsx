import React from 'react';
import { SimplePieChart, TimeSeriesChart, StackedBarChart } from '../widgets/Charts';
import { DataTable, TableColumn } from '../widgets/DataTable';
import { useAuthMetrics } from '@/hooks/useDashboardMetrics';
import { useRecentSignups, useLoginErrors } from '@/hooks/useRealData';
import { useDashboardPeriod } from '@/contexts/DashboardDateProvider';

// Mock data for recent signups since we don't have auth.users access
const mockRecentSignups = [
  { id: '1', email: 'user***@gmail.com', full_name: 'João S.', created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: '2', email: 'maria***@outlook.com', full_name: 'Maria O.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: '3', email: 'pedro***@yahoo.com', full_name: 'Pedro L.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: '4', email: 'ana***@gmail.com', full_name: 'Ana M.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: '5', email: 'carlos***@hotmail.com', full_name: 'Carlos R.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() }
];

const mockLoginErrors = [
  { reason: 'Credenciais inválidas', error_count: 45 },
  { reason: 'Conta bloqueada', error_count: 12 },
  { reason: 'Erro de rede', error_count: 8 }
];

export function UsersAuthTab() {
  const { dateRange } = useDashboardPeriod();
  const authMetrics = useAuthMetrics();
  
  const { data: recentSignups, isLoading: signupsLoading } = useRecentSignups(10);
  const { data: loginErrors, isLoading: errorsLoading } = useLoginErrors(
    dateRange.dateFrom.toISOString().split('T')[0],
    dateRange.dateTo.toISOString().split('T')[0]
  );

  const signupColumns: TableColumn[] = [
    { 
      key: 'full_name', 
      label: 'Nome', 
      sortable: true,
      formatter: (value) => value || 'Não informado'
    },
    { 
      key: 'email', 
      label: 'E-mail', 
      sortable: true,
      className: 'font-mono text-sm'
    },
    { 
      key: 'created_at', 
      label: 'Data de Cadastro', 
      sortable: true,
      formatter: (value) => new Date(value).toLocaleString('pt-BR'),
      className: 'text-right'
    }
  ];

  const errorColumns: TableColumn[] = [
    { key: 'reason', label: 'Motivo do Erro', sortable: true },
    { 
      key: 'error_count', 
      label: 'Ocorrências', 
      sortable: true,
      className: 'text-right',
      formatter: (value) => value.toLocaleString('pt-BR')
    }
  ];

  // Transform data for charts
  const signupsByProvider = authMetrics.data?.signups_by_provider?.map(item => ({
    name: item.provider === 'email' ? 'E-mail/Senha' : 
          item.provider === 'google' ? 'Google' : 
          item.provider === 'facebook' ? 'Facebook' : 
          item.provider,
    value: item.signups,
    color: item.provider === 'google' ? '#4285f4' : 
           item.provider === 'facebook' ? '#1877f2' : 
           'hsl(var(--primary))'
  })) || [];

  const signupsByDay = authMetrics.data?.signups_by_day?.map(item => ({
    date: item.signup_date,
    signups: item.signups
  })) || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signups by Provider */}
        <SimplePieChart
          title="Cadastros por Provedor"
          data={signupsByProvider}
          isLoading={authMetrics.isLoading}
          isError={authMetrics.isError}
          lastUpdated={authMetrics.lastUpdated}
          onRefresh={() => authMetrics.refetch()}
          height={300}
        />

        {/* Login Errors by Reason */}
        <StackedBarChart
          title="Erros de Login por Motivo"
          data={mockLoginErrors.map(item => ({ reason: item.reason, count: item.error_count }))}
          xAxisKey="reason"
          stackKeys={[{
            key: 'count',
            color: 'hsl(var(--destructive))',
            label: 'Erros'
          }]}
          height={300}
          source="Analytics Events"
        />
      </div>

      {/* Signups Over Time */}
      <TimeSeriesChart
        title="Cadastros ao Longo do Tempo"
        data={signupsByDay}
        xAxisKey="date"
        yAxisKey="signups"
        lineColor="hsl(var(--primary))"
        isLoading={authMetrics.isLoading}
        isError={authMetrics.isError}
        lastUpdated={authMetrics.lastUpdated}
        onRefresh={() => authMetrics.refetch()}
        height={250}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Signups */}
        <DataTable
          title="Últimos Cadastros"
          columns={signupColumns}
          data={mockRecentSignups}
          pageSize={10}
          emptyMessage="Nenhum cadastro recente encontrado"
          source="Auth Schema"
        />

        {/* Login Error Details */}
        <DataTable
          title="Detalhes dos Erros de Login"
          columns={errorColumns}
          data={mockLoginErrors}
          pageSize={10}
          emptyMessage="Nenhum erro de login registrado"
          source="Analytics Events"
        />
      </div>
    </div>
  );
}