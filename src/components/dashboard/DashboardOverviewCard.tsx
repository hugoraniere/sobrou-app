
import React, { useState, useEffect } from 'react';
import { Transaction } from '@/services/transactions';
import DashboardBigNumbers from './DashboardBigNumbers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  
  // Filtrar transações com base no período selecionado
  const filterTransactionsByPeriod = (period: PeriodFilter) => {
    const now = new Date();
    let startDate = new Date();
    
    // Definir a data de início com base no período selecionado
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'this-week':
        const day = startDate.getDay() || 7; // Considerando a semana começando no domingo (0) até sábado (6)
        startDate.setDate(startDate.getDate() - day + 1); // Primeiro dia da semana (segunda-feira)
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'this-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last-30-days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'this-year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }
    
    // Filtrar transações entre a data de início e agora
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= now;
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
