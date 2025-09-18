-- Fix conflicting RLS policies for blog_comments
-- Ensure complete email protection while maintaining functionality

-- First, let's drop the current INSERT policy that allows anyone to insert
DROP POLICY IF EXISTS "Anyone can insert blog comments" ON public.blog_comments;

-- Create a more secure INSERT policy that allows comments but doesn't create security conflicts
CREATE POLICY "Users can create blog comments"
ON public.blog_comments
FOR INSERT
WITH CHECK (
  -- Allow anyone to create comments, but they can only include their own user_id if authenticated
  (auth.uid() IS NULL OR user_id = auth.uid())
);

-- Ensure the SELECT policy is the only way to access the table
-- Drop any potential conflicting SELECT policies
DROP POLICY IF EXISTS "Public cannot directly access blog comments with emails" ON public.blog_comments;

-- Create a comprehensive SELECT policy that ensures email protection
CREATE POLICY "Protected access to blog comments"
ON public.blog_comments
FOR SELECT
USING (
  -- Only admins and editors can see everything including emails
  -- Everyone else must use the get_public_blog_comments() function which masks emails
  (is_admin() OR is_editor())
);

-- Ensure the get_public_blog_comments function remains the only public way to access comments
-- This function already masks emails for non-privileged users

-- Add a comment to document the security approach
COMMENT ON TABLE public.blog_comments IS 
'Email addresses are protected: Direct SELECT access restricted to admins/editors only. Public access must use get_public_blog_comments() function which automatically masks email addresses.';