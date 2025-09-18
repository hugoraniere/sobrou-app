-- Entrega 1 - Correções da Infraestrutura Base

-- 1) Criar schema extensions e instalar extensões
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 2) Corrigir tabela onboarding_anchors
-- Primeiro, remover constraint existente se houver
ALTER TABLE public.onboarding_anchors DROP CONSTRAINT IF EXISTS onboarding_anchors_kind_check;

-- Adicionar constraint correto para kind (valores em inglês)
ALTER TABLE public.onboarding_anchors ADD CONSTRAINT onboarding_anchors_kind_check 
CHECK (kind IN ('button','input','select','table','chart','card','list','tabs','other'));

-- Tornar selector nullable (já é, mas garantindo)
ALTER TABLE public.onboarding_anchors ALTER COLUMN selector DROP NOT NULL;

-- 3) Criar índices trigram corretos (remover os antigos primeiro)
DROP INDEX IF EXISTS idx_onb_anchors_friendly_trgm;
DROP INDEX IF EXISTS idx_onb_anchors_anchor_trgm;

-- Criar índices trigram com referência correta ao schema extensions
CREATE INDEX IF NOT EXISTS idx_onb_anchors_friendly_trgm
  ON public.onboarding_anchors USING gin (friendly_name extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_onb_anchors_anchor_trgm
  ON public.onboarding_anchors USING gin (anchor_id extensions.gin_trgm_ops);

-- 4) Corrigir RLS Policies - usar JWT claim role='admin'
DROP POLICY IF EXISTS "Anyone can view onboarding anchors" ON public.onboarding_anchors;
DROP POLICY IF EXISTS "Admins can manage onboarding anchors" ON public.onboarding_anchors;

-- Políticas baseadas em JWT claim role='admin'
CREATE POLICY "Admin can select anchors"
  ON public.onboarding_anchors
  FOR SELECT
  USING (COALESCE((auth.jwt() ->> 'role'), '') = 'admin');

CREATE POLICY "Admin can insert anchors"
  ON public.onboarding_anchors
  FOR INSERT
  WITH CHECK (COALESCE((auth.jwt() ->> 'role'), '') = 'admin');

CREATE POLICY "Admin can update anchors"
  ON public.onboarding_anchors
  FOR UPDATE
  USING (COALESCE((auth.jwt() ->> 'role'), '') = 'admin')
  WITH CHECK (COALESCE((auth.jwt() ->> 'role'), '') = 'admin');

CREATE POLICY "Admin can delete anchors"
  ON public.onboarding_anchors
  FOR DELETE
  USING (COALESCE((auth.jwt() ->> 'role'), '') = 'admin');

-- 5) Corrigir RPC anchors_search com nomes de parâmetros corretos
DROP FUNCTION IF EXISTS public.anchors_search(text, text, text, integer, integer);

CREATE OR REPLACE FUNCTION public.anchors_search(
  p_route  text DEFAULT NULL,
  p_q      text DEFAULT NULL,
  p_kind   text DEFAULT NULL,
  p_limit  int  DEFAULT 50,
  p_offset int  DEFAULT 0
)
RETURNS SETOF public.onboarding_anchors
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM public.onboarding_anchors
  WHERE (p_route IS NULL OR route = p_route)
    AND (p_kind  IS NULL OR kind  = p_kind)
    AND (
      p_q IS NULL OR
      friendly_name ILIKE '%' || p_q || '%' OR
      anchor_id     ILIKE '%' || p_q || '%' OR
      (p_route IS NULL AND route ILIKE '%' || p_q || '%')
    )
  ORDER BY route, friendly_name
  LIMIT p_limit OFFSET p_offset;
$$;

-- 6) Implementar anchor_upsert (idempotente)
CREATE OR REPLACE FUNCTION public.anchor_upsert(
  p_route         text,
  p_anchor_id     text,
  p_friendly_name text,
  p_selector      text DEFAULT NULL,
  p_kind          text DEFAULT 'other',
  p_thumb_url     text DEFAULT NULL,
  p_width         int  DEFAULT NULL,
  p_height        int  DEFAULT NULL
) RETURNS public.onboarding_anchors
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v public.onboarding_anchors;
BEGIN
  INSERT INTO public.onboarding_anchors
    (route, anchor_id, friendly_name, selector, kind, thumb_url, width, height, last_verified_at, updated_at)
  VALUES
    (p_route, p_anchor_id, p_friendly_name, p_selector, p_kind, p_thumb_url, p_width, p_height, now(), now())
  ON CONFLICT (anchor_id) DO UPDATE SET
    route            = EXCLUDED.route,
    friendly_name    = EXCLUDED.friendly_name,
    selector         = EXCLUDED.selector,
    kind             = EXCLUDED.kind,
    thumb_url        = EXCLUDED.thumb_url,
    width            = EXCLUDED.width,
    height           = EXCLUDED.height,
    last_verified_at = now(),
    updated_at       = now()
  RETURNING * INTO v;

  RETURN v;
END
$$;

-- 7) Implementar anchor_mark_verified
CREATE OR REPLACE FUNCTION public.anchor_mark_verified(
  p_anchor_id text
) RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.onboarding_anchors
     SET last_verified_at = now(),
         updated_at       = now()
   WHERE anchor_id = p_anchor_id;
$$;