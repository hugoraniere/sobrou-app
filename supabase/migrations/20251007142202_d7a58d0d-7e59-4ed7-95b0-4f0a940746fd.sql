-- M2: Criar tabela mei_settings
CREATE TABLE IF NOT EXISTS public.mei_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tax_reserve_percentage NUMERIC NOT NULL DEFAULT 6,
  annual_limit NUMERIC NOT NULL DEFAULT 81000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.mei_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own MEI settings"
  ON public.mei_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MEI settings"
  ON public.mei_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MEI settings"
  ON public.mei_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all MEI settings"
  ON public.mei_settings FOR SELECT
  USING (is_admin());

-- Trigger para updated_at
CREATE TRIGGER update_mei_settings_updated_at
  BEFORE UPDATE ON public.mei_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- M3: Adicionar campos MEI às transactions
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS competence_date DATE,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'paid',
  ADD COLUMN IF NOT EXISTS client TEXT,
  ADD COLUMN IF NOT EXISTS project TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS source_id UUID,
  ADD COLUMN IF NOT EXISTS source_table TEXT;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_transactions_competence_date ON public.transactions(competence_date);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_source ON public.transactions(source_id, source_table);
CREATE INDEX IF NOT EXISTS idx_transactions_tags ON public.transactions USING GIN(tags);

-- M6: Criar tabela budgets
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, year, month, category)
);

-- Enable RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own budgets"
  ON public.budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets"
  ON public.budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
  ON public.budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
  ON public.budgets FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();