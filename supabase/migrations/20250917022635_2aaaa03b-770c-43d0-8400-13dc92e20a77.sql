-- Create onboarding_steps table
CREATE TABLE IF NOT EXISTS public.onboarding_steps (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  action_path TEXT NOT NULL,
  action_hint TEXT,
  completion_event TEXT NOT NULL,
  target_count INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update onboarding_progress table structure
DROP TABLE IF EXISTS public.onboarding_progress CASCADE;
CREATE TABLE public.onboarding_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  completed JSONB DEFAULT '{}'::jsonb,
  minimized BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for onboarding_steps
CREATE POLICY "Anyone can view active onboarding steps" 
ON public.onboarding_steps 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage onboarding steps" 
ON public.onboarding_steps 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- RLS policies for onboarding_progress
CREATE POLICY "Users can view their own onboarding progress" 
ON public.onboarding_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding progress" 
ON public.onboarding_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding progress" 
ON public.onboarding_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_onboarding_steps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_onboarding_steps_updated_at
BEFORE UPDATE ON public.onboarding_steps
FOR EACH ROW
EXECUTE FUNCTION public.update_onboarding_steps_updated_at();

CREATE TRIGGER update_onboarding_progress_updated_at
BEFORE UPDATE ON public.onboarding_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default steps
INSERT INTO public.onboarding_steps (key, title, description, action_path, completion_event, target_count, sort_order, active)
VALUES
('add_tx_1', 'Registre 1 transação', 'Adicione sua primeira despesa e veja os gráficos.', '/transacoes', 'transaction_created', 1, 10, true),
('add_tx_3', 'Registre 3 transações', 'Com 3 lançamentos, os insights melhoram.', '/transacoes', 'transaction_created', 3, 20, true),
('set_budget', 'Defina 1 orçamento', 'Escolha uma categoria existente e um valor mensal.', '/orcamentos', 'budget_created', 1, 30, true),
('add_debt', 'Cadastre 1 dívida', 'Monitore o que falta pagar.', '/dividas', 'debt_created', 1, 40, true)
ON CONFLICT (key) DO NOTHING;