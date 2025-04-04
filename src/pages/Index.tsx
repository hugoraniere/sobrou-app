
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FinancialDashboard } from '../components/FinancialDashboard';
import OnboardingPanel from '../components/OnboardingPanel';
import AIPromptInput from '../components/AIPromptInput';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { TransactionService, Transaction } from '../services/TransactionService';
import { SavingsService, SavingGoal } from '../services/SavingsService';
import TransactionsTable from '../components/TransactionsTable';
import SavingGoals from '../components/SavingGoals';
import EmptyDashboard from '../components/EmptyDashboard';
import FilterBar from '../components/FilterBar';
import { X } from 'lucide-react';

// Categories with icons
export const expenseCategories = [
  'Food', 'Housing', 'Transportation', 'Entertainment', 'Shopping', 
  'Utilities', 'Health', 'Education', 'Income', 'Savings', 'Other'
];

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // In a real app, we would get WhatsApp connection status from user data
  const [whatsAppConnected, setWhatsAppConnected] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // State for transactions and saving goals
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters state
  const [filters, setFilters] = useState({
    dateRange: '30days',
    category: 'all',
    type: 'all',
    minAmount: '',
    maxAmount: ''
  });
  
  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      dateRange: '30days',
      category: 'all',
      type: 'all',
      minAmount: '',
      maxAmount: ''
    });
  };
  
  // Fetch transactions and saving goals
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedTransactions, fetchedSavingGoals] = await Promise.all([
        TransactionService.getTransactions(),
        SavingsService.getSavingGoals()
      ]);
      
      setTransactions(fetchedTransactions);
      setSavingGoals(fetchedSavingGoals);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  
  // For demo purposes, toggle states
  const toggleWhatsApp = () => setWhatsAppConnected(!whatsAppConnected);
  
  // Function to filter expenses based on active filters
  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      // Filter by time range
      if (filters.dateRange !== 'all') {
        const transactionDate = new Date(transaction.date);
        const today = new Date();
        
        switch (filters.dateRange) {
          case '7days': {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return transactionDate >= weekAgo;
          }
          case '30days': {
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            return transactionDate >= monthAgo;
          }
          case 'thisMonth': {
            return (
              transactionDate.getMonth() === today.getMonth() &&
              transactionDate.getFullYear() === today.getFullYear()
            );
          }
          case 'lastMonth': {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return (
              transactionDate.getMonth() === lastMonth.getMonth() &&
              transactionDate.getFullYear() === lastMonth.getFullYear()
            );
          }
          case 'thisYear': {
            return transactionDate.getFullYear() === today.getFullYear();
          }
          default:
            return true;
        }
      }
      
      return true;
    });
  };
  
  const filteredTransactions = getFilteredTransactions();
  const hasTransactions = transactions.length > 0;
  
  // For development purposes, render a small control panel
  const renderDevControls = () => (
    <div className="bg-gray-100 p-2 text-xs fixed bottom-0 right-0 z-50">
      <button onClick={toggleWhatsApp} className="bg-gray-200 px-2 py-1 rounded">
        Toggle WhatsApp {whatsAppConnected ? "Off" : "On"}
      </button>
    </div>
  );
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Track your expenses and get insights to save more.</p>
        </div>
        
        {/* AI-powered prompt input at the top */}
        <AIPromptInput 
          onTransactionAdded={fetchData}
          onSavingAdded={fetchData}
        />
        
        {/* Filter Bar */}
        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={expenseCategories}
          onResetFilters={handleResetFilters}
        />
        
        {/* Transactions Table */}
        <div className="mb-8">
          <TransactionsTable 
            transactions={filteredTransactions}
            filters={{
              category: filters.category,
              type: filters.type,
              dateRange: filters.dateRange,
              minAmount: filters.minAmount,
              maxAmount: filters.maxAmount
            }}
            onTransactionUpdated={fetchData}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : hasTransactions ? (
              <FinancialDashboard expenses={filteredTransactions} />
            ) : (
              <EmptyDashboard />
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <SavingGoals 
                savingGoals={savingGoals}
                onGoalAdded={fetchData}
                onGoalUpdated={fetchData}
              />
            </div>
            
            {/* Onboarding Panel for new users - moved to sidebar */}
            {showOnboarding && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 relative">
                <button 
                  onClick={() => setShowOnboarding(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
                <OnboardingPanel whatsAppConnected={whatsAppConnected} />
              </div>
            )}
          </div>
        </div>
      </main>
      
      {renderDevControls()}
    </div>
  );
};

export default Index;
