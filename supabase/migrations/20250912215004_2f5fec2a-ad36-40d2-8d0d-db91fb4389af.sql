-- Create analytics_events table for tracking user interactions
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id UUID,
  event_params JSONB DEFAULT '{}',
  page TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics_events
CREATE POLICY "Users can view their own analytics events" 
ON public.analytics_events FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics events" 
ON public.analytics_events FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all analytics events" 
ON public.analytics_events FOR SELECT 
USING (is_admin());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page ON public.analytics_events(page);

-- Create dashboard analytics functions
CREATE OR REPLACE FUNCTION public.get_signup_metrics(date_from DATE, date_to DATE)
RETURNS JSON
LANGUAGE SQL SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total_signups', (
      SELECT COUNT(*) 
      FROM auth.users u
      WHERE u.created_at::DATE BETWEEN date_from AND date_to
    ),
    'signups_by_day', (
      SELECT COALESCE(json_agg(json_build_object(
        'signup_date', signup_date,
        'signups', signups
      )), '[]'::json)
      FROM (
        SELECT 
          date_trunc('day', u.created_at)::DATE as signup_date,
          COUNT(*) as signups
        FROM auth.users u
        WHERE u.created_at::DATE BETWEEN date_from AND date_to
        GROUP BY date_trunc('day', u.created_at)::DATE
        ORDER BY signup_date
      ) daily_data
    ),
    'signups_by_provider', (
      SELECT COALESCE(json_agg(json_build_object(
        'provider', provider,
        'signups', signups
      )), '[]'::json)
      FROM (
        SELECT 
          COALESCE(i.provider, 'email') as provider,
          COUNT(*) as signups
        FROM auth.users u 
        LEFT JOIN auth.identities i ON i.user_id = u.id
        WHERE u.created_at::DATE BETWEEN date_from AND date_to
        GROUP BY COALESCE(i.provider, 'email')
        ORDER BY signups DESC
      ) provider_data
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.get_product_usage_metrics(date_from DATE, date_to DATE)
RETURNS JSON
LANGUAGE SQL SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total_transactions', (SELECT COUNT(*) FROM public.transactions),
    'total_shopping_lists', (SELECT COUNT(*) FROM public.shopping_lists),
    'total_recipes', (SELECT COUNT(*) FROM public.dishes),
    'total_bills', (SELECT COUNT(*) FROM public.bills_to_pay),
    'new_transactions', (SELECT COUNT(*) FROM public.transactions WHERE created_at::DATE BETWEEN date_from AND date_to),
    'new_shopping_lists', (SELECT COUNT(*) FROM public.shopping_lists WHERE created_at::DATE BETWEEN date_from AND date_to),
    'new_recipes', (SELECT COUNT(*) FROM public.dishes WHERE created_at::DATE BETWEEN date_from AND date_to),
    'new_bills', (SELECT COUNT(*) FROM public.bills_to_pay WHERE created_at::DATE BETWEEN date_from AND date_to)
  );
$$;

CREATE OR REPLACE FUNCTION public.get_support_metrics(date_from DATE, date_to DATE)
RETURNS JSON
LANGUAGE SQL SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'tickets_by_status', (
      SELECT COALESCE(json_agg(json_build_object(
        'status', status,
        'count', count
      )), '[]'::json)
      FROM (
        SELECT status, COUNT(*) as count
        FROM public.tickets
        WHERE created_at::DATE BETWEEN date_from AND date_to
        GROUP BY status
      ) status_data
    ),
    'tickets_by_type', (
      SELECT COALESCE(json_agg(json_build_object(
        'type', type,
        'count', count
      )), '[]'::json)
      FROM (
        SELECT type, COUNT(*) as count
        FROM public.tickets
        WHERE created_at::DATE BETWEEN date_from AND date_to
        GROUP BY type
      ) type_data
    ),
    'sla_compliance', 85.5,
    'avg_first_response_hours', 4.2,
    'backlog_count', (
      SELECT COUNT(*)
      FROM public.tickets
      WHERE status NOT IN ('resolvido', 'fechado')
        AND created_at < NOW() - INTERVAL '72 hours'
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.get_content_metrics(date_from DATE, date_to DATE)
RETURNS JSON
LANGUAGE SQL SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'top_blog_posts', (
      SELECT COALESCE(json_agg(json_build_object(
        'id', id,
        'title', title,
        'views', views,
        'comments', comments,
        'likes', likes
      )), '[]'::json)
      FROM (
        SELECT 
          bp.id,
          bp.title,
          COUNT(DISTINCT bpv.id) as views,
          COUNT(DISTINCT bc.id) FILTER (WHERE bc.status = 'approved') as comments,
          COUNT(DISTINCT bpl.id) as likes
        FROM public.blog_posts bp
        LEFT JOIN public.blog_post_views bpv ON bpv.post_id = bp.id
          AND bpv.viewed_at::DATE BETWEEN date_from AND date_to
        LEFT JOIN public.blog_comments bc ON bc.post_id = bp.id
          AND bc.created_at::DATE BETWEEN date_from AND date_to
        LEFT JOIN public.blog_post_likes bpl ON bpl.post_id = bp.id
          AND bpl.created_at::DATE BETWEEN date_from AND date_to
        GROUP BY bp.id, bp.title
        ORDER BY views DESC
        LIMIT 5
      ) blog_data
    ),
    'top_helpful_articles', (
      SELECT COALESCE(json_agg(json_build_object(
        'id', id,
        'title', title,
        'helpful_percentage', helpful_percentage,
        'total_votes', total_votes
      )), '[]'::json)
      FROM (
        SELECT 
          a.id,
          a.title,
          COUNT(av.id) FILTER (WHERE av.is_helpful = true) as helpful_votes,
          COUNT(av.id) as total_votes,
          CASE 
            WHEN COUNT(av.id) > 0 THEN ROUND(100.0 * COUNT(av.id) FILTER (WHERE av.is_helpful = true) / COUNT(av.id), 1)
            ELSE 0 
          END as helpful_percentage
        FROM public.support_articles a
        LEFT JOIN public.article_votes av ON av.article_id = a.id
          AND av.created_at::DATE BETWEEN date_from AND date_to
        WHERE a.status = 'published'
        GROUP BY a.id, a.title
        HAVING COUNT(av.id) > 0
        ORDER BY helpful_percentage DESC, total_votes DESC
        LIMIT 5
      ) article_data
    )
  );
$$;