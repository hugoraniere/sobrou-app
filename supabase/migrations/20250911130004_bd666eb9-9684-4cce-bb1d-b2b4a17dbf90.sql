-- Fix security issue: Mask email addresses in public blog comments views
-- Create a security definer function to mask emails for public access

CREATE OR REPLACE FUNCTION public.mask_email(email text, show_full boolean DEFAULT false)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  -- If show_full is true or email is null, return as is
  IF show_full OR email IS NULL THEN
    RETURN email;
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

-- Create a function to get blog comments with masked emails for public access
CREATE OR REPLACE FUNCTION public.get_public_blog_comments(target_post_id uuid DEFAULT NULL)
RETURNS TABLE(
  id uuid,
  post_id uuid,
  user_id uuid,
  author_name text,
  author_email text,
  content text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    bc.id,
    bc.post_id,
    bc.user_id,
    bc.author_name,
    mask_email(bc.author_email, (is_admin() OR is_editor())) as author_email,
    bc.content,
    bc.status,
    bc.created_at,
    bc.updated_at
  FROM public.blog_comments bc
  WHERE bc.status = 'approved'
    AND (target_post_id IS NULL OR bc.post_id = target_post_id)
  ORDER BY bc.created_at DESC;
$$;

-- Update the existing policies to be more restrictive
DROP POLICY IF EXISTS "Anyone can view approved blog comments" ON public.blog_comments;

-- Create new restrictive policy for direct table access (admins/editors only for full data)
CREATE POLICY "Admins and editors can view full blog comments" 
ON public.blog_comments 
FOR SELECT 
USING (is_admin() OR is_editor());

-- Add comments explaining the security fix
COMMENT ON FUNCTION public.mask_email(text, boolean) IS 'Masks email addresses for public display while preserving full emails for administrators and editors. Used to prevent email harvesting from blog comments.';
COMMENT ON FUNCTION public.get_public_blog_comments(uuid) IS 'Secure function to retrieve blog comments with masked email addresses for public access. Prevents email harvesting attacks.';