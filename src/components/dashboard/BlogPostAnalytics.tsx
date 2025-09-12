import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeriodSelector, AdminPeriodOption, getPeriodDays } from '@/components/admin/PeriodSelector';
import BigNumberCard from './BigNumberCard';
import { Eye, Users, RotateCcw, TrendingDown, BarChart3, Clock, MousePointer } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface BlogPostStats {
  id: string;
  title: string;
  slug: string;
  views: number;
  unique_views: number;
  retention_rate: number;
  bounce_rate: number;
  avg_time_on_page: number;
}

interface BlogViewsOverTime {
  date: string;
  views: number;
  unique_views: number;
}

const BlogPostAnalytics: React.FC = () => {
  const [period, setPeriod] = useState<AdminPeriodOption>('30-days');
  const [isLoading, setIsLoading] = useState(true);
  const [topPosts, setTopPosts] = useState<BlogPostStats[]>([]);
  const [viewsOverTime, setViewsOverTime] = useState<BlogViewsOverTime[]>([]);
  const [totalMetrics, setTotalMetrics] = useState({
    total_views: 0,
    total_unique_views: 0,
    avg_retention: 0,
    avg_bounce_rate: 0,
  });

  const generateMockData = (days: number) => {
    // Mock data para posts mais acessados
    const mockPosts: BlogPostStats[] = [
      {
        id: '1',
        title: 'Como Organizar suas Finanças Pessoais',
        slug: 'organizar-financas-pessoais',
        views: Math.floor(Math.random() * 2000) + days * 5,
        unique_views: Math.floor(Math.random() * 1500) + days * 3,
        retention_rate: Math.floor(Math.random() * 40) + 45,
        bounce_rate: Math.floor(Math.random() * 30) + 25,
        avg_time_on_page: Math.floor(Math.random() * 180) + 120,
      },
      {
        id: '2',
        title: 'Investimentos para Iniciantes: Guia Completo',
        slug: 'investimentos-iniciantes-guia',
        views: Math.floor(Math.random() * 1800) + days * 4,
        unique_views: Math.floor(Math.random() * 1300) + days * 2,
        retention_rate: Math.floor(Math.random() * 35) + 50,
        bounce_rate: Math.floor(Math.random() * 35) + 20,
        avg_time_on_page: Math.floor(Math.random() * 200) + 140,
      },
      {
        id: '3',
        title: 'Dicas de Economia Doméstica',
        slug: 'dicas-economia-domestica',
        views: Math.floor(Math.random() * 1500) + days * 3,
        unique_views: Math.floor(Math.random() * 1100) + days * 2,
        retention_rate: Math.floor(Math.random() * 30) + 40,
        bounce_rate: Math.floor(Math.random() * 40) + 30,
        avg_time_on_page: Math.floor(Math.random() * 150) + 100,
      },
    ];

    // Mock data para visualizações ao longo do tempo
    const mockViewsOverTime: BlogViewsOverTime[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      mockViewsOverTime.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 200) + 50,
        unique_views: Math.floor(Math.random() * 150) + 30,
      });
    }

    const totalViews = mockViewsOverTime.reduce((sum, day) => sum + day.views, 0);
    const totalUniqueViews = mockViewsOverTime.reduce((sum, day) => sum + day.unique_views, 0);

    return {
      posts: mockPosts,
      viewsOverTime: mockViewsOverTime,
      totals: {
        total_views: totalViews,
        total_unique_views: totalUniqueViews,
        avg_retention: Math.floor(Math.random() * 20) + 55,
        avg_bounce_rate: Math.floor(Math.random() * 20) + 25,
      },
    };
  };

  const fetchBlogAnalytics = async () => {
    setIsLoading(true);
    try {
      const days = getPeriodDays(period);
      const mockData = generateMockData(days);
      
      setTopPosts(mockData.posts);
      setViewsOverTime(mockData.viewsOverTime);
      setTotalMetrics(mockData.totals);
    } catch (error) {
      console.error('Erro ao carregar analytics do blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogAnalytics();
  }, [period]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const chartConfig = {
    views: {
      label: 'Visualizações',
      color: 'hsl(var(--primary))',
    },
    unique_views: {
      label: 'Visualizações Únicas',
      color: 'hsl(var(--secondary))',
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics dos Posts do Blog</h2>
          <p className="text-muted-foreground">Métricas detalhadas de engagement e visualizações</p>
        </div>
        <PeriodSelector value={period} onValueChange={setPeriod} />
      </div>

      {/* Big Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BigNumberCard
          title="Total de Visualizações"
          value={totalMetrics.total_views}
          icon={Eye}
          color="hsl(var(--primary))"
          tooltip="Número total de visualizações de posts no período selecionado"
        />
        <BigNumberCard
          title="Visualizações Únicas"
          value={totalMetrics.total_unique_views}
          icon={Users}
          color="hsl(var(--secondary))"
          tooltip="Número de usuários únicos que visualizaram posts"
        />
        <BigNumberCard
          title="Retenção Média"
          value={totalMetrics.avg_retention}
          icon={RotateCcw}
          color="hsl(var(--accent))"
          tooltip="Porcentagem média de usuários que permaneceram na página"
          subtitle={`${totalMetrics.avg_retention}%`}
        />
        <BigNumberCard
          title="Taxa de Rejeição"
          value={totalMetrics.avg_bounce_rate}
          icon={TrendingDown}
          color="hsl(var(--destructive))"
          tooltip="Porcentagem média de usuários que saíram sem interagir"
          subtitle={`${totalMetrics.avg_bounce_rate}%`}
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Visualizações ao Longo do Tempo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="var(--color-views)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-views)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="unique_views" 
                  stroke="var(--color-unique_views)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-unique_views)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Posts Mais Acessados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                    <div>
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">/{post.slug}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">{post.views.toLocaleString()}</span>
                    </div>
                    <span className="text-muted-foreground">Visualizações</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{post.unique_views.toLocaleString()}</span>
                    </div>
                    <span className="text-muted-foreground">Únicos</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <RotateCcw className="h-4 w-4" />
                      <span className="font-medium">{post.retention_rate}%</span>
                    </div>
                    <span className="text-muted-foreground">Retenção</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{formatTime(post.avg_time_on_page)}</span>
                    </div>
                    <span className="text-muted-foreground">Tempo Médio</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <MousePointer className="h-4 w-4" />
                      <span className="font-medium">{post.bounce_rate}%</span>
                    </div>
                    <span className="text-muted-foreground">Rejeição</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPostAnalytics;