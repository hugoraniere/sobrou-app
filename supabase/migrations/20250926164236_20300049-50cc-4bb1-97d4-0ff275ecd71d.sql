-- Criar tabela para metadados das imagens na galeria
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  bucket_name TEXT NOT NULL DEFAULT 'landing-page',
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT DEFAULT 'general',
  is_optimized BOOLEAN DEFAULT false,
  optimization_level TEXT DEFAULT 'medium', -- low, medium, high
  formats_available JSONB DEFAULT '{"original": true, "webp": false, "avif": false}'::jsonb,
  seo_score INTEGER DEFAULT 0, -- 0-100 score
  upload_source TEXT DEFAULT 'manual', -- manual, release-notes, blog, landing-page
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Admins can manage all gallery images"
ON public.gallery_images
FOR ALL
USING (is_admin() OR is_editor())
WITH CHECK (is_admin() OR is_editor());

CREATE POLICY "Anyone can view gallery images"
ON public.gallery_images
FOR SELECT
USING (true);

-- Trigger para updated_at
CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_gallery_images_category ON public.gallery_images(category);
CREATE INDEX idx_gallery_images_tags ON public.gallery_images USING GIN(tags);
CREATE INDEX idx_gallery_images_upload_source ON public.gallery_images(upload_source);
CREATE INDEX idx_gallery_images_created_at ON public.gallery_images(created_at DESC);
CREATE INDEX idx_gallery_images_optimized ON public.gallery_images(is_optimized);

-- Atualizar config.toml para adicionar função de otimização
-- A função será criada separadamente