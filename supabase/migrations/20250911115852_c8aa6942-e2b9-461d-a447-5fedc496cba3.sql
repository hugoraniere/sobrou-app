-- Update get_user_metrics function to support custom date ranges
CREATE OR REPLACE FUNCTION public.get_user_metrics_by_dates(
  start_date date, 
  end_date date,
  comparison_start_date date,
  comparison_end_date date
)
RETURNS TABLE(
  total_users bigint, 
  active_users bigint, 
  subscribers bigint, 
  prev_total_users bigint, 
  prev_active_users bigint, 
  prev_subscribers bigint
)
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
      AND ae.created_at::date BETWEEN start_date AND end_date
    LEFT JOIN public.subscriptions s ON s.user_id = au.id
      AND (s.expires_at IS NULL OR s.expires_at > now())
      AND s.status = 'active'
    WHERE au.created_at::date <= end_date
  ),
  previous_period AS (
    SELECT 
      COUNT(DISTINCT au.id) as prev_total_users,
      COUNT(DISTINCT CASE WHEN ae.user_id IS NOT NULL THEN ae.user_id END) as prev_active_users,
      COUNT(DISTINCT CASE WHEN s.user_id IS NOT NULL AND s.plan != 'free' THEN s.user_id END) as prev_subscribers
    FROM auth.users au
    LEFT JOIN public.app_events ae ON ae.user_id = au.id 
      AND ae.created_at::date BETWEEN comparison_start_date AND comparison_end_date
    LEFT JOIN public.subscriptions s ON s.user_id = au.id
      AND (s.expires_at IS NULL OR s.expires_at > comparison_end_date)
      AND s.status = 'active'
    WHERE au.created_at::date <= comparison_end_date
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