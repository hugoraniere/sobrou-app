-- M7: Adicionar campos de parcelas em bills_to_pay
ALTER TABLE public.bills_to_pay
ADD COLUMN installment_group_id UUID,
ADD COLUMN installment_index INTEGER,
ADD COLUMN installment_total INTEGER;

-- Adicionar índice para buscar séries de parcelas
CREATE INDEX idx_bills_installment_group ON public.bills_to_pay(installment_group_id) WHERE installment_group_id IS NOT NULL;

-- M7: Criar tabela de templates de contas
CREATE TABLE public.bill_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  default_amount NUMERIC NOT NULL DEFAULT 0,
  recurrence_frequency TEXT CHECK (recurrence_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS para bill_templates
ALTER TABLE public.bill_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active bill templates"
ON public.bill_templates FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage bill templates"
ON public.bill_templates FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Trigger para atualizar updated_at
CREATE TRIGGER update_bill_templates_updated_at
BEFORE UPDATE ON public.bill_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: Template DAS MEI
INSERT INTO public.bill_templates (name, description, default_amount, recurrence_frequency, category)
VALUES 
  ('DAS MEI', 'Documento de Arrecadação do Simples Nacional - Imposto mensal do MEI', 75.00, 'monthly', 'impostos'),
  ('Aluguel', 'Pagamento mensal de aluguel', 0, 'monthly', 'moradia'),
  ('Energia Elétrica', 'Conta de luz mensal', 0, 'monthly', 'utilidades'),
  ('Internet', 'Conta de internet mensal', 0, 'monthly', 'utilidades');