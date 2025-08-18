
import React, { useState, useEffect } from 'react';
import { Transaction } from '@/services/transactions';
import DashboardBigNumbers from './DashboardBigNumbers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DashboardOverviewCardProps {
  transactions: Transaction[];
  totalSavings: number;
}

type PeriodFilter = 'today' | 'this-week' | 'this-month' | 'last-30-days' | 'this-year';

const DashboardOverviewCard: React.FC<DashboardOverviewCardProps> = ({ 
  transactions, 
  totalSavings 
}) => {
  const [activePeriod, setActivePeriod] = useState<PeriodFilter>('this-month');
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  
  // Efeito para filtrar transações quando transactions muda ou quando o período muda
  useEffect(() => {
    filterTransactionsByPeriod(activePeriod);
  }, [transactions, activePeriod]);
  
  // Helper para converter data string para Date local
  const parseDateLocal = (dateStr: string | Date): Date => {
    // Se já é um objeto Date, retorna como está
    if (typeof dateStr === 'object' && dateStr instanceof Date) return dateStr;
    
    // Parse da string de data considerando timezone local
    if (typeof dateStr === 'string') {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    }
    
    // Fallback para o parse padrão
    return new Date(dateStr);
  };

  // Filtrar transações com base no período selecionado
  const filterTransactionsByPeriod = (period: PeriodFilter) => {
    const now = new Date();
    let start: Date;
    let end: Date;
    
    // Definir as datas de início e fim com base no período selecionado
    switch (period) {
      case 'today':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'this-week':
        start = startOfWeek(now, { locale: ptBR }); // Segunda-feira no Brasil
        end = endOfWeek(now, { locale: ptBR });
        break;
      case 'this-month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'last-30-days':
        start = startOfDay(subDays(now, 30));
        end = endOfDay(now);
        break;
      case 'this-year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
    }
    
    // Filtrar transações entre as datas de início e fim (inclusive)
    const filtered = transactions.filter(transaction => {
      const transactionDate = parseDateLocal(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
    
    setFilteredTransactions(filtered);
  };
  
  // Configurar os labels dos filtros
  const periodFilters = [
    { id: 'today' as PeriodFilter, label: 'Hoje' },
    { id: 'this-week' as PeriodFilter, label: 'Essa semana' },
    { id: 'this-month' as PeriodFilter, label: 'Esse mês' },
    { id: 'last-30-days' as PeriodFilter, label: 'Últimos 30 dias' },
    { id: 'this-year' as PeriodFilter, label: 'Este ano' }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl">Visão Geral</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros de período */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Filtrar por período</p>
          <div className="flex flex-wrap gap-2">
            {periodFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={activePeriod === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActivePeriod(filter.id)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Big Numbers */}
        <DashboardBigNumbers 
          transactions={filteredTransactions} 
          totalSavings={totalSavings} 
        />
      </CardContent>
    </Card>
  );
};

export default DashboardOverviewCard;
