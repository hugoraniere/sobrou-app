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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {posts.map((post) => (
        <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-border/40 bg-card/50 backdrop-blur-sm">
          <Link 
            to={`/blog/${post.slug}`}
            className="block hover:scale-[1.02] transition-transform duration-200"
          >
            {post.cover_image_url && (
              <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </CardTitle>
              {post.subtitle && (
                <p className="text-muted-foreground text-xs line-clamp-2">
                  {post.subtitle}
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
                {getExcerpt(post.content, 100)}
              </p>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs px-2 py-0">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Meta info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(post.published_at), 'dd/MM', { locale: ptBR })}</span>
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