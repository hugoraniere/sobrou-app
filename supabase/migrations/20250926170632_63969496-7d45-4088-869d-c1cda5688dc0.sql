-- Adicionar campos para posicionamento de imagem e botão secundário personalizado
ALTER TABLE public.release_notes 
ADD COLUMN image_position TEXT DEFAULT 'center',
ADD COLUMN secondary_button_text TEXT DEFAULT 'Fechar',
ADD COLUMN secondary_button_action TEXT DEFAULT 'close',
ADD COLUMN secondary_button_url TEXT;

-- Adicionar constraints para valores válidos
ALTER TABLE public.release_notes 
ADD CONSTRAINT check_image_position 
CHECK (image_position IN ('left', 'center', 'right'));

ALTER TABLE public.release_notes 
ADD CONSTRAINT check_secondary_button_action 
CHECK (secondary_button_action IN ('close', 'custom_link'));

-- Função para garantir apenas uma release note ativa por vez
CREATE OR REPLACE FUNCTION ensure_single_active_release_note() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Se a nova release note está sendo ativada
  IF NEW.is_active = true THEN
    -- Desativar todas as outras release notes
    UPDATE public.release_notes 
    SET is_active = false 
    WHERE id != NEW.id AND is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para garantir única release note ativa
CREATE TRIGGER trigger_ensure_single_active_release_note
  BEFORE INSERT OR UPDATE ON public.release_notes
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_active_release_note();