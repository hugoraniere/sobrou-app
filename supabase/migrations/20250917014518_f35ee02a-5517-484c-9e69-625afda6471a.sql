-- Create onboarding progress table
CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  goal TEXT CHECK (goal IN ('dividas', 'organizar', 'cartao')),
  effort_minutes INTEGER,
  steps_completed TEXT[] DEFAULT '{}',
  quickwin_done BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payables table (contas a pagar BETA)
CREATE TABLE IF NOT EXISTS public.payables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  due_date DATE NOT NULL,
  repeats_monthly BOOLEAN DEFAULT false,
  status TEXT CHECK (status IN ('aberta', 'paga', 'vencida')) DEFAULT 'aberta',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on onboarding_progress
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding_progress
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

-- Enable RLS on payables
ALTER TABLE public.payables ENABLE ROW LEVEL SECURITY;

-- Create policies for payables
CREATE POLICY "Users can view their own payables" 
ON public.payables 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payables" 
ON public.payables 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payables" 
ON public.payables 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payables" 
ON public.payables 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at on onboarding_progress
CREATE TRIGGER update_onboarding_progress_updated_at
BEFORE UPDATE ON public.onboarding_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on payables
CREATE TRIGGER update_payables_updated_at
BEFORE UPDATE ON public.payables
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();