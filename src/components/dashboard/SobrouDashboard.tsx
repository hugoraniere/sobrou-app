import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Activity, 
  ShoppingCart, 
  Receipt, 
  Eye, 
  MessageCircle, 
  Share, 
  TrendingUp,
  Calendar,
  ChefHat,
  AlertCircle
} from 'lucide-react';
import { AdminAnalyticsService, ActiveUsersData, RetentionCohort, AppInteractionTotals, BlogViewsData } from '@/services/adminAnalyticsService';
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { PeriodSelector, AdminPeriodOption, getPeriodDays } from '@/components/admin/PeriodSelector';
import { Alert, AlertDescription } from "@/components/ui/alert";
import UserMetricsBigNumbers from './UserMetricsBigNumbers';
import BlogPostAnalytics from './BlogPostAnalytics';

const ADMIN_PERIOD_OPTIONS: Array<{ value: AdminPeriodOption; label: string }> = [
  { value: '7-days', label: 'Últimos 7 dias' },
  { value: '30-days', label: 'Últimos 30 dias' },
  { value: '90-days', label: 'Últimos 90 dias' },
  { value: '1-year', label: 'Último ano' }
];

const SobrouDashboard: React.FC = React.memo(() => {
  const [activeUsersData, setActiveUsersData] = useState<ActiveUsersData[]>([]);
  const [retentionData, setRetentionData] = useState<RetentionCohort[]>([]);
  const [appTotals, setAppTotals] = useState<AppInteractionTotals>({
    total_saved_dishes: 0,
    total_shopping_lists: 0,
    total_transactions: 0
  });
  const [blogViewsData, setBlogViewsData] = useState<BlogViewsData[]>([]);
  const [blogEngagement, setBlogEngagement] = useState({ total_comments: 0, total_shares: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<AdminPeriodOption>('30-days');
  const [loadingErrors, setLoadingErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadingErrors({});
      const periodDays = getPeriodDays(selectedPeriod);
      const weeksBack = Math.ceil(periodDays / 7);

      // Load data with individual error handling
      const results = await Promise.allSettled([
        AdminAnalyticsService.getActiveUsersStats(periodDays),
        AdminAnalyticsService.getRetentionCohorts(weeksBack),
        AdminAnalyticsService.getAppInteractionTotals(),
        AdminAnalyticsService.getBlogViewsOverTime(periodDays),
        AdminAnalyticsService.getBlogEngagementStats()
      ]);

      const errors: Record<string, string> = {};

      // Process active users data
      if (results[0].status === 'fulfilled') {
        setActiveUsersData(results[0].value);
      } else {
        errors.activeUsers = 'Falha ao carregar dados de usuários ativos';
        console.error('Active users error:', results[0].reason);
      }

      // Process retention data
      if (results[1].status === 'fulfilled') {
        setRetentionData(results[1].value);
      } else {
        errors.retention = 'Falha ao carregar dados de retenção';
        console.error('Retention error:', results[1].reason);
      }

      // Process app totals
      if (results[2].status === 'fulfilled') {
        setAppTotals(results[2].value);
      } else {
        errors.appTotals = 'Falha ao carregar totais do app';
        console.error('App totals error:', results[2].reason);
      }

      // Process blog views
      if (results[3].status === 'fulfilled') {
        setBlogViewsData(results[3].value);
      } else {
        errors.blogViews = 'Falha ao carregar visualizações do blog';
        console.error('Blog views error:', results[3].reason);
      }

      // Process blog engagement
      if (results[4].status === 'fulfilled') {
        setBlogEngagement(results[4].value);
      } else {
        errors.blogEngagement = 'Falha ao carregar engajamento do blog';
        console.error('Blog engagement error:', results[4].reason);
      }

      setLoadingErrors(errors);

      // Show toast only if all requests failed
      if (Object.keys(errors).length === 5) {
        toast({
          message: "Falha ao carregar todos os dados do dashboard"
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        message: "Erro inesperado ao carregar dados do dashboard"
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod, toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const chartConfig = {
    daily_active_users: {
      label: "Usuários Ativos Diários",
      color: "hsl(var(--primary))",
    },
    weekly_active_users: {
      label: "Usuários Ativos Semanais",
      color: "hsl(var(--secondary))",
    },
    views_count: {
      label: "Visualizações",
      color: "hsl(var(--accent))",
    },
  };

  const formatRetentionPercentage = (value: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard do Sobrou</h2>
          <p className="text-muted-foreground">Visão geral das métricas do aplicativo e do blog</p>
        </div>
        <PeriodSelector 
          value={selectedPeriod} 
          onValueChange={setSelectedPeriod}
        />
      </div>

      {/* Show loading errors if any */}
      {Object.keys(loadingErrors).length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Algumas métricas falharam ao carregar: {Object.values(loadingErrors).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="blog">Analytics Blog</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* User Metrics Big Numbers */}
          <UserMetricsBigNumbers />

          {/* Key Interactions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receitas Salvas</CardTitle>
                <ChefHat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appTotals.total_saved_dishes.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Listas de Compras</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appTotals.total_shopping_lists.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appTotals.total_transactions.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Blog Engagement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Comentários</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blogEngagement.total_comments.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Compartilhamentos</CardTitle>
                <Share className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blogEngagement.total_shares.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Métricas de Usuários do App</h3>
            
            {/* Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Usuários Ativos ({getPeriodDays(selectedPeriod)} dias)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingErrors.activeUsers ? (
                  <div className="text-center py-8 text-red-600">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>{loadingErrors.activeUsers}</p>
                  </div>
                ) : activeUsersData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activeUsersData}>
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="daily_active_users" 
                          stroke="var(--color-daily_active_users)" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="weekly_active_users" 
                          stroke="var(--color-weekly_active_users)" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Nenhum dado de atividade disponível</p>
                )}
              </CardContent>
            </Card>

            {/* Retention Cohorts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Retenção de Usuários (Coortes Semanais)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingErrors.retention ? (
                  <div className="text-center py-8 text-red-600">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>{loadingErrors.retention}</p>
                  </div>
                ) : retentionData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Coorte</th>
                          <th className="text-center p-2">Usuários</th>
                          <th className="text-center p-2">Semana 0</th>
                          <th className="text-center p-2">Semana 1</th>
                          <th className="text-center p-2">Semana 2</th>
                          <th className="text-center p-2">Semana 3</th>
                          <th className="text-center p-2">Semana 4</th>
                        </tr>
                      </thead>
                      <tbody>
                        {retentionData.map((cohort) => (
                          <tr key={cohort.cohort_week} className="border-b">
                            <td className="p-2">{new Date(cohort.cohort_week).toLocaleDateString('pt-BR')}</td>
                            <td className="text-center p-2">{cohort.users_count}</td>
                            <td className="text-center p-2 bg-primary/10">100%</td>
                            <td className="text-center p-2">{formatRetentionPercentage(cohort.week_1, cohort.users_count)}</td>
                            <td className="text-center p-2">{formatRetentionPercentage(cohort.week_2, cohort.users_count)}</td>
                            <td className="text-center p-2">{formatRetentionPercentage(cohort.week_3, cohort.users_count)}</td>
                            <td className="text-center p-2">{formatRetentionPercentage(cohort.week_4, cohort.users_count)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Dados de retenção insuficientes</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blog Traffic Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Visualizações do Blog ({getPeriodDays(selectedPeriod)} dias)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingErrors.blogViews ? (
                  <div className="text-center py-8 text-red-600">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>{loadingErrors.blogViews}</p>
                  </div>
                ) : blogViewsData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={blogViewsData}>
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="views_count" 
                          fill="var(--color-views_count)" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Nenhum dado de visualizações disponível</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="blog" className="space-y-6">
          <BlogPostAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
});

SobrouDashboard.displayName = 'SobrouDashboard';

export default SobrouDashboard;