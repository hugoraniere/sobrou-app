-- Create admin_settings table for managing application settings
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access (for now, anyone can read/write - later can be restricted to admin users)
CREATE POLICY "Anyone can manage admin settings" 
ON public.admin_settings 
FOR ALL
USING (true);

-- Insert default settings
INSERT INTO public.admin_settings (setting_key, setting_value, description) 
VALUES 
  ('pwa_prompt_enabled', 'false', 'Controls whether the PWA installation prompt is shown to users')
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_admin_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_admin_settings_updated_at();