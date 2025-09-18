import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardDateProvider } from '@/contexts/DashboardDateProvider';
import { PeriodSelector } from '@/components/dashboard/widgets/PeriodSelector';
import { OverviewTab } from '@/components/dashboard/tabs/OverviewTab';
import { UsersAuthTab } from '@/components/dashboard/tabs/UsersAuthTab';
import { ProductUsageTab } from '@/components/dashboard/tabs/ProductUsageTab';
import { SupportTab } from '@/components/dashboard/tabs/SupportTab';
import { ContentBlogTab } from '@/components/dashboard/tabs/ContentBlogTab';

const TABS = [
  { value: 'overview', label: 'Visão Geral', component: OverviewTab },
  { value: 'users', label: 'Usuários & Autenticação', component: UsersAuthTab },
  { value: 'usage', label: 'Uso do Produto', component: ProductUsageTab },
  { value: 'support', label: 'Suporte', component: SupportTab },
  { value: 'content', label: 'Conteúdo/Blog', component: ContentBlogTab }
];

export default function AdminDashboardNew() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const handleTabChange = (tab: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tab);
    setSearchParams(newParams);
  };

  return (
    <DashboardDateProvider>
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background">
        <main className="w-full px-4 md:px-8 py-6 md:py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
            <p className="text-muted-foreground">
              Análise completa de dados com métricas reais e comparação temporal
            </p>
          </div>

          <PeriodSelector />

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              {TABS.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="text-xs sm:text-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {TABS.map((tab) => {
              const Component = tab.component;
              return (
                <TabsContent key={tab.value} value={tab.value}>
                  <Component />
                </TabsContent>
              );
            })}
          </Tabs>
        </main>
      </div>
    </DashboardDateProvider>
  );
}