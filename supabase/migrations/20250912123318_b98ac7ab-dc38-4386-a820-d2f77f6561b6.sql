-- Corrigir search_path das funções para resolver warnings de segurança

CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ticket_number = 'SUP-' || LPAD(nextval('ticket_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.calculate_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reading_time_minutes = GREATEST(1, CEILING(LENGTH(NEW.content) / 1000.0)); -- ~1000 caracteres por minuto
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_support_agent()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role(auth.uid(), 'support_agent') OR public.has_role(auth.uid(), 'support_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_support_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role(auth.uid(), 'support_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;