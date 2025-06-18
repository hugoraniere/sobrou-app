
-- Create table for bills to pay
CREATE TABLE public.bills_to_pay (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  description TEXT,
  notes TEXT,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  paid_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bills_to_pay ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own bills" 
  ON public.bills_to_pay 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bills" 
  ON public.bills_to_pay 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bills" 
  ON public.bills_to_pay 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bills" 
  ON public.bills_to_pay 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance on queries
CREATE INDEX idx_bills_to_pay_user_id_due_date ON public.bills_to_pay(user_id, due_date);
CREATE INDEX idx_bills_to_pay_user_id_is_paid ON public.bills_to_pay(user_id, is_paid);
