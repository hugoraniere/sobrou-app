import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SupportArticle } from '@/types/support';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ArticleListProps {
  articles: SupportArticle[];
  showFeatured?: boolean;
  showViewCount?: boolean;
  className?: string;
}

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  showFeatured = false,
  showViewCount = false,
  className = ""
}) => {
  if (articles.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-text-secondary">Nenhum artigo encontrado.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`} data-tour-id="support.articles.article-list">
      {articles.map((article) => (
        <Link key={article.id} to={`/suporte/artigo/${article.slug}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {article.is_featured && showFeatured && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                    {article.topic && (
                      <Badge variant="outline" className="text-xs">
                        {article.topic.name}
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  {article.excerpt && (
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.reading_time_minutes} min de leitura</span>
                    </div>
                    
                    {showViewCount && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{article.view_count} visualizações</span>
                      </div>
                    )}
                    
                    <span>
                      {formatDistanceToNow(new Date(article.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ArticleList;