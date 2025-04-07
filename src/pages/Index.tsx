
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardContent from '../components/dashboard/DashboardContent';
import DeveloperControls from '../components/dashboard/DeveloperControls';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { useDashboardData } from '../hooks/useDashboardData';

// Categories with icons
export const expenseCategories = [
  'Food', 'Housing', 'Transportation', 'Entertainment', 'Shopping', 
  'Utilities', 'Health', 'Education', 'Income', 'Savings', 'Other'
];

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  const {
    transactions,
    savingGoals,
    isLoading,
    whatsAppConnected,
    showOnboarding,
    setShowOnboarding,
    fetchData,
    toggleWhatsApp,
    hasTransactions
  } = useDashboardData();
  
  const {
    filters,
    handleFilterChange,
    handleResetFilters,
    filteredTransactions
  } = useFilteredTransactions(transactions);
  
  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <>
      <DashboardLayout
        whatsAppConnected={whatsAppConnected}
        showOnboarding={showOnboarding}
        setShowOnboarding={setShowOnboarding}
        filters={filters}
        handleFilterChange={handleFilterChange}
        handleResetFilters={handleResetFilters}
        categories={expenseCategories}
        onTransactionAdded={fetchData}
        onSavingAdded={fetchData}
      >
        <DashboardContent
          transactions={transactions}
          filteredTransactions={filteredTransactions}
          savingGoals={savingGoals}
          filters={filters}
          isLoading={isLoading}
          hasTransactions={hasTransactions}
          onTransactionUpdated={fetchData}
          showOnboarding={showOnboarding}
          setShowOnboarding={setShowOnboarding}
          whatsAppConnected={whatsAppConnected}
          onSavingGoalAdded={fetchData}
          onSavingGoalUpdated={fetchData}
        />
      </DashboardLayout>
      
      <DeveloperControls 
        whatsAppConnected={whatsAppConnected}
        toggleWhatsApp={toggleWhatsApp}
      />
    </>
  );
};

export default Index;
