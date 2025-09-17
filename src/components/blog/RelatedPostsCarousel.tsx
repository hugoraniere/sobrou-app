import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogService } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, Calendar, Eye } from 'lucide-react';

interface RelatedPostsCarouselProps {
  currentPostId: string;
}

const RelatedPostsCarousel: React.FC<RelatedPostsCarouselProps> = ({ currentPostId }) => {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const blogService = new BlogService();
        const posts = await blogService.getRelatedBlogPosts(currentPostId, 6);
        setRelatedPosts(posts);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-border/40">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Leia outros conteúdos
        </h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {relatedPosts.map((post) => (
              <CarouselItem key={post.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <Link to={`/blog/${post.slug}`} className="block">
                      {post.cover_image_url && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(post.published_at), 'dd MMM yyyy', { locale: ptBR })}
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        
                        {post.subtitle && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {post.subtitle}
                          </p>
                        )}
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag.id} variant="secondary" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{post.like_count || 0} curtidas</span>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default RelatedPostsCarousel;