-- Fix security issue: Replace insecure views with secure functions
-- Drop the existing views that don't have RLS enabled
DROP VIEW IF EXISTS public.blog_post_stats;
DROP VIEW IF EXISTS public.blog_overall_stats;

-- Create secure function to get blog post stats (admin/editor only)
CREATE OR REPLACE FUNCTION public.get_blog_post_stats()
RETURNS TABLE(
  id uuid,
  author_id uuid,
  view_count bigint,
  comment_count bigint,
  published_at timestamptz,
  created_at timestamptz,
  title text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  -- Only admins and editors can access blog post stats
  SELECT 
    bp.id,
    bp.user_id AS author_id,
    COUNT(DISTINCT bpv.id) AS view_count,
    COUNT(DISTINCT bc.id) AS comment_count,
    bp.published_at,
    bp.created_at,
    bp.title
  FROM public.blog_posts bp
  LEFT JOIN public.blog_post_views bpv ON bp.id = bpv.post_id
  LEFT JOIN public.blog_comments bc ON bp.id = bc.post_id AND bc.status = 'approved'
  WHERE public.is_admin() OR public.is_editor()
  GROUP BY bp.id, bp.user_id, bp.published_at, bp.created_at, bp.title
  ORDER BY bp.published_at DESC;
$$;

-- Create secure function to get blog overall stats (admin/editor only)
CREATE OR REPLACE FUNCTION public.get_blog_overall_stats()
RETURNS TABLE(
  total_posts bigint,
  total_views bigint,
  total_comments bigint
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  -- Only admins and editors can access overall blog stats
  SELECT 
    COUNT(DISTINCT bp.id) AS total_posts,
    COUNT(DISTINCT bpv.id) AS total_views,
    COUNT(DISTINCT bc.id) AS total_comments
  FROM public.blog_posts bp
  LEFT JOIN public.blog_post_views bpv ON bp.id = bpv.post_id
  LEFT JOIN public.blog_comments bc ON bp.id = bc.post_id AND bc.status = 'approved'
  WHERE public.is_admin() OR public.is_editor();
$$;

-- Add comments explaining the security fix
COMMENT ON FUNCTION public.get_blog_post_stats() IS 'Secure function to get blog post statistics. Replaces the insecure blog_post_stats view. Only accessible to admins and editors.';
COMMENT ON FUNCTION public.get_blog_overall_stats() IS 'Secure function to get overall blog statistics. Replaces the insecure blog_overall_stats view. Only accessible to admins and editors.';