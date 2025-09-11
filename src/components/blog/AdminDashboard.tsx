import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText, MessageCircle, TrendingUp } from 'lucide-react';
import { BlogService } from '@/services/blogService';
import { useToast } from "@/hooks/use-toast";

const AdminDashboard: React.FC = () => {
  const [overallStats, setOverallStats] = useState({ total_posts: 0, total_views: 0, total_comments: 0 });
  const [topViewedPosts, setTopViewedPosts] = useState<Array<{ id: string; title: string; view_count: number }>>([]);
  const [topCommentedPosts, setTopCommentedPosts] = useState<Array<{ id: string; title: string; comment_count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [stats, viewedPosts, commentedPosts] = await Promise.all([
        BlogService.getBlogOverallStats(),
        BlogService.getTopViewedPosts(5),
        BlogService.getTopCommentedPosts(5)
      ]);

      setOverallStats(stats);
      setTopViewedPosts(viewedPosts);
      setTopCommentedPosts(commentedPosts);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        message: "Falha ao carregar dados do dashboard",
        type: "error",
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

  return (
    <div className="space-y-6">
      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.total_posts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.total_views}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Comentários</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.total_comments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Viewed Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Posts Mais Visualizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topViewedPosts.length > 0 ? (
              <div className="space-y-3">
                {topViewedPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm truncate max-w-[200px]" title={post.title}>
                        {post.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span className="text-sm font-medium">{post.view_count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">Nenhum post com visualizações ainda</p>
            )}
          </CardContent>
        </Card>

        {/* Top Commented Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Posts Mais Comentados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCommentedPosts.length > 0 ? (
              <div className="space-y-3">
                {topCommentedPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm truncate max-w-[200px]" title={post.title}>
                        {post.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MessageCircle className="h-3 w-3" />
                      <span className="text-sm font-medium">{post.comment_count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">Nenhum post com comentários ainda</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;