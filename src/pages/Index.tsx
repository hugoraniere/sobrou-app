
import React, { useState } from 'react';
import Header from '../components/Header';
import { ExpenseTable } from '../components/ExpenseTable';
import { FinancialDashboard } from '../components/FinancialDashboard';
import { ExpenseFilters } from '../components/ExpenseFilters';
import { SavingSuggestions } from '../components/SavingSuggestions';

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
  const [expenses, setExpenses] = useState(mockExpenses);
  const [activeFilter, setActiveFilter] = useState({
    timeRange: 'all',
    category: 'all',
    minAmount: '',
    maxAmount: ''
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Track your expenses and get insights to save more.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FinancialDashboard expenses={filteredExpenses} />
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
    </div>
  );
};

export default Index;
