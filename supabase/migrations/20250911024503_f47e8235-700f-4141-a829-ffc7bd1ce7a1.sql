-- Create app_events table for tracking user interactions
CREATE TABLE public.app_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on app_events
ALTER TABLE public.app_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for app_events
CREATE POLICY "Admins can view all app events" ON public.app_events
FOR SELECT USING (is_admin());

CREATE POLICY "Users can insert their own app events" ON public.app_events
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create shopping_lists table
CREATE TABLE public.shopping_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on shopping_lists
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shopping_lists
CREATE POLICY "Users can manage their own shopping lists" ON public.shopping_lists
FOR ALL USING (auth.uid() = user_id);

-- Create shopping_list_items table
CREATE TABLE public.shopping_list_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shopping_list_id UUID NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  is_checked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on shopping_list_items
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shopping_list_items
CREATE POLICY "Users can manage items in their shopping lists" ON public.shopping_list_items
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.shopping_lists sl 
  WHERE sl.id = shopping_list_id AND sl.user_id = auth.uid()
));

-- Create blog_post_shares table
CREATE TABLE public.blog_post_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID,
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  share_type TEXT DEFAULT 'link'
);

-- Enable RLS on blog_post_shares
ALTER TABLE public.blog_post_shares ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blog_post_shares
CREATE POLICY "Anyone can create blog post shares" ON public.blog_post_shares
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view blog post shares" ON public.blog_post_shares
FOR SELECT USING (true);

