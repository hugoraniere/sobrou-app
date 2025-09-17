-- Complete lockdown of blog_comments table to protect email addresses
-- Only allow access through the secure get_public_blog_comments() function

-- Drop ALL existing policies on blog_comments to start fresh
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all existing policies on blog_comments
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'blog_comments'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.blog_comments', policy_record.policyname);
    END LOOP;
END $$;

-- Create the minimal required policies with maximum security

-- 1. Only admins and editors can directly SELECT from the table
CREATE POLICY "Admins and editors only direct access"
ON public.blog_comments
FOR SELECT
USING (
  is_admin() OR is_editor()
);

-- 2. Only admins and editors can UPDATE comments
CREATE POLICY "Admins and editors can update comments"
ON public.blog_comments
FOR UPDATE
USING (
  is_admin() OR is_editor()
);

-- 3. Only admins and editors can DELETE comments
CREATE POLICY "Admins and editors can delete comments"
ON public.blog_comments
FOR DELETE
USING (
  is_admin() OR is_editor()
);

-- 4. Secure INSERT policy - anyone can create comments but user_id must match auth
CREATE POLICY "Secure comment creation"
ON public.blog_comments
FOR INSERT
WITH CHECK (
  -- Allow anonymous comments (user_id = NULL) or authenticated users (user_id = auth.uid())
  (user_id IS NULL OR user_id = auth.uid())
);

-- Ensure the get_public_blog_comments function is the ONLY way for public to access comments
-- This function already masks email addresses using mask_email()

-- Add security documentation
COMMENT ON TABLE public.blog_comments IS 
'SECURITY: Email addresses protected. Direct access restricted to admins/editors only. Public must use get_public_blog_comments() function which masks emails.';

-- Make the mask_email function even more secure
CREATE OR REPLACE FUNCTION public.mask_email(email text, show_full boolean DEFAULT false)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only show full email if explicitly requested AND user has admin/editor privileges
  IF show_full = true AND (is_admin() OR is_editor()) THEN
    RETURN COALESCE(email, '');
  END IF;
  
  -- For everyone else, always mask the email
  IF email IS NULL OR email = '' THEN
    RETURN '';
  END IF;
  
  -- Advanced email masking
  DECLARE
    local_part text;
    domain_part text;
    at_position int;
  BEGIN
    at_position := position('@' in email);
    
    -- If no @ found, return generic masked email
    IF at_position = 0 THEN
      RETURN 'user@***';
    END IF;
    
    local_part := substring(email from 1 for at_position - 1);
    domain_part := substring(email from at_position + 1);
    
    -- Mask local part: show first char + *** + last char (if > 2 chars)
    IF length(local_part) <= 1 THEN
      local_part := '***';
    ELSIF length(local_part) = 2 THEN
      local_part := substring(local_part from 1 for 1) || '*';
    ELSE
      local_part := substring(local_part from 1 for 1) || '***' || substring(local_part from length(local_part) for 1);
    END IF;
    
    -- Mask domain: show first char + *** + extension
    DECLARE
      dot_position int;
      domain_name text;
      extension text;
    BEGIN
      -- Find last dot position
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