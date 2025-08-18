-- Atualizar a constraint valid_categories para incluir 'outros'
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS valid_categories;
ALTER TABLE public.transactions ADD CONSTRAINT valid_categories 
CHECK (category IN ('alimentacao', 'moradia', 'transporte', 'internet', 'cartao', 'saude', 'lazer', 'compras', 'investimentos', 'familia', 'doacoes', 'outros'));