-- Create plans table for admin plan management
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
  features JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of feature objects with name and enabled
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active plans" 
ON public.plans 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all plans" 
ON public.plans 
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_plans_updated_at
BEFORE UPDATE ON public.plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default plans
INSERT INTO public.plans (name, description, price, features, is_active, is_featured, display_order) VALUES
('Gratuito', 'Perfeito para começar', 0, 
 '[{"name": "Transações", "enabled": true, "limit": "100/mês"}, 
   {"name": "Análises básicas", "enabled": true}, 
   {"name": "Metas de economia", "enabled": true}, 
   {"name": "Chat IA", "enabled": false}]'::jsonb, 
 true, false, 1),
('Pro', 'Para controle completo das finanças', 29.90, 
 '[{"name": "Transações", "enabled": true, "limit": "Ilimitadas"}, 
   {"name": "Análises avançadas", "enabled": true}, 
   {"name": "Metas de economia", "enabled": true}, 
   {"name": "Chat IA", "enabled": true}, 
   {"name": "Relatórios personalizados", "enabled": true}, 
   {"name": "WhatsApp Premium", "enabled": true}, 
   {"name": "Suporte prioritário", "enabled": true}]'::jsonb, 
 true, true, 2),
('Premium', 'Para empresários e profissionais', 49.90, 
 '[{"name": "Transações", "enabled": true, "limit": "Ilimitadas"}, 
   {"name": "Análises avançadas", "enabled": true}, 
   {"name": "Metas de economia", "enabled": true}, 
   {"name": "Chat IA", "enabled": true}, 
   {"name": "Relatórios personalizados", "enabled": true}, 
   {"name": "WhatsApp Premium", "enabled": true}, 
   {"name": "Suporte prioritário", "enabled": true},
   {"name": "API access", "enabled": true}, 
   {"name": "Múltiplas contas", "enabled": true}]'::jsonb, 
 true, false, 3);