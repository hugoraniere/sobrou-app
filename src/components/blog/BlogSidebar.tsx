import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogService } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, Star, Calendar, Eye } from 'lucide-react';
import TagCloud from './TagCloud';
import CategoryList from './CategoryList';

const BlogSidebar: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const blogService = new BlogService();
        const posts = await blogService.getFeaturedPosts(3);
        setFeaturedPosts(posts);
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  return (
    <aside className="w-full lg:w-80 space-y-6 lg:sticky lg:top-4 lg:self-start">
      {/* Conteúdos em Destaque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-yellow-500" />
            Conteúdos em Destaque
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="space-y-4">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="block group"
                >
                  <div className="flex gap-3">
                    {post.cover_image_url && (
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.published_at), 'dd MMM', { locale: ptBR })}
                        <Eye className="h-3 w-3 ml-2" />
                        {post.like_count || 0}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum conteúdo em destaque encontrado.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Categorias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Veja conteúdos por categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryList />
        </CardContent>
      </Card>

      {/* Tags Mais Populares */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">10 Tags Mais Visitadas</CardTitle>
        </CardHeader>
        <CardContent>
          <TagCloud />
        </CardContent>
      </Card>
    </aside>
  );
};

export default BlogSidebar;