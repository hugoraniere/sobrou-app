import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ChefHat
} from 'lucide-react';
import { AdminAnalyticsService, ActiveUsersData, RetentionCohort, AppInteractionTotals, BlogViewsData } from '@/services/adminAnalyticsService';
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SobrouDashboard: React.FC = () => {
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
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [activeUsers, retention, totals, blogViews, engagement] = await Promise.all([
        AdminAnalyticsService.getActiveUsersStats(30),
        AdminAnalyticsService.getRetentionCohorts(8),
        AdminAnalyticsService.getAppInteractionTotals(),
        AdminAnalyticsService.getBlogViewsOverTime(30),
        AdminAnalyticsService.getBlogEngagementStats()
      ]);

      setActiveUsersData(activeUsers);
      setRetentionData(retention);
      setAppTotals(totals);
      setBlogViewsData(blogViews);
      setBlogEngagement(engagement);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        message: "Falha ao carregar dados do dashboard"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <div>
        <h2 className="text-2xl font-bold">Dashboard do Sobrou</h2>
        <p className="text-muted-foreground">Visão geral das métricas do aplicativo e do blog</p>
      </div>

      {/* App User Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Métricas de Usuários do App</h3>
        
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

        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Usuários Ativos (Últimos 30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeUsersData.length > 0 ? (
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
            {retentionData.length > 0 ? (
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

      {/* Blog Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Métricas do Blog</h3>
        
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

        {/* Blog Traffic Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Visualizações do Blog (Últimos 30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {blogViewsData.length > 0 ? (
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
    </div>
  );
};

export default SobrouDashboard;