-- Create trigger for updating shopping_lists updated_at
CREATE TRIGGER update_shopping_lists_updated_at
BEFORE UPDATE ON public.shopping_lists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get daily/weekly active users
CREATE OR REPLACE FUNCTION public.get_active_users_stats(period_days integer DEFAULT 30)
RETURNS TABLE(date date, daily_active_users bigint, weekly_active_users bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  WITH date_series AS (
    SELECT generate_series(
      (CURRENT_DATE - (period_days || ' days')::interval)::date,
      CURRENT_DATE,
      '1 day'::interval
    )::date AS date
  ),
  daily_active AS (
    SELECT 
      ae.created_at::date AS date,
      COUNT(DISTINCT ae.user_id) AS daily_active_users
    FROM public.app_events ae
    WHERE ae.created_at >= CURRENT_DATE - (period_days || ' days')::interval
    GROUP BY ae.created_at::date
  ),
  weekly_active AS (
    SELECT 
      ds.date,
      COUNT(DISTINCT ae.user_id) AS weekly_active_users
    FROM date_series ds
    LEFT JOIN public.app_events ae ON ae.created_at::date BETWEEN ds.date - 6 AND ds.date
    GROUP BY ds.date
  )
  SELECT 
    ds.date,
    COALESCE(da.daily_active_users, 0) AS daily_active_users,
    COALESCE(wa.weekly_active_users, 0) AS weekly_active_users
  FROM date_series ds
  LEFT JOIN daily_active da ON ds.date = da.date
  LEFT JOIN weekly_active wa ON ds.date = wa.date
  ORDER BY ds.date;
$function$;

-- Create function to get retention cohorts
CREATE OR REPLACE FUNCTION public.get_user_retention_cohorts(weeks_back integer DEFAULT 12)
RETURNS TABLE(cohort_week date, users_count bigint, week_0 bigint, week_1 bigint, week_2 bigint, week_3 bigint, week_4 bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  WITH user_first_activity AS (
    SELECT 
      user_id,
      DATE_TRUNC('week', MIN(created_at)) AS cohort_week
    FROM public.app_events
    WHERE created_at >= CURRENT_DATE - (weeks_back * 7 || ' days')::interval
    GROUP BY user_id
  ),
  user_activities AS (
    SELECT 
      ufa.user_id,
      ufa.cohort_week,
      DATE_TRUNC('week', ae.created_at) AS activity_week,
      EXTRACT(week FROM age(ae.created_at, ufa.cohort_week)) AS weeks_since_cohort
    FROM user_first_activity ufa
    JOIN public.app_events ae ON ufa.user_id = ae.user_id
    WHERE ae.created_at >= ufa.cohort_week
  )
  SELECT 
    cohort_week::date,
    COUNT(DISTINCT user_id) AS users_count,
    COUNT(DISTINCT CASE WHEN weeks_since_cohort = 0 THEN user_id END) AS week_0,
    COUNT(DISTINCT CASE WHEN weeks_since_cohort = 1 THEN user_id END) AS week_1,
    COUNT(DISTINCT CASE WHEN weeks_since_cohort = 2 THEN user_id END) AS week_2,
    COUNT(DISTINCT CASE WHEN weeks_since_cohort = 3 THEN user_id END) AS week_3,
    COUNT(DISTINCT CASE WHEN weeks_since_cohort = 4 THEN user_id END) AS week_4
  FROM user_activities
  GROUP BY cohort_week
  ORDER BY cohort_week;
$function$;

-- Create function to get app interaction totals
CREATE OR REPLACE FUNCTION public.get_app_interaction_totals()
RETURNS TABLE(total_saved_dishes bigint, total_shopping_lists bigint, total_transactions bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT 
    (SELECT COUNT(*) FROM public.app_events WHERE event_type = 'dish_saved') AS total_saved_dishes,
    (SELECT COUNT(*) FROM public.shopping_lists) AS total_shopping_lists,
    (SELECT COUNT(*) FROM public.transactions) AS total_transactions;
$function$;

-- Create function to get blog views over time
CREATE OR REPLACE FUNCTION public.get_blog_views_over_time(days_back integer DEFAULT 30)
RETURNS TABLE(date date, views_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  WITH date_series AS (
    SELECT generate_series(
      (CURRENT_DATE - (days_back || ' days')::interval)::date,
      CURRENT_DATE,
      '1 day'::interval
    )::date AS date
  )
  SELECT 
    ds.date,
    COALESCE(COUNT(bpv.id), 0) AS views_count
  FROM date_series ds
  LEFT JOIN public.blog_post_views bpv ON bpv.viewed_at::date = ds.date
  GROUP BY ds.date
  ORDER BY ds.date;
$function$;

-- Create function to get detailed user stats
CREATE OR REPLACE FUNCTION public.get_detailed_user_stats(target_user_id uuid)
RETURNS TABLE(
  join_date timestamp with time zone,
  last_access timestamp with time zone,
  content_views bigint,
  saved_dishes bigint,
  shopping_lists_count bigint,
  posts_created bigint,
  total_post_views bigint,
  total_post_comments bigint
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT 
    au.created_at AS join_date,
    (SELECT MAX(created_at) FROM public.app_events WHERE user_id = target_user_id) AS last_access,
    (SELECT COUNT(*) FROM public.blog_post_views WHERE user_id = target_user_id) AS content_views,
    (SELECT COUNT(*) FROM public.app_events WHERE user_id = target_user_id AND event_type = 'dish_saved') AS saved_dishes,
    (SELECT COUNT(*) FROM public.shopping_lists WHERE user_id = target_user_id) AS shopping_lists_count,
    (SELECT COUNT(*) FROM public.blog_posts WHERE user_id = target_user_id) AS posts_created,
    (SELECT COUNT(bpv.*) FROM public.blog_posts bp LEFT JOIN public.blog_post_views bpv ON bp.id = bpv.post_id WHERE bp.user_id = target_user_id) AS total_post_views,
    (SELECT COUNT(bc.*) FROM public.blog_posts bp LEFT JOIN public.blog_comments bc ON bp.id = bc.post_id WHERE bp.user_id = target_user_id AND bc.status = 'approved') AS total_post_comments
  FROM auth.users au
  WHERE au.id = target_user_id;
$function$;