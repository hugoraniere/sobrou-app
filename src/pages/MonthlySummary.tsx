
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { YearSelector } from '@/components/monthly-summary/YearSelector';
import { MonthlySummaryTabs } from '@/components/monthly-summary/MonthlySummaryTabs';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';
import { useResponsive } from '@/hooks/useResponsive';
import { budgetService } from '@/services/budgetService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MonthlySummary = () => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // M6: Migração de dados do localStorage para Supabase
  useEffect(() => {
    const migrateLocalStorageToSupabase = async () => {
      try {
        const migrated = localStorage.getItem('budgets-migrated-v2');
        if (migrated) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Buscar dados do planejamento detalhado do localStorage
        const oldPlanningData = localStorage.getItem('monthly-planning');
        if (!oldPlanningData) {
          localStorage.setItem('budgets-migrated-v2', 'true');
          return;
        }

        const planningData = JSON.parse(oldPlanningData);
        const budgetsToCreate: any[] = [];

        // Converter dados do planejamento detalhado para formato de budgets
        ['revenue', 'essentialExpenses', 'nonEssentialExpenses', 'reserves'].forEach(section => {
          const categories = planningData[section] || [];
          categories.forEach((category: any) => {
            if (category.values && Array.isArray(category.values)) {
              category.values.forEach((value: number, monthIndex: number) => {
                if (value > 0) {
                  budgetsToCreate.push({
                    user_id: user.id,
                    year: planningData.year || selectedYear,
                    month: monthIndex + 1,
                    category: category.id,
                    amount: value,
                    created_at: new Date().toISOString(),
                  });
                }
              });
            }
          });
        });

        if (budgetsToCreate.length > 0) {
          await budgetService.bulkUpsert(budgetsToCreate);
          toast.success('Dados do planejamento migrados com sucesso!');
        }

        localStorage.setItem('budgets-migrated-v2', 'true');
      } catch (error) {
        console.error('Erro na migração de dados:', error);
      }
    };

    migrateLocalStorageToSupabase();
  }, [selectedYear]);

  return (
    <ResponsivePageContainer className={`pb-10 ${isMobile ? 'overflow-x-hidden' : ''}`}>
      <ResponsivePageHeader 
        title={t('monthlySummary.title')}
        description={t('monthlySummary.subtitle')}
        stackOnMobile={true}
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
