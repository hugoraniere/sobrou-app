-- Create subscriptions table for tracking user subscription status
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
CREATE POLICY "Users can view their own subscription" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (is_admin());

-- Create function to get user metrics
CREATE OR REPLACE FUNCTION public.get_user_metrics(
  period_days integer DEFAULT 30
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
AS $$
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
$$;

-- Update search_users function to include last_access from app_events
CREATE OR REPLACE FUNCTION public.search_users(
  search_term text DEFAULT '',
  role_filter text DEFAULT 'all',
  sort_by text DEFAULT 'created_at',
  sort_order text DEFAULT 'DESC'
)
RETURNS TABLE(
  id uuid, 
  email text, 
  full_name text, 
  created_at timestamp with time zone, 
  roles text[],
  last_access timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH user_last_access AS (
    SELECT 
      user_id,
      MAX(created_at) as last_access_time
    FROM public.app_events
    WHERE event_type IN ('login', 'page_view', 'user_activity')
    GROUP BY user_id
  )
  SELECT 
    u.id,
    u.email,
    COALESCE(p.full_name, '') as full_name,
    u.created_at,
    COALESCE(
      array_agg(ur.role::text) FILTER (WHERE ur.role IS NOT NULL), 
      ARRAY[]::text[]
    ) as roles,
    ula.last_access_time as last_access
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  LEFT JOIN public.user_roles ur ON ur.user_id = u.id
  LEFT JOIN user_last_access ula ON ula.user_id = u.id
  WHERE 
    (search_term = '' OR 
     u.email ILIKE '%' || search_term || '%' OR 
     COALESCE(p.full_name, '') ILIKE '%' || search_term || '%')
    AND (
      role_filter = 'all' OR
      (role_filter = 'admin' AND EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = u.id AND role = 'admin')) OR
      (role_filter = 'editor' AND EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = u.id AND role = 'editor')) OR
      (role_filter = 'standard' AND NOT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = u.id))
    )
  GROUP BY u.id, u.email, p.full_name, u.created_at, ula.last_access_time
  ORDER BY 
    CASE 
      WHEN sort_by = 'email' AND sort_order = 'ASC' THEN u.email
      WHEN sort_by = 'full_name' AND sort_order = 'ASC' THEN COALESCE(p.full_name, '')
    END ASC,
    CASE 
      WHEN sort_by = 'email' AND sort_order = 'DESC' THEN u.email
      WHEN sort_by = 'full_name' AND sort_order = 'DESC' THEN COALESCE(p.full_name, '')
    END DESC,
    CASE 
      WHEN sort_by = 'created_at' AND sort_order = 'ASC' THEN u.created_at
      WHEN sort_by = 'last_access' AND sort_order = 'ASC' THEN ula.last_access_time
    END ASC,
    CASE 
      WHEN sort_by = 'created_at' AND sort_order = 'DESC' THEN u.created_at
      WHEN sort_by = 'last_access' AND sort_order = 'DESC' THEN ula.last_access_time
    END DESC
  LIMIT 100;
$$;