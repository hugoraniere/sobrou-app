-- Criar tabela onboarding_anchors para armazenar metadados das âncoras do Product Tour
CREATE TABLE public.onboarding_anchors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route TEXT NOT NULL,
  anchor_id TEXT NOT NULL UNIQUE,
  friendly_name TEXT NOT NULL,
  selector TEXT NOT NULL,
  thumb_url TEXT,
  width INTEGER,
  height INTEGER,
  kind TEXT CHECK (kind IN ('botao', 'input', 'grafico', 'card', 'outro')) DEFAULT 'outro',
  tags TEXT[],
  last_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX idx_onboarding_anchors_route ON public.onboarding_anchors(route);
CREATE INDEX idx_onboarding_anchors_friendly_name ON public.onboarding_anchors(friendly_name);
CREATE INDEX idx_onboarding_anchors_anchor_id ON public.onboarding_anchors(anchor_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_onboarding_anchors_updated_at
  BEFORE UPDATE ON public.onboarding_anchors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.onboarding_anchors ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Admins podem gerenciar tudo
CREATE POLICY "Admins can manage onboarding anchors"
  ON public.onboarding_anchors
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Qualquer um pode visualizar âncoras ativas (para o preview)
CREATE POLICY "Anyone can view onboarding anchors"
  ON public.onboarding_anchors
  FOR SELECT
  USING (true);

-- Criar bucket para thumbnails das âncoras
INSERT INTO storage.buckets (id, name, public) 
VALUES ('onboarding-thumbs', 'onboarding-thumbs', true);

-- Políticas para o bucket de thumbnails
CREATE POLICY "Anyone can view onboarding thumbnails"
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'onboarding-thumbs');

CREATE POLICY "Admins can upload onboarding thumbnails"
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'onboarding-thumbs' AND is_admin());

CREATE POLICY "Admins can update onboarding thumbnails"
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'onboarding-thumbs' AND is_admin());

CREATE POLICY "Admins can delete onboarding thumbnails"
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'onboarding-thumbs' AND is_admin());

-- RPC para busca fuzzy de âncoras com paginação
CREATE OR REPLACE FUNCTION public.anchors_search(
  route_filter TEXT DEFAULT NULL,
  search_query TEXT DEFAULT '',
  kind_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  route TEXT,
  anchor_id TEXT,
  friendly_name TEXT,
  selector TEXT,
  thumb_url TEXT,
  width INTEGER,
  height INTEGER,
  kind TEXT,
  tags TEXT[],
  last_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    oa.id,
    oa.route,
    oa.anchor_id,
    oa.friendly_name,
    oa.selector,
    oa.thumb_url,
    oa.width,
    oa.height,
    oa.kind,
    oa.tags,
    oa.last_verified_at,
    oa.created_at,
    oa.updated_at
  FROM public.onboarding_anchors oa
  WHERE 
    (route_filter IS NULL OR oa.route = route_filter)
    AND (kind_filter IS NULL OR oa.kind = kind_filter)
    AND (
      search_query = '' OR
      oa.friendly_name ILIKE '%' || search_query || '%' OR
      oa.anchor_id ILIKE '%' || search_query || '%' OR
      oa.route ILIKE '%' || search_query || '%'
    )
  ORDER BY 
    -- Relevância: exact match primeiro, depois partial matches
    CASE 
      WHEN oa.friendly_name ILIKE search_query THEN 1
      WHEN oa.anchor_id ILIKE search_query THEN 2
      WHEN oa.friendly_name ILIKE search_query || '%' THEN 3
      WHEN oa.anchor_id ILIKE search_query || '%' THEN 4
      ELSE 5
    END,
    oa.updated_at DESC
  LIMIT limit_count 
  OFFSET offset_count;
$$;