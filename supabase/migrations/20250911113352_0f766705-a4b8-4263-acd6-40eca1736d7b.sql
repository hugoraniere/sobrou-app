-- Enable unaccent extension
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Add slug column to blog_posts table
ALTER TABLE public.blog_posts ADD COLUMN slug text;

-- Create unique index for slug
CREATE UNIQUE INDEX blog_posts_slug_unique ON public.blog_posts(slug);

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
BEGIN
  -- Remove accents and convert to lowercase
  base_slug := lower(unaccent(title));
  
  -- Replace spaces and special characters with hyphens
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  
  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);
  
  -- Ensure slug is not empty
  IF base_slug = '' THEN
    base_slug := 'post';
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- Backfill slugs for existing posts
UPDATE public.blog_posts 
SET slug = public.generate_slug(title) 
WHERE slug IS NULL;

-- Make slug column NOT NULL after backfilling
ALTER TABLE public.blog_posts ALTER COLUMN slug SET NOT NULL;

-- Function to auto-generate slug on insert/update
CREATE OR REPLACE FUNCTION public.auto_generate_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only generate slug if it's empty or null
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.title);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto-generating slugs
CREATE TRIGGER blog_posts_auto_slug
  BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_slug();

-- Update the existing get_public_blog_posts function to include slug
CREATE OR REPLACE FUNCTION public.get_public_blog_posts(search_term text DEFAULT ''::text, page_size integer DEFAULT 10, page_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, title text, subtitle text, content text, cover_image_url text, published_at timestamp with time zone, created_at timestamp with time zone, updated_at timestamp with time zone, user_id uuid, slug text, tags jsonb, like_count bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    bp.id,
    bp.title,
    bp.subtitle,
    bp.content,
    bp.cover_image_url,
    bp.published_at,
    bp.created_at,
    bp.updated_at,
    bp.user_id,
    bp.slug,
    COALESCE(
      json_agg(
        json_build_object('id', bt.id, 'name', bt.name)
      ) FILTER (WHERE bt.id IS NOT NULL),
      '[]'::json
    )::jsonb as tags,
    COALESCE(like_counts.like_count, 0) as like_count
  FROM public.blog_posts bp
  LEFT JOIN public.blog_post_tags bpt ON bp.id = bpt.post_id
  LEFT JOIN public.blog_tags bt ON bpt.tag_id = bt.id
  LEFT JOIN (
    SELECT bpl.post_id, COUNT(*) as like_count
    FROM public.blog_post_likes bpl
    GROUP BY bpl.post_id
  ) like_counts ON bp.id = like_counts.post_id
  WHERE 
    (search_term = '' OR 
     bp.title ILIKE '%' || search_term || '%' OR 
     bp.subtitle ILIKE '%' || search_term || '%' OR
     bp.content ILIKE '%' || search_term || '%')
  GROUP BY bp.id, bp.title, bp.subtitle, bp.content, bp.cover_image_url, 
           bp.published_at, bp.created_at, bp.updated_at, bp.user_id, bp.slug, like_counts.like_count
  ORDER BY bp.published_at DESC
  LIMIT page_size OFFSET page_offset;
$function$;

-- Create new function to get blog post by slug
CREATE OR REPLACE FUNCTION public.get_public_blog_post_by_slug(target_slug text)
 RETURNS TABLE(id uuid, title text, subtitle text, content text, cover_image_url text, published_at timestamp with time zone, created_at timestamp with time zone, updated_at timestamp with time zone, user_id uuid, slug text, tags jsonb, like_count bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    bp.id,
    bp.title,
    bp.subtitle,
    bp.content,
    bp.cover_image_url,
    bp.published_at,
    bp.created_at,
    bp.updated_at,
    bp.user_id,
    bp.slug,
    COALESCE(
      json_agg(
        json_build_object('id', bt.id, 'name', bt.name)
      ) FILTER (WHERE bt.id IS NOT NULL),
      '[]'::json
    )::jsonb as tags,
    COALESCE(like_counts.like_count, 0) as like_count
  FROM public.blog_posts bp
  LEFT JOIN public.blog_post_tags bpt ON bp.id = bpt.post_id
  LEFT JOIN public.blog_tags bt ON bpt.tag_id = bt.id
  LEFT JOIN (
    SELECT bpl.post_id, COUNT(*) as like_count
    FROM public.blog_post_likes bpl
    GROUP BY bpl.post_id
  ) like_counts ON bp.id = like_counts.post_id
  WHERE bp.slug = target_slug
  GROUP BY bp.id, bp.title, bp.subtitle, bp.content, bp.cover_image_url, 
           bp.published_at, bp.created_at, bp.updated_at, bp.user_id, bp.slug, like_counts.like_count;
$function$;

-- Update the existing get_public_blog_post function to include slug
CREATE OR REPLACE FUNCTION public.get_public_blog_post(target_post_id uuid)
 RETURNS TABLE(id uuid, title text, subtitle text, content text, cover_image_url text, published_at timestamp with time zone, created_at timestamp with time zone, updated_at timestamp with time zone, user_id uuid, slug text, tags jsonb, like_count bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    bp.id,
    bp.title,
    bp.subtitle,
    bp.content,
    bp.cover_image_url,
    bp.published_at,
    bp.created_at,
    bp.updated_at,
    bp.user_id,
    bp.slug,
    COALESCE(
      json_agg(
        json_build_object('id', bt.id, 'name', bt.name)
      ) FILTER (WHERE bt.id IS NOT NULL),
      '[]'::json
    )::jsonb as tags,
    COALESCE(like_counts.like_count, 0) as like_count
  FROM public.blog_posts bp
  LEFT JOIN public.blog_post_tags bpt ON bp.id = bpt.post_id
  LEFT JOIN public.blog_tags bt ON bpt.tag_id = bt.id
  LEFT JOIN (
    SELECT bpl.post_id, COUNT(*) as like_count
    FROM public.blog_post_likes bpl
    GROUP BY bpl.post_id
  ) like_counts ON bp.id = like_counts.post_id
  WHERE bp.id = target_post_id
  GROUP BY bp.id, bp.title, bp.subtitle, bp.content, bp.cover_image_url, 
           bp.published_at, bp.created_at, bp.updated_at, bp.user_id, bp.slug, like_counts.like_count;
$function$;