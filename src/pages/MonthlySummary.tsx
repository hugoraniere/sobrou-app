
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { YearSelector } from '@/components/monthly-summary/YearSelector';
import { MonthlySummaryTabs } from '@/components/monthly-summary/MonthlySummaryTabs';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';

const MonthlySummary = () => {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <ResponsivePageContainer className="pb-10">
      <ResponsivePageHeader 
        title={t('monthlySummary.title')}
        description={t('monthlySummary.subtitle')}
      >
        <YearSelector currentYear={selectedYear} onYearChange={setSelectedYear} />
      </ResponsivePageHeader>

      <div className="space-y-6">
        <MonthlySummaryTabs year={selectedYear} />
      </div>
    </ResponsivePageContainer>
  );
};

export default MonthlySummary;
