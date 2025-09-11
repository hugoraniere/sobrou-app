import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeaturedPost {
  id: string;
  post_id: string;
  cta_text?: string;
  cta_url?: string;
  post_title: string;
  post_subtitle?: string;
  post_content: string;
  post_cover_image_url?: string;
  post_slug: string;
  post_published_at: string;
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

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-border/50 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Content */}
        <div className="px-6 py-12 md:px-12 md:py-16 lg:order-1">
          <Badge variant="secondary" className="mb-4">
            Em Destaque
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {featuredPost.post_title}
          </h2>
          {featuredPost.post_subtitle && (
            <p className="text-lg text-muted-foreground mb-4">
              {featuredPost.post_subtitle}
            </p>
          )}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {getExcerpt(featuredPost.post_content)}
          </p>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(featuredPost.post_published_at), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link 
                to={`/blog/${featuredPost.post_slug}`}
                className="inline-flex items-center gap-2"
              >
                Ler artigo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {featuredPost.cta_text && featuredPost.cta_url && (
              <Button variant="outline" size="lg" asChild>
                <a 
                  href={featuredPost.cta_url}
                  target={featuredPost.cta_url.startsWith('http') ? '_blank' : '_self'}
                  rel={featuredPost.cta_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {featuredPost.cta_text}
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="lg:order-2 relative">
          {featuredPost.post_cover_image_url ? (
            <div className="aspect-[4/3] lg:aspect-[3/4] overflow-hidden rounded-l-xl lg:rounded-l-none lg:rounded-r-xl">
              <img
                src={featuredPost.post_cover_image_url}
                alt={featuredPost.post_title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] lg:aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted rounded-l-xl lg:rounded-l-none lg:rounded-r-xl flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <ArrowRight className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground font-medium">
                  {featuredPost.post_title}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostHero;