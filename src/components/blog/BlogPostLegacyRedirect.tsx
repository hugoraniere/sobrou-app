import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogService } from '@/services/blogService';

const BlogPostLegacyRedirect = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToSlug = async () => {
      if (!id) {
        navigate('/blog');
        return;
      }

      try {
        const blogService = new BlogService();
        const post = await blogService.getPublicBlogPost(id);
        
        if (post && post.slug) {
          navigate(`/blog/${post.slug}`, { replace: true });
        } else {
          navigate('/blog');
        }
      } catch (error) {
        console.error('Error redirecting to slug:', error);
        navigate('/blog');
      }
    };

    redirectToSlug();
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
};

export default BlogPostLegacyRedirect;