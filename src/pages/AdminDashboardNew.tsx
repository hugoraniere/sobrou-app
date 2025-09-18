import React, { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardDateProvider } from '@/contexts/DashboardDateProvider';
import { PeriodSelector } from '@/components/dashboard/widgets/PeriodSelector';

// Lazy load dashboard tabs for better performance
const OverviewTab = lazy(() => import('@/components/dashboard/tabs/OverviewTab').then(m => ({ default: m.OverviewTab })));
const UsersAuthTab = lazy(() => import('@/components/dashboard/tabs/UsersAuthTab').then(m => ({ default: m.UsersAuthTab })));
const ProductUsageTab = lazy(() => import('@/components/dashboard/tabs/ProductUsageTab').then(m => ({ default: m.ProductUsageTab })));
const SupportTab = lazy(() => import('@/components/dashboard/tabs/SupportTab').then(m => ({ default: m.SupportTab })));
const ContentBlogTab = lazy(() => import('@/components/dashboard/tabs/ContentBlogTab').then(m => ({ default: m.ContentBlogTab })));

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
                  <Suspense fallback={<div className="flex items-center justify-center p-8">Carregando...</div>}>
                    <Component />
                  </Suspense>
                </TabsContent>
              );
            })}
          </Tabs>
        </main>
      </div>
    </DashboardDateProvider>
  );
}