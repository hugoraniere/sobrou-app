import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BlogService } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Calendar, Heart } from 'lucide-react';
import TransparentHeader from "@/components/header/TransparentHeader";

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const blogService = new BlogService();
  const POSTS_PER_PAGE = 9;

  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchTerm(search);
    setSearchValue(search);
    loadPosts(search, 0, true);
  }, [searchParams]);

  const loadPosts = async (search: string = '', pageNum: number = 0, reset: boolean = false) => {
    setLoading(true);
    try {
      const newPosts = await blogService.getPublicBlogPosts(search, POSTS_PER_PAGE, pageNum * POSTS_PER_PAGE);
      
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setHasMorePosts(newPosts.length === POSTS_PER_PAGE);
      setPage(pageNum);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchValue.trim()) {
      params.set('search', searchValue.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleLoadMore = () => {
    if (!loading && hasMorePosts) {
      const search = searchParams.get('search') || '';
      loadPosts(search, page + 1, false);
    }
  };

  const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const getExcerpt = (content: string, maxLength: number = 150): string => {
    const text = stripHtml(content);
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  useEffect(() => {
    document.title = 'Blog - Sobrou';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <TransparentHeader />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b mb-8 -mx-4 px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-2">Blog</h1>
            <p className="text-muted-foreground mb-6">
              Descubra dicas e insights sobre gestão financeira pessoal
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 pr-20"
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="absolute right-1 top-1 h-8"
                >
                  Buscar
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-6xl mx-auto">
          {loading && page === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted rounded-t-lg" />
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Nenhum artigo encontrado
                </h2>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? 'Tente ajustar sua busca ou navegar pelas categorias.' : 'Ainda não há artigos publicados.'}
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchValue('');
                      setSearchTerm('');
                      setSearchParams({});
                    }}
                  >
                    Limpar busca
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {searchTerm ? `Resultados para "${searchTerm}"` : `${posts.length} ${posts.length === 1 ? 'artigo' : 'artigos'}`}
                </p>
              </div>

              {/* Posts grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

              {/* Load more button */}
              {hasMorePosts && (
                <div className="text-center">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    variant="outline"
                    size="lg"
                  >
                    {loading ? 'Carregando...' : 'Carregar mais artigos'}
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Blog;