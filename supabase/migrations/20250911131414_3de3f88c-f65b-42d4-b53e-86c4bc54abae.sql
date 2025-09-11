-- Secure analytics tables with RLS policies
-- This fixes the critical security issue where analytics data was publicly accessible

-- Enable RLS on blog analytics tables
ALTER TABLE public.blog_post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_shares ENABLE ROW LEVEL SECURITY;

-- Blog Post Views policies
CREATE POLICY "Users can view their own blog post views" 
ON public.blog_post_views 
FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin() OR public.is_editor());

CREATE POLICY "Users can create their own blog post views" 
ON public.blog_post_views 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins and editors can view all blog post views" 
ON public.blog_post_views 
FOR ALL 
USING (public.is_admin() OR public.is_editor());

-- Blog Post Likes policies
CREATE POLICY "Users can view their own blog post likes" 
ON public.blog_post_likes 
FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin() OR public.is_editor());

CREATE POLICY "Users can manage their own blog post likes" 
ON public.blog_post_likes 
FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin() OR public.is_editor())
WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR public.is_admin() OR public.is_editor());

-- Blog Post Shares policies  
CREATE POLICY "Users can view their own blog post shares" 
ON public.blog_post_shares 
FOR SELECT 
USING (auth.uid() = user_id OR public.is_admin() OR public.is_editor());

CREATE POLICY "Users can create their own blog post shares" 
ON public.blog_post_shares 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins and editors can view all blog post shares" 
ON public.blog_post_shares 
FOR ALL 
USING (public.is_admin() OR public.is_editor());

-- Update database functions to include explicit search_path for security
CREATE OR REPLACE FUNCTION public.get_user_metrics(period_days integer DEFAULT 30)
 RETURNS TABLE(total_users bigint, active_users bigint, subscribers bigint, prev_total_users bigint, prev_active_users bigint, prev_subscribers bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH current_period AS (
    SELECT 
      COUNT(DISTINCT au.id) as total_users,
      COUNT(DISTINCT CASE WHEN ae.user_id IS NOT NULL THEN ae.user_id END) as active_users,
      COUNT(DISTINCT CASE WHEN s.user_id IS NOT NULL AND s.plan != 'free' THEN s.user_id END) as subscribers
    FROM auth.users au
    LEFT JOIN public.app_events ae ON ae.user_id = au.id 
      AND ae.created_at >= CURRENT_DATE - (period_days || ' days')::interval
    LEFT JOIN public.subscriptions s ON s.user_id = au.id
      AND (s.expires_at IS NULL OR s.expires_at > now())
      AND s.status = 'active'
  ),
  previous_period AS (
    SELECT 
      COUNT(DISTINCT au.id) as prev_total_users,
      COUNT(DISTINCT CASE WHEN ae.user_id IS NOT NULL THEN ae.user_id END) as prev_active_users,
      COUNT(DISTINCT CASE WHEN s.user_id IS NOT NULL AND s.plan != 'free' THEN s.user_id END) as prev_subscribers
    FROM auth.users au
    LEFT JOIN public.app_events ae ON ae.user_id = au.id 
      AND ae.created_at >= CURRENT_DATE - (2 * period_days || ' days')::interval
      AND ae.created_at < CURRENT_DATE - (period_days || ' days')::interval
    LEFT JOIN public.subscriptions s ON s.user_id = au.id
      AND (s.expires_at IS NULL OR s.expires_at > CURRENT_DATE - (period_days || ' days')::interval)
      AND s.status = 'active'
  )
  SELECT 
    cp.total_users,
    cp.active_users,
    cp.subscribers,
    pp.prev_total_users,
    pp.prev_active_users,
    pp.prev_subscribers
  FROM current_period cp, previous_period pp;
$function$;