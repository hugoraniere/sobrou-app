
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { ExpenseTable } from '../components/ExpenseTable';
import { FinancialDashboard } from '../components/FinancialDashboard';
import { ExpenseFilters } from '../components/ExpenseFilters';
import { SavingSuggestions } from '../components/SavingSuggestions';
import OnboardingPanel from '../components/OnboardingPanel';
import AIPromptInput from '../components/AIPromptInput';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { TransactionService, Transaction } from '../services/TransactionService';
import { SavingsService, SavingGoal } from '../services/SavingsService';
import TransactionsTable from '../components/TransactionsTable';
import SavingGoals from '../components/SavingGoals';
import EmptyDashboard from '../components/EmptyDashboard';

// Categories with icons
export const expenseCategories = [
  { value: 'Food', label: 'Food' },
  { value: 'Housing', label: 'Housing' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Health', label: 'Health' },
  { value: 'Education', label: 'Education' },
  { value: 'Income', label: 'Income' },
  { value: 'Savings', label: 'Savings' },
  { value: 'Other', label: 'Other' }
];

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // In a real app, we would get WhatsApp connection status from user data
  const [whatsAppConnected, setWhatsAppConnected] = useState(false);
  
  // State for transactions and saving goals
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingGoals, setSavingGoals] = useState<SavingGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters state
  const [activeFilter, setActiveFilter] = useState({
    timeRange: 'all',
    category: 'all',
    minAmount: '',
    maxAmount: ''
  });
  
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
      if (activeFilter.timeRange !== 'all') {
        const transactionDate = new Date(transaction.date);
        const today = new Date();
        
        switch (activeFilter.timeRange) {
          case 'today':
            return transactionDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return transactionDate >= weekAgo;
          case 'month':
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return transactionDate >= monthAgo;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Track your expenses and get insights to save more.</p>
        </div>
        
        {/* Onboarding Panel for new users */}
        <OnboardingPanel whatsAppConnected={whatsAppConnected} />
        
        {/* AI-powered prompt input */}
        <AIPromptInput 
          onTransactionAdded={fetchData}
          onSavingAdded={fetchData}
        />
        
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
          
          <div className="bg-white p-4 rounded-lg shadow">
            <SavingGoals 
              savingGoals={savingGoals}
              onGoalAdded={fetchData}
              onGoalUpdated={fetchData}
            />
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Transactions</h2>
            </div>
            
            <ExpenseFilters 
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter} 
              categories={expenseCategories}
            />
            
            {hasTransactions ? (
              <TransactionsTable 
                transactions={filteredTransactions}
                filters={{
                  category: activeFilter.category,
                  type: 'all', // Default to showing all types
                  dateRange: activeFilter.timeRange,
                  minAmount: activeFilter.minAmount,
                  maxAmount: activeFilter.maxAmount
                }}
              />
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No transactions found.</p>
                <p className="text-sm mt-2">Start by adding a transaction using the input above.</p>
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
