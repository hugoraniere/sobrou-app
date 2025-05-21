
import React from 'react';
import { Transaction } from '@/services/transactions';
import { SavingGoal } from '@/services/SavingsService';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardOverviewProps {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
}

// Componente simplificado pois toda lógica foi movida para o DashboardContent
const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  transactions,
  savingGoals
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`px-${isMobile ? '4' : '0'}`}>
      {/* Conteúdo do DashboardOverview foi movido para DashboardContent */}
      <p className="text-gray-500 text-sm italic">
        Conteúdo reorganizado no Dashboard principal.
      </p>
    </div>
  );
};

export default DashboardOverview;
