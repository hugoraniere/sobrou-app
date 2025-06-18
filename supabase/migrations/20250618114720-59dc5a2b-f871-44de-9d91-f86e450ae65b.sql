
-- Criar tabela para transações das contas
CREATE TABLE public.bill_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_id UUID NOT NULL REFERENCES public.bills_to_pay(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('debit', 'credit')),
  description TEXT NOT NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS na tabela de transações
ALTER TABLE public.bill_transactions ENABLE ROW LEVEL SECURITY;

-- Política para visualizar transações próprias
CREATE POLICY "Users can view their own bill transactions" 
  ON public.bill_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para inserir transações próprias
CREATE POLICY "Users can create their own bill transactions" 
  ON public.bill_transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para atualizar transações próprias
CREATE POLICY "Users can update their own bill transactions" 
  ON public.bill_transactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para deletar transações próprias
CREATE POLICY "Users can delete their own bill transactions" 
  ON public.bill_transactions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar índice para melhor performance
CREATE INDEX idx_bill_transactions_bill_id ON public.bill_transactions(bill_id);
CREATE INDEX idx_bill_transactions_user_id ON public.bill_transactions(user_id);
