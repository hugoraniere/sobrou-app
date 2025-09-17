-- Fix security vulnerability: Protect email addresses in blog_comments table
-- Remove any policies that allow public access to email addresses

-- First, check if there are any problematic public SELECT policies and drop them
DO $$
BEGIN
  -- Drop any existing policies that might allow public access to email addresses
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blog_comments' AND policyname = 'Anyone can view blog comments') THEN
    DROP POLICY "Anyone can view blog comments" ON public.blog_comments;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'blog_comments' AND policyname = 'Public can view approved blog comments') THEN
    DROP POLICY "Public can view approved blog comments" ON public.blog_comments;
  END IF;
END $$;

-- Ensure only admins and editors can view full blog comments (including email addresses)
-- The existing policy "Admins and editors can view all blog comments" should handle this

-- For public access, users should only use the get_public_blog_comments() function
-- which automatically masks email addresses using the mask_email() function

-- Add a restrictive policy to ensure no direct public access to email addresses
CREATE POLICY "Public cannot directly access blog comments with emails"
ON public.blog_comments
FOR SELECT
USING (
  -- Only allow access if user is admin/editor, or if accessing through approved methods
  (is_admin() OR is_editor())
);

-- Update the mask_email function to be more restrictive by default
CREATE OR REPLACE FUNCTION public.mask_email(email text, show_full boolean DEFAULT false)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- If show_full is true and user has permission, return full email
  IF show_full AND (is_admin() OR is_editor()) THEN
    RETURN email;
  END IF;
  
  -- Always mask for non-privileged users
  IF email IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Extract local and domain parts
  DECLARE
    local_part text;
    domain_part text;
    at_position int;
  BEGIN
    at_position := position('@' in email);
    
    -- If no @ found, return masked version
    IF at_position = 0 THEN
      RETURN '***@***.com';
    END IF;
    
    local_part := substring(email from 1 for at_position - 1);
    domain_part := substring(email from at_position + 1);
    
    -- Mask local part: show first char + *** + last char if more than 2 chars
    IF length(local_part) <= 2 THEN
      local_part := '***';
    ELSE
      local_part := substring(local_part from 1 for 1) || '***' || substring(local_part from length(local_part) for 1);
    END IF;
    
    -- Mask domain: show first char + *** + extension
    DECLARE
      dot_position int;
      domain_name text;
      extension text;
    BEGIN
      dot_position := position('.' in reverse(domain_part));
      
      IF dot_position = 0 THEN
        domain_part := '***';
      ELSE
        -- Get extension (everything after last dot)
        extension := substring(domain_part from length(domain_part) - dot_position + 2);
        -- Get domain name part
        domain_name := substring(domain_part from 1 for length(domain_part) - dot_position - 1);
        
        IF length(domain_name) <= 1 THEN
          domain_part := '***.' || extension;
        ELSE
          domain_part := substring(domain_name from 1 for 1) || '***.' || extension;
        END IF;
      END IF;
    END;
    
    RETURN local_part || '@' || domain_part;
  END;
END;
$$;