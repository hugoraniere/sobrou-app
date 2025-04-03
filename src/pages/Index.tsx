
import React, { useState } from 'react';
import Header from '../components/Header';
import { ExpenseTable } from '../components/ExpenseTable';
import { FinancialDashboard } from '../components/FinancialDashboard';
import { ExpenseFilters } from '../components/ExpenseFilters';
import { SavingSuggestions } from '../components/SavingSuggestions';
import LandingPage from '../components/LandingPage';
import OnboardingPanel from '../components/OnboardingPanel';
import ManualEntryForm from '../components/ManualEntryForm';
import EmptyDashboard from '../components/EmptyDashboard';

// Mock data for development
const mockExpenses = [
  {
    id: '1',
    date: '2023-04-01',
    amount: 50,
    category: 'Food',
    description: 'Grocery shopping'
  },
  {
    id: '2',
    date: '2023-04-02',
    amount: 1200,
    category: 'Housing',
    description: 'Rent'
  },
  {
    id: '3',
    date: '2023-04-03',
    amount: 25,
    category: 'Transportation',
    description: 'Uber ride'
  },
  {
    id: '4',
    date: '2023-04-05',
    amount: 15,
    category: 'Entertainment',
    description: 'Movie ticket'
  },
  {
    id: '5',
    date: '2023-04-08',
    amount: 35,
    category: 'Food',
    description: 'Restaurant'
  }
];

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
  { value: 'Personal', label: 'Personal' },
  { value: 'Other', label: 'Other' }
];

const Index = () => {
  // In a real app, we would get these states from user context/auth
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [whatsAppConnected, setWhatsAppConnected] = useState(false);
  
  // For demo purposes, we'll use local state to store expenses
  const [expenses, setExpenses] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState({
    timeRange: 'all',
    category: 'all',
    minAmount: '',
    maxAmount: ''
  });

  // Add a new expense from manual entry
  const handleExpenseAdded = (newExpense: any) => {
    setExpenses(prev => [...prev, newExpense]);
  };

  // For demo purposes, toggle states
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);
  const toggleWhatsApp = () => setWhatsAppConnected(!whatsAppConnected);

  // Function to filter expenses based on active filters
  const getFilteredExpenses = () => {
    return expenses.filter(expense => {
      // Filter by category
      if (activeFilter.category !== 'all' && expense.category !== activeFilter.category) {
        return false;
      }
      
      // Filter by amount range
      if (activeFilter.minAmount && expense.amount < parseFloat(activeFilter.minAmount)) {
        return false;
      }
      
      if (activeFilter.maxAmount && expense.amount > parseFloat(activeFilter.maxAmount)) {
        return false;
      }
      
      // Filter by time range
      if (activeFilter.timeRange !== 'all') {
        const expenseDate = new Date(expense.date);
        const today = new Date();
        
        switch (activeFilter.timeRange) {
          case 'today':
            return expenseDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return expenseDate >= weekAgo;
          case 'month':
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return expenseDate >= monthAgo;
          default:
            return true;
        }
      }
      
      return true;
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const hasExpenses = expenses.length > 0;

  // For development purposes, render a small control panel
  const renderDevControls = () => (
    <div className="bg-gray-100 p-2 text-xs fixed bottom-0 right-0 z-50">
      <button onClick={toggleLogin} className="mr-2 bg-gray-200 px-2 py-1 rounded">
        Toggle {isLoggedIn ? "Logout" : "Login"}
      </button>
      <button onClick={toggleWhatsApp} className="bg-gray-200 px-2 py-1 rounded">
        Toggle WhatsApp {whatsAppConnected ? "Off" : "On"}
      </button>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LandingPage />
        {renderDevControls()}
      </div>
    );
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

        {/* Manual Entry Form for users to try out */}
        <ManualEntryForm onExpenseAdded={handleExpenseAdded} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {hasExpenses ? (
              <FinancialDashboard expenses={filteredExpenses} />
            ) : (
              <EmptyDashboard />
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <SavingSuggestions expenses={filteredExpenses} />
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Your Expenses</h2>
            </div>
            
            <ExpenseFilters 
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter} 
              categories={expenseCategories}
            />
            
            <ExpenseTable expenses={filteredExpenses} />
          </div>
        </div>
      </main>
      {renderDevControls()}
    </div>
  );
};

export default Index;
