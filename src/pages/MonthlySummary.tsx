
import React, { useState } from 'react';
import { YearSelector } from '@/components/monthly-summary/YearSelector';
import { MonthlySummaryTabs } from '@/components/monthly-summary/MonthlySummaryTabs';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';

const MonthlySummary = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <ResponsivePageContainer className="pb-10">
      <ResponsivePageHeader 
        title="Resumo Mensal"
        description="Visualize, planeje e compare seu orçamento financeiro"
      >
        <YearSelector currentYear={selectedYear} onYearChange={setSelectedYear} />
      </ResponsivePageHeader>

      {/* Tabs com tabela integrada */}
      <MonthlySummaryTabs year={selectedYear} />
    </ResponsivePageContainer>
  );
};

export default MonthlySummary;
