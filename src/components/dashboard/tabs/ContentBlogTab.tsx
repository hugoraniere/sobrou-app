import React from 'react';
import { Eye, ThumbsUp, MessageCircle, TrendingUp, ExternalLink, AlertCircle } from 'lucide-react';
import { KpiCard } from '../widgets/KpiCard';
import { DataTable, TableColumn, TableAction } from '../widgets/DataTable';
import { useContentMetrics } from '@/hooks/useDashboardMetrics';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ContentBlogTab() {
  const contentMetrics = useContentMetrics();

  const blogPostColumns: TableColumn[] = [
    { 
      key: 'title', 
      label: 'Título do Post', 
      sortable: true,
      formatter: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    { 
      key: 'views', 
      label: 'Visualizações', 
      sortable: true,
      className: 'text-right',
      formatter: (value) => value.toLocaleString('pt-BR')
    },
    { 
      key: 'comments', 
      label: 'Comentários', 
      sortable: true,
      className: 'text-right'
    },
    { 
      key: 'likes', 
      label: 'Curtidas', 
      sortable: true,
      className: 'text-right'
    }
  ];

  const articlesColumns: TableColumn[] = [
    { 
      key: 'title', 
      label: 'Artigo de Suporte', 
      sortable: true,
      formatter: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    { 
      key: 'helpful_percentage', 
      label: 'Taxa "Ajudou"', 
      sortable: true,
      className: 'text-right',
      formatter: (value) => (
        <Badge variant={value >= 80 ? 'default' : value >= 60 ? 'secondary' : 'destructive'}>
          {value}%
        </Badge>
      )
    },
    { 
      key: 'total_votes', 
      label: 'Total de Votos', 
      sortable: true,
      className: 'text-right'
    }
  ];

  const blogActions: TableAction[] = [
    {
      label: 'Ver Post',
      icon: <ExternalLink className="h-3 w-3" />,
      onClick: (post) => console.log('View blog post:', post.id),
      variant: 'outline'
    }
  ];

  const articleActions: TableAction[] = [
    {
      label: 'Ver Artigo',
      icon: <ExternalLink className="h-3 w-3" />,
      onClick: (article) => console.log('View support article:', article.id),
      variant: 'outline'
    }
  ];

  // Calculate summary metrics
  const totalBlogViews = contentMetrics.data?.top_blog_posts?.reduce((sum, post) => sum + post.views, 0) || 0;
  const totalBlogComments = contentMetrics.data?.top_blog_posts?.reduce((sum, post) => sum + post.comments, 0) || 0;
  const totalBlogLikes = contentMetrics.data?.top_blog_posts?.reduce((sum, post) => sum + post.likes, 0) || 0;
  const avgHelpfulRate = contentMetrics.data?.top_helpful_articles?.length > 0 
    ? contentMetrics.data.top_helpful_articles.reduce((sum, article) => sum + article.helpful_percentage, 0) / contentMetrics.data.top_helpful_articles.length
    : 0;

  const summaryCards = [
    {
      title: 'Total de Visualizações',
      value: totalBlogViews,
      icon: <Eye className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Total de Comentários',
      value: totalBlogComments,
      icon: <MessageCircle className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Total de Curtidas',
      value: totalBlogLikes,
      icon: <ThumbsUp className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Taxa Média "Ajudou"',
      value: avgHelpfulRate,
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      format: 'percentage' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Note */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          📊 Para dados completos de analytics, conecte o Google Analytics. 
          Os dados mostrados são baseados em eventos registrados no banco de dados.
        </AlertDescription>
      </Alert>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <KpiCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            format={card.format}
            isLoading={contentMetrics.isLoading}
            isError={contentMetrics.isError}
            lastUpdated={contentMetrics.lastUpdated}
            onRefresh={() => contentMetrics.refetch()}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Blog Posts */}
        <DataTable
          title="Top 5 Posts do Blog"
          columns={blogPostColumns}
          data={contentMetrics.data?.top_blog_posts || []}
          actions={blogActions}
          isLoading={contentMetrics.isLoading}
          isError={contentMetrics.isError}
          lastUpdated={contentMetrics.lastUpdated}
          onRefresh={() => contentMetrics.refetch()}
          pageSize={5}
          emptyMessage="Nenhum post com visualizações no período"
          source="Blog Analytics"
        />

        {/* Top Helpful Articles */}
        <DataTable
          title="Artigos Mais Úteis"
          columns={articlesColumns}
          data={contentMetrics.data?.top_helpful_articles || []}
          actions={articleActions}
          isLoading={contentMetrics.isLoading}
          isError={contentMetrics.isError}
          lastUpdated={contentMetrics.lastUpdated}
          onRefresh={() => contentMetrics.refetch()}
          pageSize={5}
          emptyMessage="Nenhum artigo com votos no período"
          source="Support Articles"
        />
      </div>

      {/* Search Metrics Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KpiCard
          title="Buscas sem Resultado"
          value="0%"
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          source="Search Logs"
          className="bg-muted/30"
        />
        <KpiCard
          title="Total de Buscas"
          value={0}
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
          source="Search Logs"
          className="bg-muted/30"
        />
      </div>
    </div>
  );
}