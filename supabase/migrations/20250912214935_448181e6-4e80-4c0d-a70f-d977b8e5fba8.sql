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

-- Create comprehensive dashboard analytics functions
CREATE OR REPLACE FUNCTION public.get_signup_metrics(date_from DATE, date_to DATE)
RETURNS TABLE(
  signups_by_day JSONB,
  signups_by_provider JSONB,
  total_signups BIGINT
) 
LANGUAGE SQL SECURITY DEFINER
SET search_path = public
AS $$
  WITH daily_signups AS (
    SELECT 
      date_trunc('day', u.created_at)::DATE as signup_date,
      COUNT(*) as signups
    FROM auth.users u
    WHERE u.created_at::DATE BETWEEN date_from AND date_to
    GROUP BY date_trunc('day', u.created_at)::DATE
    ORDER BY signup_date
  ),
  provider_signups AS (
    SELECT 
      COALESCE(i.provider, 'email') as provider,
      COUNT(*) as signups
    FROM auth.users u 
    LEFT JOIN auth.identities i ON i.user_id = u.id
    WHERE u.created_at::DATE BETWEEN date_from AND date_to
    GROUP BY COALESCE(i.provider, 'email')
    ORDER BY signups DESC
  ),
  total_count AS (
    SELECT COUNT(*) as total
    FROM auth.users u
    WHERE u.created_at::DATE BETWEEN date_from AND date_to
  )
  SELECT 
    jsonb_agg(to_jsonb(daily_signups)) as signups_by_day,
    jsonb_agg(to_jsonb(provider_signups)) as signups_by_provider,
    (SELECT total FROM total_count) as total_signups;
$$;

CREATE OR REPLACE FUNCTION public.get_auth_metrics(date_from DATE, date_to DATE)
RETURNS TABLE(
  login_success_by_day JSONB,
  login_errors_by_reason JSONB,
  total_sessions BIGINT
) 
LANGUAGE SQL SECURITY DEFINER
SET search_path = public
AS $$
  WITH daily_logins AS (
    SELECT 
      date_trunc('day', created_at)::DATE as login_date,
      COUNT(*) as logins
    FROM public.analytics_events
    WHERE event_name = 'login_success' 
      AND created_at::DATE BETWEEN date_from AND date_to
    GROUP BY date_trunc('day', created_at)::DATE
    ORDER BY login_date
  ),
  error_reasons AS (
    SELECT 
      COALESCE(event_params->>'reason', 'unknown') as reason,
      COUNT(*) as error_count
    FROM public.analytics_events
    WHERE event_name = 'login_error' 
      AND created_at::DATE BETWEEN date_from AND date_to
    GROUP BY COALESCE(event_params->>'reason', 'unknown')
    ORDER BY error_count DESC
    LIMIT 5
  ),
  session_count AS (
    SELECT COUNT(DISTINCT session_id) as sessions
    FROM public.analytics_events
    WHERE event_name = 'session_start'
      AND created_at::DATE BETWEEN date_from AND date_to
  )
  SELECT 
    COALESCE(jsonb_agg(to_jsonb(daily_logins)) FILTER (WHERE daily_logins.login_date IS NOT NULL), '[]'::jsonb) as login_success_by_day,
    COALESCE(jsonb_agg(to_jsonb(error_reasons)) FILTER (WHERE error_reasons.reason IS NOT NULL), '[]'::jsonb) as login_errors_by_reason,
    COALESCE((SELECT sessions FROM session_count), 0) as total_sessions;
$$;

CREATE OR REPLACE FUNCTION public.get_product_usage_metrics(date_from DATE, date_to DATE)
RETURNS TABLE(
  total_transactions BIGINT,
  total_shopping_lists BIGINT,
  total_recipes BIGINT,
  total_bills BIGINT,
  new_transactions BIGINT,
  new_shopping_lists BIGINT,
  new_recipes BIGINT,
  new_bills BIGINT
) 
LANGUAGE SQL SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    -- Total counts (all time)
    (SELECT COUNT(*) FROM public.transactions) as total_transactions,
    (SELECT COUNT(*) FROM public.shopping_lists) as total_shopping_lists,
    (SELECT COUNT(*) FROM public.dishes) as total_recipes,
    (SELECT COUNT(*) FROM public.bills_to_pay) as total_bills,
    
    -- New counts in period
    (SELECT COUNT(*) FROM public.transactions WHERE created_at::DATE BETWEEN date_from AND date_to) as new_transactions,
    (SELECT COUNT(*) FROM public.shopping_lists WHERE created_at::DATE BETWEEN date_from AND date_to) as new_shopping_lists,
    (SELECT COUNT(*) FROM public.dishes WHERE created_at::DATE BETWEEN date_from AND date_to) as new_recipes,
    (SELECT COUNT(*) FROM public.bills_to_pay WHERE created_at::DATE BETWEEN date_from AND date_to) as new_bills;
