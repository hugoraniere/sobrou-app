
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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

  // M6: Toggle para usar data de competência (MEI) ou data de pagamento
  const [useCompetenceDate, setUseCompetenceDate] = useState(() => {
    const stored = localStorage.getItem('useCompetenceDate');
    return stored ? JSON.parse(stored) : false;
  });

  // Salvar preferência no localStorage
  useEffect(() => {
    localStorage.setItem('planningViewMode', JSON.stringify(isDetailedView));
  }, [isDetailedView]);

  useEffect(() => {
    localStorage.setItem('useCompetenceDate', JSON.stringify(useCompetenceDate));
  }, [useCompetenceDate]);

  return (
    <div className={cn("w-full", isMobile && "max-w-full overflow-x-hidden")}>
      {/* M6: Toggle Competência vs Pagamento */}
      <div className="mb-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Switch
          id="competence-toggle"
          checked={useCompetenceDate}
          onCheckedChange={setUseCompetenceDate}
        />
        <div className="flex-1">
          <Label htmlFor="competence-toggle" className="font-medium text-sm cursor-pointer">
            Usar data de competência (MEI)
          </Label>
          <p className="text-xs text-gray-500 mt-0.5">
            Por padrão: data de pagamento. Com competência: considera quando o serviço foi prestado.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={cn(
          "w-full mb-4 flex",
          isMobile ? "h-9 p-0.5 max-w-full overflow-hidden" : "h-10"
        )} data-tour-id="monthly-summary.tabs.navigation">
          <TabsTrigger 
            value="table" 
            className={cn(
              "flex items-center justify-center text-center text-sm",
              "!whitespace-normal truncate", // Override whitespace-nowrap
              isMobile ? "flex-1 basis-1/3 min-w-0 px-1 py-1.5" : "flex-1"
            )}
            data-tour-id="monthly-summary.tabs.monthly-expenses"
          >
            <span className="truncate">
              {isMobile ? "Gastos" : "Gastos Mensais"}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="planning" 
            className={cn(
              "flex items-center justify-center text-center text-sm",
              "!whitespace-normal truncate", // Override whitespace-nowrap
              isMobile ? "flex-1 basis-1/3 min-w-0 px-1 py-1.5" : "flex-1"
            )}
            data-tour-id="monthly-summary.tabs.planning"
          >
            <span className="truncate">
              {isMobile ? "Plano" : "Planejamento"}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="comparative" 
            className={cn(
              "flex items-center justify-center text-center text-sm",
              "!whitespace-normal truncate", // Override whitespace-nowrap
              isMobile ? "flex-1 basis-1/3 min-w-0 px-1 py-1.5" : "flex-1"
            )}
            data-tour-id="monthly-summary.tabs.comparative"
          >
            <span className="truncate">
              {isMobile ? "Comp." : "Comparativo"}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-0">
          <div className={cn("bg-white rounded-lg border p-4", isMobile && "w-full max-w-full")} data-tour-id="monthly-summary.data.monthly-table">
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
