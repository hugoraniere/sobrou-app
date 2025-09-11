-- Fix search path for generate_slug function
CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
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

-- Fix search path for auto_generate_slug function
CREATE OR REPLACE FUNCTION public.auto_generate_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Only generate slug if it's empty or null
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.title);
  END IF;
  
  RETURN NEW;
END;
$$;