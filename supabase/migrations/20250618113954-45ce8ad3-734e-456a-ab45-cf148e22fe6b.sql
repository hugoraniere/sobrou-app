
-- Adicionar campos de recorrência na tabela bills_to_pay
ALTER TABLE public.bills_to_pay 
ADD COLUMN is_recurring BOOLEAN DEFAULT false,
ADD COLUMN recurrence_frequency TEXT DEFAULT 'monthly',
ADD COLUMN next_due_date DATE;

-- Criar índice para melhor performance nas consultas de recorrência
CREATE INDEX idx_bills_to_pay_is_recurring ON public.bills_to_pay(user_id, is_recurring, next_due_date);
