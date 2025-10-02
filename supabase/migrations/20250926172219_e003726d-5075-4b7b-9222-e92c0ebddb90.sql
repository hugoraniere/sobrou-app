-- Migrar imagens existentes para a galeria
-- Inserir dados de imagens das configurações da landing page na tabela gallery_images

INSERT INTO public.gallery_images (
  file_name,
  original_name,
  file_path,
  bucket_name,
  category,
  alt_text,
  file_size,
  mime_type,
  upload_source,
  uploaded_by,
  is_optimized,
  seo_score
)
SELECT 
  SUBSTRING(lpc.content->>'background_image' FROM '.*\/([^\/]+)$') as file_name,
  SUBSTRING(lpc.content->>'background_image' FROM '.*\/([^\/]+)$') as original_name,
  SUBSTRING(lpc.content->>'background_image' FROM 'storage/v1/object/public/landing-page/(.*)$') as file_path,
  'landing-page' as bucket_name,
  'hero' as category,
  'Hero background image' as alt_text,
  0 as file_size,
  'image/jpeg' as mime_type,
  'migration' as upload_source,
  NULL as uploaded_by,
  false as is_optimized,
  50 as seo_score
FROM public.landing_page_config lpc 
WHERE lpc.section_key = 'hero' 
  AND lpc.content->>'background_image' IS NOT NULL 
  AND lpc.content->>'background_image' != ''
  AND NOT EXISTS (
    SELECT 1 FROM public.gallery_images gi 
    WHERE gi.file_name = SUBSTRING(lpc.content->>'background_image' FROM '.*\/([^\/]+)$')
  );