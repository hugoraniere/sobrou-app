
import React from 'react';
import { useTranslation } from 'react-i18next';
import AIPromptInput from '../AIPromptInput';
import FilterBar from '../FilterBar';

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
  filters,
  handleFilterChange,
  handleResetFilters,
  categories,
  onTransactionAdded,
  onSavingAdded
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden">
      <main className="w-full px-4 md:px-8 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
          <p className="text-gray-600">{t('dashboard.subtitle')}</p>
        </div>
        
        {/* AI-powered prompt input at the top */}
        <AIPromptInput 
          onTransactionAdded={onTransactionAdded}
          onSavingAdded={onSavingAdded}
        />
        
        {/* Filter Bar - Only show on transactions tab */}
        <div id="filters-container" className="mt-6">
          <FilterBar 
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories}
            onResetFilters={handleResetFilters}
          />
        </div>
        
        <div className="mt-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
