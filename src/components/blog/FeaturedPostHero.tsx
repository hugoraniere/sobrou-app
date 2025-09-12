import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeaturedPost {
  id: string;
  post_id?: string;
  title?: string;
  description?: string;
  image_url?: string;
  cta_text?: string;
  cta_url?: string;
  is_custom: boolean;
  post_title?: string;
  post_subtitle?: string;
  post_content?: string;
  post_cover_image_url?: string;
  post_slug?: string;
  post_published_at?: string;
}

interface FeaturedPostHeroProps {
  featuredPost?: FeaturedPost;
}

const FeaturedPostHero: React.FC<FeaturedPostHeroProps> = ({ featuredPost }) => {
  if (!featuredPost) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-border/50 mb-12">
        <div className="relative px-6 py-12 md:px-12 md:py-16">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4">
              Em Destaque
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore nossos artigos
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Descubra dicas e insights sobre gestão financeira pessoal para transformar sua relação com o dinheiro.
            </p>
            <Button asChild size="lg">
              <Link to="/blog" className="inline-flex items-center gap-2">
                Ver todos os artigos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const getExcerpt = (content: string, maxLength: number = 200): string => {
    const text = stripHtml(content);
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const title = featuredPost.is_custom ? featuredPost.title : featuredPost.post_title;
  const subtitle = featuredPost.is_custom ? featuredPost.description : featuredPost.post_subtitle;
  const imageUrl = featuredPost.is_custom ? featuredPost.image_url : featuredPost.post_cover_image_url;
  const content = featuredPost.is_custom ? featuredPost.description : featuredPost.post_content;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-border/50 mb-12">
      <div className="flex items-center gap-6 p-6">
        {/* Content */}
        <div className="flex-1 space-y-4">
          <Badge variant="secondary" className="inline-block">
            Em Destaque
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
          {!featuredPost.is_custom && featuredPost.post_content && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {getExcerpt(featuredPost.post_content, 150)}
            </p>
          )}
          {!featuredPost.is_custom && featuredPost.post_published_at && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {format(new Date(featuredPost.post_published_at), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            {!featuredPost.is_custom && featuredPost.post_slug ? (
              <Button asChild>
                <Link 
                  to={`/blog/${featuredPost.post_slug}`}
                  className="inline-flex items-center gap-2"
                >
                  Ler artigo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              featuredPost.cta_text && featuredPost.cta_url && (
                <Button asChild>
                  <a 
                    href={featuredPost.cta_url}
                    target={featuredPost.cta_url.startsWith('http') ? '_blank' : '_self'}
                    rel={featuredPost.cta_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2"
                  >
                    {featuredPost.cta_text}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              )
            )}
          </div>
        </div>

        {/* Image */}
        <div className="w-32 h-24 shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostHero;