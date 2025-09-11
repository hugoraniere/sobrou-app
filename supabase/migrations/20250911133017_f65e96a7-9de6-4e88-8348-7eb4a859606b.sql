-- Create featured posts table for blog hero management
CREATE TABLE IF NOT EXISTS public.blog_featured_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  cta_text TEXT,
  cta_url TEXT,
  display_order INTEGER DEFAULT 1,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blog_featured_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for featured posts (admin/editor only)
CREATE POLICY "Admins and editors can manage featured posts" 
ON public.blog_featured_posts 
FOR ALL 
USING (is_admin() OR is_editor())
WITH CHECK (is_admin() OR is_editor());

CREATE POLICY "Anyone can view active featured posts" 
ON public.blog_featured_posts 
FOR SELECT 
USING (is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));

-- Create function to get active featured post
CREATE OR REPLACE FUNCTION public.get_active_featured_post()
RETURNS TABLE(
  id UUID,
  post_id UUID,
  cta_text TEXT,
  cta_url TEXT,
  post_title TEXT,
  post_subtitle TEXT,
  post_content TEXT,
  post_cover_image_url TEXT,
  post_slug TEXT,
  post_published_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    fp.id,
    fp.post_id,
    fp.cta_text,
    fp.cta_url,
    bp.title as post_title,
    bp.subtitle as post_subtitle,
    bp.content as post_content,
    bp.cover_image_url as post_cover_image_url,
    bp.slug as post_slug,
    bp.published_at as post_published_at
  FROM public.blog_featured_posts fp
  JOIN public.blog_posts bp ON fp.post_id = bp.id
  WHERE fp.is_active = true
    AND (fp.start_date IS NULL OR fp.start_date <= NOW())
    AND (fp.end_date IS NULL OR fp.end_date >= NOW())
  ORDER BY fp.display_order ASC, fp.created_at DESC
  LIMIT 1;
$function$;

-- Create trigger for updated_at
CREATE TRIGGER update_blog_featured_posts_updated_at
BEFORE UPDATE ON public.blog_featured_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();