-- Fix security issues by removing SECURITY DEFINER from views and fixing function search path

-- Drop and recreate views without SECURITY DEFINER
DROP VIEW IF EXISTS public.blog_post_stats;
DROP VIEW IF EXISTS public.blog_overall_stats;

-- Recreate views without SECURITY DEFINER property
CREATE VIEW public.blog_post_stats AS
SELECT 
  bp.id,
  bp.title,
  bp.user_id as author_id,
  COUNT(DISTINCT bpv.id) as view_count,
  COUNT(DISTINCT bc.id) as comment_count,
  bp.published_at,
  bp.created_at
FROM public.blog_posts bp
LEFT JOIN public.blog_post_views bpv ON bp.id = bpv.post_id
LEFT JOIN public.blog_comments bc ON bp.id = bc.post_id AND bc.status = 'approved'
GROUP BY bp.id, bp.title, bp.user_id, bp.published_at, bp.created_at;

CREATE VIEW public.blog_overall_stats AS
SELECT 
  COUNT(DISTINCT bp.id) as total_posts,
  COUNT(DISTINCT bpv.id) as total_views,
  COUNT(DISTINCT bc.id) as total_comments
FROM public.blog_posts bp
LEFT JOIN public.blog_post_views bpv ON bp.id = bpv.post_id
LEFT JOIN public.blog_comments bc ON bp.id = bc.post_id AND bc.status = 'approved';

-- Update function to fix search path issue
CREATE OR REPLACE FUNCTION public.get_user_blog_stats(target_user_id UUID)
RETURNS TABLE(
  total_posts BIGINT,
  total_views BIGINT,
  avg_views_per_post NUMERIC,
  total_comments BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    COUNT(DISTINCT bp.id) as total_posts,
    COUNT(DISTINCT bpv.id) as total_views,
    CASE 
      WHEN COUNT(DISTINCT bp.id) > 0 THEN 
        ROUND(COUNT(DISTINCT bpv.id)::NUMERIC / COUNT(DISTINCT bp.id), 2)
      ELSE 0
    END as avg_views_per_post,
    COUNT(DISTINCT bc.id) as total_comments
  FROM public.blog_posts bp
  LEFT JOIN public.blog_post_views bpv ON bp.id = bpv.post_id
  LEFT JOIN public.blog_comments bc ON bp.id = bc.post_id AND bc.status = 'approved'
  WHERE bp.user_id = target_user_id;
$$;