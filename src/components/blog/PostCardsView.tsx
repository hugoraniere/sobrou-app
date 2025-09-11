import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface PostCardsViewProps {
  posts: BlogPost[];
}

const PostCardsView: React.FC<PostCardsViewProps> = ({ posts }) => {
  const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const getExcerpt = (content: string, maxLength: number = 150): string => {
    const text = stripHtml(content);
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-border/40 bg-card/50 backdrop-blur-sm">
          <Link 
            to={`/blog/${post.slug}`}
            className="block hover:scale-[1.02] transition-transform duration-200"
          >
            {post.cover_image_url && (
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <CardHeader className="pb-3">
              <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </CardTitle>
              {post.subtitle && (
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {post.subtitle}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {getExcerpt(post.content)}
              </p>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Meta info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(post.published_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{(post as any).like_count || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default PostCardsView;