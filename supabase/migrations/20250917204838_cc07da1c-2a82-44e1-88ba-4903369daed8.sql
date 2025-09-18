-- Create modal informativo slides table
CREATE TABLE public.modal_informativo_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  modal_id UUID NOT NULL,
  slide_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cta_text TEXT,
  cta_url TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image', -- image, video, gif
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create modal informativo config table
CREATE TABLE public.modal_informativo_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  auto_transition BOOLEAN NOT NULL DEFAULT false,
  transition_time INTEGER DEFAULT 5000,
  show_indicators BOOLEAN NOT NULL DEFAULT true,
  show_navigation BOOLEAN NOT NULL DEFAULT true,
  visibility_rules JSONB DEFAULT '{"show_on": "first_access", "target_users": "all"}',
  colors JSONB DEFAULT '{"primary": "#10b981", "background": "#ffffff", "text": "#374151"}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.modal_informativo_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modal_informativo_config ENABLE ROW LEVEL SECURITY;

-- RLS policies for modal_informativo_slides
CREATE POLICY "Admins can manage modal slides"
ON public.modal_informativo_slides
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Anyone can view active modal slides"
ON public.modal_informativo_slides
FOR SELECT
USING (is_active = true);

-- RLS policies for modal_informativo_config
CREATE POLICY "Admins can manage modal config"
ON public.modal_informativo_config
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Anyone can view modal config"
ON public.modal_informativo_config
FOR SELECT
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_modal_slides_updated_at
  BEFORE UPDATE ON public.modal_informativo_slides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modal_config_updated_at
  BEFORE UPDATE ON public.modal_informativo_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();