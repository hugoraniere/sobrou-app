-- Create table for onboarding configuration
CREATE TABLE public.onboarding_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage onboarding config"
ON public.onboarding_config
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Anyone can view onboarding config"
ON public.onboarding_config
FOR SELECT
USING (true);

-- Insert default configurations
INSERT INTO public.onboarding_config (section_key, content, is_visible) VALUES 
('welcome_modal', '{
  "title": "Bem-vindo ao Sobrou 👋",
  "subtitle": "Este onboarding pode ser configurado no Admin. Em 1 minuto você deixa tudo pronto.",
  "image": "",
  "cta_start": "Começar",
  "cta_close": "Fechar",
  "show_admin_button": true
}'::jsonb, true),

('get_started_stepper', '{
  "title": "Primeiros Passos",
  "show_progress": true,
  "show_minimize": true,
  "completion_message": "Parabéns! Você concluiu todos os passos.",
  "colors": {
    "primary": "#10b981",
    "background": "#ffffff",
    "text": "#374151"
  }
}'::jsonb, true),

('general_settings', '{
  "auto_show_welcome": true,
  "auto_complete_steps": true,
  "show_completion_celebration": true,
  "reset_on_new_users": false
}'::jsonb, true);