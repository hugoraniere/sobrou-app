-- Add fields for installment payments and recurrence end date
ALTER TABLE public.transactions 
ADD COLUMN recurrence_end_date DATE,
ADD COLUMN installment_total INTEGER,
ADD COLUMN installment_index INTEGER;