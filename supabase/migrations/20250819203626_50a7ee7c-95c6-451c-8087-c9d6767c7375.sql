-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bill_due', 'spending_alert', 'goal', 'system')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  source_id UUID,
  source_table TEXT,
  day_bucket DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Add indexes for performance
CREATE INDEX idx_notifications_user_created ON public.notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_user_read ON public.notifications (user_id, read_at);
CREATE INDEX idx_notifications_user_type ON public.notifications (user_id, type);

-- Add unique constraint to prevent duplicate notifications
ALTER TABLE public.notifications ADD CONSTRAINT unique_user_notification_per_day 
UNIQUE (user_id, type, day_bucket, source_id);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
ON public.notifications 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add notification_settings column to user_preferences
ALTER TABLE public.user_preferences 
ADD COLUMN notification_settings JSONB DEFAULT '{"spending_alerts": true, "goal_achieved": true, "auto_suggestions": false, "bill_due": true}'::jsonb;