$$;

CREATE OR REPLACE FUNCTION public.get_support_metrics(date_from DATE, date_to DATE)
RETURNS TABLE(
  tickets_by_status JSONB,
  tickets_by_type JSONB,
  sla_metrics JSONB,
  backlog_tickets JSONB
) 
LANGUAGE SQL SECURITY DEFINER
SET search_path = public
AS $$
  WITH status_counts AS (
    SELECT status, COUNT(*) as count
    FROM public.tickets
    WHERE created_at::DATE BETWEEN date_from AND date_to
    GROUP BY status
  ),
  type_counts AS (
    SELECT type, COUNT(*) as count
    FROM public.tickets
    WHERE created_at::DATE BETWEEN date_from AND date_to
    GROUP BY type
  ),
  sla_data AS (
    WITH first_reply AS (
      SELECT 
        t.id,
        t.priority,
        t.created_at,
        MIN(tm.created_at) as first_agent_reply
      FROM public.tickets t
      LEFT JOIN public.ticket_messages tm ON tm.ticket_id = t.id
      WHERE t.created_at::DATE BETWEEN date_from AND date_to
        AND NOT tm.is_internal
      GROUP BY t.id, t.priority, t.created_at
    )
    SELECT 
      ROUND(AVG(
        CASE 
          WHEN priority = 'alta' AND first_agent_reply <= created_at + INTERVAL '8 hours' THEN 100
          WHEN priority = 'media' AND first_agent_reply <= created_at + INTERVAL '24 hours' THEN 100
          WHEN priority = 'baixa' AND first_agent_reply <= created_at + INTERVAL '48 hours' THEN 100
          ELSE 0 
        END
      ), 1) as sla_compliance_percent,
      ROUND(AVG(EXTRACT(EPOCH FROM (first_agent_reply - created_at))/3600)::NUMERIC, 1) as avg_first_response_hours
    FROM first_reply
  ),
  backlog AS (
    SELECT 
      id,
      subject,
      priority,
      ROUND(EXTRACT(EPOCH FROM (NOW() - created_at))/3600, 1) as hours_open
    FROM public.tickets
    WHERE status NOT IN ('resolvido', 'fechado')
      AND created_at < NOW() - INTERVAL '72 hours'
    ORDER BY created_at ASC
    LIMIT 10
  )
  SELECT 
    COALESCE(jsonb_agg(to_jsonb(status_counts)) FILTER (WHERE status_counts.status IS NOT NULL), '[]'::jsonb) as tickets_by_status,
    COALESCE(jsonb_agg(to_jsonb(type_counts)) FILTER (WHERE type_counts.type IS NOT NULL), '[]'::jsonb) as tickets_by_type,
    to_jsonb((SELECT row_to_json(sla_data) FROM sla_data)) as sla_metrics,
    COALESCE(jsonb_agg(to_jsonb(backlog)) FILTER (WHERE backlog.id IS NOT NULL), '[]'::jsonb) as backlog_tickets;
$$;

CREATE OR REPLACE FUNCTION public.get_content_metrics(date_from DATE, date_to DATE)
RETURNS TABLE(
  top_helpful_articles JSONB,
  search_metrics JSONB,
  blog_post_performance JSONB
) 
LANGUAGE SQL SECURITY DEFINER
SET search_path = public
AS $$
  WITH helpful_articles AS (
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
  ),
  blog_performance AS (
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
    LIMIT 10
  )
  SELECT 
    COALESCE(jsonb_agg(to_jsonb(helpful_articles)) FILTER (WHERE helpful_articles.id IS NOT NULL), '[]'::jsonb) as top_helpful_articles,
    '{"zero_result_searches": 0, "total_searches": 0}'::jsonb as search_metrics,
    COALESCE(jsonb_agg(to_jsonb(blog_performance)) FILTER (WHERE blog_performance.id IS NOT NULL), '[]'::jsonb) as blog_post_performance;
$$;