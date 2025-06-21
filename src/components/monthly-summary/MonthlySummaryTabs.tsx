
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthlyTable } from './MonthlyTable';
import { PlanningTable } from './PlanningTable';
import { ComparativeTable } from './ComparativeTable';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface MonthlySummaryTabsProps {
  year: number;
}

export const MonthlySummaryTabs: React.FC<MonthlySummaryTabsProps> = ({ year }) => {
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState('table');
  
  // Estado global para o toggle de visão detalhada/simples
  const [isDetailedView, setIsDetailedView] = useState(() => {
    const stored = localStorage.getItem('planningViewMode');
    return stored ? JSON.parse(stored) : false; // Por padrão, visão simples
  });

  // Salvar preferência no localStorage
  useEffect(() => {
    localStorage.setItem('planningViewMode', JSON.stringify(isDetailedView));
  }, [isDetailedView]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-[330px]">
      <TabsList className="w-full max-w-[330px] mb-2 grid grid-cols-3 h-8 p-1">
        <TabsTrigger 
          value="table" 
          className="flex items-center justify-center flex-1 text-center text-xs px-2 py-1 min-w-0"
        >
          <span className="truncate">Gastos</span>
        </TabsTrigger>
        <TabsTrigger 
          value="planning" 
          className="flex items-center justify-center flex-1 text-center text-xs px-2 py-1 min-w-0"
        >
          <span className="truncate">Plano</span>
        </TabsTrigger>
        <TabsTrigger 
          value="comparative" 
          className="flex items-center justify-center flex-1 text-center text-xs px-2 py-1 min-w-0"
        >
          <span className="truncate">Comp.</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="table" className="mt-0 w-full max-w-[330px]">
        <MonthlyTable year={year} />
      </TabsContent>

      <TabsContent value="planning" className="mt-0 w-full max-w-[330px]">
        <PlanningTable 
          year={year} 
          isDetailedView={isDetailedView}
          onToggleView={setIsDetailedView}
        />
      </TabsContent>

      <TabsContent value="comparative" className="mt-0 w-full max-w-[330px]">
        <ComparativeTable 
          year={year} 
          isDetailedView={isDetailedView}
        />
      </TabsContent>
    </Tabs>
  );
};
