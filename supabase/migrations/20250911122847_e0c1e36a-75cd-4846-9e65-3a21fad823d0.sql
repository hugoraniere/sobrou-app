-- Fix the get_user_retention_cohorts function
CREATE OR REPLACE FUNCTION public.get_user_retention_cohorts(weeks_back integer DEFAULT 12)
 RETURNS TABLE(cohort_week date, users_count bigint, week_0 bigint, week_1 bigint, week_2 bigint, week_3 bigint, week_4 bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
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
      FLOOR(EXTRACT(days FROM age(ae.created_at, ufa.cohort_week)) / 7) AS weeks_since_cohort
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
$function$