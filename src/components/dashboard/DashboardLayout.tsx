
import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import AIPromptInput from '../AIPromptInput';
import OnboardingPanel from '../OnboardingPanel';
import FilterBar from '../FilterBar';
import { X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  whatsAppConnected: boolean;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  filters: {
    dateRange: string;
    category: string;
    type: string;
    minAmount: string;
    maxAmount: string;
  };
  handleFilterChange: (key: string, value: string) => void;
  handleResetFilters: () => void;
  categories: string[];
  onTransactionAdded: () => void;
  onSavingAdded: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  whatsAppConnected,
  showOnboarding,
  setShowOnboarding,
  filters,
  handleFilterChange,
  handleResetFilters,
  categories,
  onTransactionAdded,
  onSavingAdded
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
          <p className="text-gray-600">{t('dashboard.subtitle')}</p>
        </div>
        
        {/* AI-powered prompt input at the top */}
        <AIPromptInput 
          onTransactionAdded={onTransactionAdded}
          onSavingAdded={onSavingAdded}
        />
        
        {/* Filter Bar */}
        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
          onResetFilters={handleResetFilters}
        />
        
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
