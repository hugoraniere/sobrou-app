
import React, { useState, useEffect } from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { Transaction, TransactionService } from '../services/TransactionService';
import TransactionTableHeader from './transactions/TransactionTableHeader';
import TransactionRow from './transactions/TransactionRow';
import TransactionPagination from './transactions/TransactionPagination';
import { useTransactionSorter } from '@/hooks/useTransactionSorter';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { transactionCategories } from '@/data/categories';
import { useTranslation } from 'react-i18next';

interface TransactionsTableProps {
  transactions: Transaction[];
  filters: {
    category: string;
    type: string;
    dateRange: string;
    minAmount: string;
    maxAmount: string;
  };
  onTransactionUpdated: () => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ 
  transactions,
  filters: initialFilters,
  onTransactionUpdated
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Filtros internos da tabela
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    type: initialFilters.type || 'all',
    dateRange: initialFilters.dateRange || 'all',
    minAmount: initialFilters.minAmount || '',
    maxAmount: initialFilters.maxAmount || '',
  });
  
  // Used for UI state of recurring items since the database doesn't support it yet
  const [transactionsState, setTransactionsState] = useState<Transaction[]>(transactions);
  
  // Update local state when transactions prop changes
  useEffect(() => {
    setTransactionsState(transactions);
  }, [transactions]);
  
  const { sortConfig, handleSort, sortedTransactions } = useTransactionSorter('date', 'desc');
  
  // Handle updating individual filter values
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset all filters to default values
  const handleResetFilters = () => {
    setFilters({
      category: '',
      type: 'all',
      dateRange: 'all',
      minAmount: '',
      maxAmount: '',
    });
    setCurrentPage(1);
  };
  
  // Filter transactions based on current filter values
  const filteredTransactions = React.useMemo(() => {
    return transactionsState.filter(transaction => {
      // Filter by category
      if (filters.category && filters.category !== 'all' && transaction.category !== filters.category) {
        return false;
      }

      // Filter by type
      if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      // Filter by date range
      if (filters.dateRange && filters.dateRange !== 'all') {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        
        if (filters.dateRange === 'thisMonth') {
          if (
            transactionDate.getMonth() !== now.getMonth() ||
            transactionDate.getFullYear() !== now.getFullYear()
          ) {
            return false;
          }
        } else if (filters.dateRange === 'lastMonth') {
          const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          
          if (
            transactionDate.getMonth() !== lastMonth ||
            transactionDate.getFullYear() !== lastMonthYear
          ) {
            return false;
          }
        } else if (filters.dateRange === 'thisYear') {
          if (transactionDate.getFullYear() !== now.getFullYear()) {
            return false;
          }
        }
      }

      // Filter by min amount
      if (filters.minAmount && parseFloat(filters.minAmount) > transaction.amount) {
        return false;
      }

      // Filter by max amount
      if (filters.maxAmount && parseFloat(filters.maxAmount) < transaction.amount) {
        return false;
      }

      return true;
    });
  }, [transactionsState, filters]);
  
  // Sort and paginate transactions
  const sortedFilteredTransactions = sortedTransactions(filteredTransactions);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedFilteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedFilteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  
  // Format date - atualizando para exibir dia/mês/ano
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  // Toggle recurring status in UI only (without database update)
  const handleToggleRecurring = async (id: string, isRecurring: boolean) => {
    // Update the local state
    setTransactionsState(prevState => 
      prevState.map(transaction => 
        transaction.id === id 
          ? { ...transaction, is_recurring: isRecurring } 
          : transaction
      )
    );
    
    toast.success(isRecurring ? "Transação marcada como recorrente" : "Transação desmarcada como recorrente");
  };
  
  return (
    <div className="space-y-4">
      <div className="w-full overflow-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold mb-4">Suas Transações</h3>
          
          {/* Filtros dentro da tabela */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                <SelectItem value="all">Todas as categorias</SelectItem>
                {transactionCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={filters.dateRange}
              onValueChange={(value) => handleFilterChange('dateRange', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as datas" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Todas as datas</SelectItem>
                <SelectItem value="thisMonth">Este mês</SelectItem>
                <SelectItem value="lastMonth">Mês anterior</SelectItem>
                <SelectItem value="thisYear">Este ano</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Valor mínimo"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Valor máximo"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleResetFilters}
            >
              Limpar filtros
            </Button>
          </div>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Nenhuma transação encontrada com os filtros atuais.
          </div>
        ) : (
          <>
            <Table>
              <TransactionTableHeader 
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TransactionRow 
                    key={transaction.id}
                    transaction={transaction}
                    onToggleRecurring={handleToggleRecurring}
                    formatDate={formatDate}
                    onTransactionUpdated={onTransactionUpdated}
                  />
                ))}
              </TableBody>
            </Table>
            
            <TransactionPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
