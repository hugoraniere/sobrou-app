
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthlyTable } from './MonthlyTable';
import { PlanningTable } from './PlanningTable';
import { ComparativeTable } from './ComparativeTable';
import { Calculator, FileText, BarChart3 } from 'lucide-react';
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
    <div className="w-full max-w-none overflow-x-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={cn(
          "w-full mb-4 grid grid-cols-3",
          isMobile ? "h-9 p-0.5" : "h-10"
        )}>
          <TabsTrigger 
            value="table" 
            className={cn(
              "flex items-center gap-1 flex-1 text-center",
              isMobile ? "text-[10px] px-1 py-1.5 min-w-0" : "text-sm gap-2"
            )}
          >
            <FileText className={cn(isMobile ? "h-3 w-3 shrink-0" : "h-4 w-4")} />
            <span className={cn(isMobile && "truncate")}>
              {isMobile ? "Gastos" : "Gastos Mensais"}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="planning" 
            className={cn(
              "flex items-center gap-1 flex-1 text-center",
              isMobile ? "text-[10px] px-1 py-1.5 min-w-0" : "text-sm gap-2"
            )}
          >
            <Calculator className={cn(isMobile ? "h-3 w-3 shrink-0" : "h-4 w-4")} />
            <span className={cn(isMobile && "truncate")}>
              {isMobile ? "Plano" : "Planejamento"}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="comparative" 
            className={cn(
              "flex items-center gap-1 flex-1 text-center",
              isMobile ? "text-[10px] px-1 py-1.5 min-w-0" : "text-sm gap-2"
            )}
          >
            <BarChart3 className={cn(isMobile ? "h-3 w-3 shrink-0" : "h-4 w-4")} />
            <span className={cn(isMobile && "truncate")}>
              {isMobile ? "Comp." : "Comparativo"}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-0">
          <MonthlyTable year={year} />
        </TabsContent>

        <TabsContent value="planning" className="mt-0">
          <PlanningTable 
            year={year} 
            isDetailedView={isDetailedView}
            onToggleView={setIsDetailedView}
          />
        </TabsContent>

        <TabsContent value="comparative" className="mt-0">
          <ComparativeTable 
            year={year} 
            isDetailedView={isDetailedView}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
