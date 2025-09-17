import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BlogService } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import MainNavbar from '@/components/navigation/MainNavbar';
import BlogBreadcrumb from '@/components/blog/BlogBreadcrumb';
import BlogSidebar from '@/components/blog/BlogSidebar';
import FeaturedPostHero from '@/components/blog/FeaturedPostHero';
import CategoryNavigation from '@/components/blog/CategoryNavigation';
import ViewModeToggle, { ViewMode } from '@/components/blog/ViewModeToggle';
import PostCardsView from '@/components/blog/PostCardsView';
import PostListView from '@/components/blog/PostListView';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [featuredPost, setFeaturedPost] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);

  const blogService = new BlogService();
  const POSTS_PER_PAGE = 12;

  // Initialize from URL params
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const view = (searchParams.get('view') as ViewMode) || 'cards';
    
    setSearchTerm(search);
    setSearchValue(search);
    setSelectedCategory(category || undefined);
    setCurrentPage(page);
    setViewMode(view);
    
    // Load data
    loadInitialData();
    loadPosts(search, category || undefined, page);
  }, []);

  // Load featured post and tags
  const loadInitialData = async () => {
    try {
      const [featuredData, tagsData] = await Promise.all([
        BlogService.getActiveFeaturedPost(),
        blogService.getAllTags()
      ]);
      
      setFeaturedPost(featuredData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setTagsLoading(false);
    }
  };

  const loadPosts = async (search: string = '', category?: string, page: number = 1) => {
    setLoading(true);
    try {
      let postsData: BlogPost[];
      
      if (search) {
        postsData = await blogService.getPublicBlogPosts(search, POSTS_PER_PAGE, (page - 1) * POSTS_PER_PAGE);
      } else if (category) {
        postsData = await blogService.getPublicBlogPostsByCategory(category, POSTS_PER_PAGE, (page - 1) * POSTS_PER_PAGE);
      } else {
        postsData = await blogService.getPublicBlogPosts('', POSTS_PER_PAGE, (page - 1) * POSTS_PER_PAGE);
      }
      
      setPosts(postsData);
      
      // Calculate total pages (estimate based on returned results)
      if (postsData.length < POSTS_PER_PAGE && page === 1) {
        setTotalPages(1);
      } else if (postsData.length < POSTS_PER_PAGE) {
        setTotalPages(page);
      } else {
        // Estimate more pages exist
        setTotalPages(page + 1);
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (updates: Partial<{ search: string; category: string; page: number; view: ViewMode }>) => {
    const params = new URLSearchParams(searchParams);
    
    if (updates.search !== undefined) {
      if (updates.search.trim()) {
        params.set('search', updates.search.trim());
      } else {
        params.delete('search');
      }
    }
    
    if (updates.category !== undefined) {
      if (updates.category) {
        params.set('category', updates.category);
      } else {
        params.delete('category');
      }
    }
    
    if (updates.page !== undefined) {
      if (updates.page > 1) {
        params.set('page', updates.page.toString());
      } else {
        params.delete('page');
      }
    }
    
    if (updates.view !== undefined) {
      if (updates.view !== 'cards') {
        params.set('view', updates.view);
      } else {
        params.delete('view');
      }
    }
    
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchValue);
    setSelectedCategory(undefined);
    setCurrentPage(1);
    updateURL({ search: searchValue, category: '', page: 1 });
    loadPosts(searchValue, undefined, 1);
  };

  const handleCategorySelect = (category?: string) => {
    setSelectedCategory(category);
    setSearchTerm('');
    setSearchValue('');
    setCurrentPage(1);
    updateURL({ search: '', category: category || '', page: 1 });
    loadPosts('', category, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page });
    loadPosts(searchTerm, selectedCategory, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    updateURL({ view: mode });
    localStorage.setItem('blog-view-mode', mode);
  };

  // Load view mode from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem('blog-view-mode') as ViewMode;
    if (savedViewMode && savedViewMode !== viewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  useEffect(() => {
    document.title = 'Blog - Sobrou';
  }, []);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
            </PaginationItem>
          )}
          
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}
          
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <MainNavbar />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <BlogBreadcrumb category={selectedCategory} />
          </div>

          {/* Featured Post Hero */}
          <FeaturedPostHero featuredPost={featuredPost} />

          {/* Main Content with Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <div className="flex-1 lg:max-w-4xl">
              {/* Search */}
              <div className="mb-8">
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

              {/* Category Navigation */}
              <CategoryNavigation
                tags={tags}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                loading={tagsLoading}
              />

              {/* View Mode Toggle and Results Info */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-muted-foreground">
                  {searchTerm && `Resultados para "${searchTerm}" • `}
                  {selectedCategory && `Categoria: ${selectedCategory} • `}
                  Página {currentPage} {totalPages > 1 && `de ${totalPages}`}
                </div>
                <ViewModeToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              </div>

              {/* Content */}
              <main>
                {loading ? (
                  <div className={viewMode === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className={viewMode === 'cards' ? 'space-y-4' : 'flex gap-4 p-4 border rounded-lg'}>
                        <Skeleton className={viewMode === 'cards' ? 'aspect-video w-full' : 'w-48 aspect-video'} />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-5/6" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto">
                      <h2 className="text-2xl font-semibold text-foreground mb-4">
                        Nenhum artigo encontrado
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {searchTerm ? 'Tente ajustar sua busca ou navegue pelas categorias.' : 
                         selectedCategory ? 'Não há artigos nesta categoria no momento.' :
                         'Ainda não há artigos publicados.'}
                      </p>
                      {(searchTerm || selectedCategory) && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchValue('');
                            setSearchTerm('');
                            setSelectedCategory(undefined);
                            setCurrentPage(1);
                            updateURL({ search: '', category: '', page: 1 });
                            loadPosts('', undefined, 1);
                          }}
                        >
                          Ver todos os artigos
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {viewMode === 'cards' ? (
                      <PostCardsView posts={posts} />
                    ) : (
                      <PostListView posts={posts} />
                    )}
                    
                    {renderPagination()}
                  </>
                )}
              </main>
            </div>

            {/* Sidebar */}
            <BlogSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;