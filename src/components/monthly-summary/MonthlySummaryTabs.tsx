
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthlyTable } from './MonthlyTable';
import { PlanningTable } from './PlanningTable';
import { ComparativeTable } from './ComparativeTable';
import { useResponsive } from '@/hooks/useResponsive';
import { getTableScrollContainer } from '@/constants/tableStyles';
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
    <div className={cn("w-full", isMobile && "w-screen max-w-full overflow-hidden")}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={cn(
          "w-full mb-4 grid grid-cols-3",
          isMobile ? "h-9 p-0.5 max-w-full overflow-hidden" : "h-10"
        )}>
          <TabsTrigger 
            value="table" 
            className={cn(
              "flex items-center justify-center flex-1 text-center text-sm",
              "!whitespace-normal truncate", // Override whitespace-nowrap
              isMobile ? "px-1 py-1.5 min-w-0" : ""
            )}
          >
            <span className="truncate">
              {isMobile ? "Gastos" : "Gastos Mensais"}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="planning" 
            className={cn(
              "flex items-center justify-center flex-1 text-center text-sm",
              "!whitespace-normal truncate", // Override whitespace-nowrap
              isMobile ? "px-1 py-1.5 min-w-0" : ""
            )}
          >
            <span className="truncate">
              {isMobile ? "Plano" : "Planejamento"}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="comparative" 
            className={cn(
              "flex items-center justify-center flex-1 text-center text-sm",
              "!whitespace-normal truncate", // Override whitespace-nowrap
              isMobile ? "px-1 py-1.5 min-w-0" : ""
            )}
          >
            <span className="truncate">
              {isMobile ? "Comp." : "Comparativo"}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-0">
          <div className={cn("bg-white rounded-lg border p-4", isMobile && "w-full max-w-full")}>
            <div className={getTableScrollContainer(isMobile)}>
              <MonthlyTable year={year} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="planning" className="mt-0">
          <div className={cn("bg-white rounded-lg border p-4", isMobile && "w-full max-w-full")}>
            <div className={getTableScrollContainer(isMobile)}>
              <PlanningTable 
                year={year} 
                isDetailedView={isDetailedView}
                onToggleView={setIsDetailedView}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparative" className="mt-0">
          <div className={cn("bg-white rounded-lg border p-4", isMobile && "w-full max-w-full")}>
            <div className={getTableScrollContainer(isMobile)}>
              <ComparativeTable 
                year={year} 
                isDetailedView={isDetailedView}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
