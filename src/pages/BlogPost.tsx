import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Heart, Eye, Share2 } from 'lucide-react';
import { BlogService } from '@/services/blogService';
import { BlogPost as BlogPostType } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import BlogBreadcrumb from '@/components/blog/BlogBreadcrumb';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { user } = useAuth();

  const blogService = new BlogService();

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const postData = await blogService.getPublicBlogPostBySlug(slug);
      if (postData) {
        setPost(postData);
        setLikeCount((postData as any).like_count || 0);
        
        // Set document title for SEO
        document.title = `${postData.title} - Sobrou`;
        
        // Record page view
        await blogService.recordBlogPostView(postData.id, user?.id);
      }
    } catch (error) {
      console.error('Erro ao carregar post:', error);
      toast.error('Não foi possível carregar o artigo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post || liking) return;

    setLiking(true);
    try {
      const liked = await blogService.toggleBlogPostLike(post.id, user?.id);
      setIsLiked(liked);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
      
      if (liked) {
        toast.success('❤️ Curtido! Obrigado por curtir este artigo!');
      } else {
        toast.success('Curtida removida com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao curtir post:', error);
      toast.error('Não foi possível curtir o artigo.');
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    if (!post) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.subtitle || post.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copiado para a área de transferência!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-6" />
            <div className="h-12 bg-muted rounded w-3/4 mb-4" />
            <div className="h-6 bg-muted rounded w-1/2 mb-8" />
            <div className="aspect-video bg-muted rounded mb-8" />
            <div className="space-y-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <BlogBreadcrumb 
            category={post.tags && post.tags.length > 0 ? post.tags[0].name : undefined}
            postTitle={post.title} 
          />
        </div>
        {/* Breadcrumb */}
        <div className="mb-6">
          <BlogBreadcrumb 
            category={post.tags && post.tags.length > 0 ? post.tags[0].name : undefined}
            postTitle={post.title} 
          />
        </div>
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              Artigo não encontrado
            </h1>
            <p className="text-muted-foreground mb-6">
              O artigo que você está procurando não existe ou foi removido.
            </p>
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/blog">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Blog
          </Button>
        </Link>
      </div>

      {/* Article */}
      <article className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>
            
            {post.subtitle && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.subtitle}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(post.published_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{likeCount} {likeCount === 1 ? 'curtida' : 'curtidas'}</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Cover image */}
            {post.cover_image_url && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div 
                  className="prose max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(post.content, {
                      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code'],
                      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class']
                    })
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-border/40 pt-8">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleLike}
                disabled={liking}
                variant={isLiked ? "default" : "outline"}
                size="lg"
              >
                <Heart className={`mr-2 h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                {liking ? 'Curtindo...' : isLiked ? 'Curtido' : 'Curtir'}
                <span className="ml-2 text-sm">({likeCount})</span>
              </Button>
              
              <Button onClick={handleShare} variant="outline" size="lg">
                <Share2 className="mr-2 h-5 w-5" />
                Compartilhar
              </Button>
            </div>

            <Link to="/blog">
              <Button variant="ghost">
                Mais artigos
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;