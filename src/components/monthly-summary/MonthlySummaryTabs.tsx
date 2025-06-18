
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthlyTable } from './MonthlyTable';
import { PlanningTable } from './PlanningTable';
import { ComparativeTable } from './ComparativeTable';
import { Calculator, FileText, BarChart3 } from 'lucide-react';

interface MonthlySummaryTabsProps {
  year: number;
}

export const MonthlySummaryTabs: React.FC<MonthlySummaryTabsProps> = ({ year }) => {
  const [activeTab, setActiveTab] = useState('table');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="table" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Tabela
        </TabsTrigger>
        <TabsTrigger value="planning" className="flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Planejamento
        </TabsTrigger>
        <TabsTrigger value="comparative" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Comparativo
        </TabsTrigger>
      </TabsList>

      <TabsContent value="table" className="mt-0">
        <MonthlyTable year={year} />
      </TabsContent>

      <TabsContent value="planning" className="mt-0">
        <PlanningTable year={year} />
      </TabsContent>

      <TabsContent value="comparative" className="mt-0">
        <ComparativeTable year={year} />
      </TabsContent>
    </Tabs>
  );
};
