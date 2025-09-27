-- Enhance plans table with better structure
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS trial_days INTEGER DEFAULT 0;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS max_transactions INTEGER;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS max_ai_messages INTEGER;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS max_exports INTEGER;

-- Enhance subscriptions table for trial system
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT false;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS trial_used BOOLEAN DEFAULT false;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS conversion_source TEXT;

-- Create usage tracking table
CREATE TABLE IF NOT EXISTS public.usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_type TEXT NOT NULL, -- 'transaction', 'ai_message', 'export', etc.
    usage_count INTEGER DEFAULT 1,
    period_start DATE NOT NULL DEFAULT CURRENT_DATE,
    period_end DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 month'),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trial configuration table
CREATE TABLE IF NOT EXISTS public.trial_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trial_duration_days INTEGER NOT NULL DEFAULT 14,
    trial_plan_id UUID REFERENCES public.plans(id),
    email_sequence JSONB DEFAULT '[]', -- Email automation config
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create plan limits configuration table
CREATE TABLE IF NOT EXISTS public.plan_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL, -- matches features from planFeatures.ts
    limit_value INTEGER, -- null means unlimited
    limit_type TEXT NOT NULL DEFAULT 'count', -- 'count', 'boolean', 'tier'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(plan_id, feature_key)
);

-- Enable RLS on new tables
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for usage_tracking
CREATE POLICY "Users can view their own usage" ON public.usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON public.usage_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all usage" ON public.usage_tracking
    FOR ALL USING (is_admin());

-- RLS Policies for trial_config
CREATE POLICY "Admins can manage trial config" ON public.trial_config
    FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view active trial config" ON public.trial_config
    FOR SELECT USING (is_active = true);

-- RLS Policies for plan_limits
CREATE POLICY "Admins can manage plan limits" ON public.plan_limits
    FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view plan limits" ON public.plan_limits
    FOR SELECT USING (true);

-- Insert default plan limits for existing plans
INSERT INTO public.plan_limits (plan_id, feature_key, limit_value, limit_type)
SELECT 
    p.id,
    feature.key,
    CASE 
        WHEN p.name ILIKE '%free%' OR p.name ILIKE '%gratuito%' THEN
            CASE 
                WHEN feature.key = 'transactions' THEN 50
                WHEN feature.key = 'ai_messages' THEN 20
                WHEN feature.key = 'exports' THEN 2
                WHEN feature.key = 'bills' THEN 10
                WHEN feature.key = 'shopping_lists' THEN 5
                ELSE 0
            END
        WHEN p.name ILIKE '%pro%' OR p.name ILIKE '%essencial%' THEN
            CASE 
                WHEN feature.key = 'transactions' THEN 500
                WHEN feature.key = 'ai_messages' THEN 200
                WHEN feature.key = 'exports' THEN 20
                WHEN feature.key = 'bills' THEN 100
                WHEN feature.key = 'shopping_lists' THEN 50
                ELSE 1
            END
        ELSE NULL -- Premium unlimited
    END,
    'count'
FROM public.plans p
CROSS JOIN (
    SELECT 'transactions' as key
    UNION SELECT 'ai_messages'
    UNION SELECT 'exports' 
    UNION SELECT 'bills'
    UNION SELECT 'shopping_lists'
    UNION SELECT 'ai_parser'
    UNION SELECT 'custom_categories'
    UNION SELECT 'multiple_accounts'
    UNION SELECT 'api_access'
    UNION SELECT 'priority_support'
) feature
WHERE NOT EXISTS (
    SELECT 1 FROM public.plan_limits pl 
    WHERE pl.plan_id = p.id AND pl.feature_key = feature.key
);

-- Create function to get user's current plan limits
CREATE OR REPLACE FUNCTION public.get_user_plan_limits(target_user_id UUID)
RETURNS TABLE(feature_key TEXT, limit_value INTEGER, current_usage BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pl.feature_key,
        pl.limit_value,
        COALESCE(ut.usage_count, 0) as current_usage
    FROM public.plan_limits pl
    JOIN public.subscriptions s ON s.plan = (SELECT name FROM public.plans WHERE id = pl.plan_id)
    LEFT JOIN (
        SELECT 
            feature_type,
            SUM(usage_count) as usage_count
        FROM public.usage_tracking 
        WHERE user_id = target_user_id 
        AND period_start <= CURRENT_DATE 
        AND period_end >= CURRENT_DATE
        GROUP BY feature_type
    ) ut ON ut.feature_type = pl.feature_key
    WHERE s.user_id = target_user_id 
    AND (s.expires_at IS NULL OR s.expires_at > now())
    AND s.status = 'active';
END;
$$;

-- Create function to track usage
CREATE OR REPLACE FUNCTION public.track_feature_usage(
    target_user_id UUID,
    feature_name TEXT,
    usage_amount INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_period_start DATE;
    current_period_end DATE;
BEGIN
    -- Calculate current billing period
    current_period_start := date_trunc('month', CURRENT_DATE)::DATE;
    current_period_end := (current_period_start + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    
    -- Insert or update usage tracking
    INSERT INTO public.usage_tracking (
        user_id, 
        feature_type, 
        usage_count, 
        period_start, 
        period_end
    ) VALUES (
        target_user_id,
        feature_name,
        usage_amount,
        current_period_start,
        current_period_end
    )
    ON CONFLICT (user_id, feature_type, period_start) 
    DO UPDATE SET 
        usage_count = usage_tracking.usage_count + usage_amount,
        updated_at = now();
    
    RETURN true;
END;
$$;