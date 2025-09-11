import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface PostListViewProps {
  posts: BlogPost[];
}

const PostListView: React.FC<PostListViewProps> = ({ posts }) => {
  const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const getExcerpt = (content: string, maxLength: number = 150): string => {
    const text = stripHtml(content);
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="group border border-border/40 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <Link
            to={`/blog/${post.slug}`}
            className="block hover:scale-[1.01] transition-transform duration-200"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              {post.cover_image_url && (
                <div className="sm:w-48 aspect-video sm:aspect-square overflow-hidden">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              {/* Content */}
              <div className="flex-1 p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  {post.subtitle && (
                    <p className="text-muted-foreground text-sm line-clamp-1 mb-2">
                      {post.subtitle}
                    </p>
                  )}
                </div>
                
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
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
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PostListView;