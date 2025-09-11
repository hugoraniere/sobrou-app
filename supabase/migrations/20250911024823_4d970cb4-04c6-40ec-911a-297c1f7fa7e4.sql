-- Fix security issues: Update functions to have proper search_path and remove security definer from views

-- Fix function search path issue - ensure all functions have search_path set
DROP FUNCTION IF EXISTS public.get_user_blog_stats(uuid);
CREATE OR REPLACE FUNCTION public.get_user_blog_stats(target_user_id uuid)
RETURNS TABLE(total_posts bigint, total_views bigint, avg_views_per_post numeric, total_comments bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Recreate views without SECURITY DEFINER (they were previously created with it)
DROP VIEW IF EXISTS public.blog_post_stats;
CREATE VIEW public.blog_post_stats AS
SELECT 
  bp.id,
  bp.user_id as author_id,
  COUNT(DISTINCT bpv.id) as view_count,
  COUNT(DISTINCT bc.id) as comment_count,
  bp.published_at,
  bp.created_at,
  bp.title
FROM public.blog_posts bp
LEFT JOIN public.blog_post_views bpv ON bp.id = bpv.post_id
LEFT JOIN public.blog_comments bc ON bp.id = bc.post_id AND bc.status = 'approved'
GROUP BY bp.id, bp.user_id, bp.published_at, bp.created_at, bp.title;

DROP VIEW IF EXISTS public.blog_overall_stats;
CREATE VIEW public.blog_overall_stats AS
SELECT 
  COUNT(DISTINCT bp.id) as total_posts,
  COUNT(DISTINCT bpv.id) as total_views,
  COUNT(DISTINCT bc.id) as total_comments
FROM public.blog_posts bp
LEFT JOIN public.blog_post_views bpv ON bp.id = bpv.post_id
LEFT JOIN public.blog_comments bc ON bp.id = bc.post_id AND bc.status = 'approved';