-- Create function to check if user is editor
CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT public.has_role(auth.uid(), 'editor')
$function$;

-- Update blog_posts RLS policies to allow editors
DROP POLICY IF EXISTS "Admins can view all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;

CREATE POLICY "Admins and editors can view all blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (is_admin() OR is_editor());

CREATE POLICY "Admins and editors can insert blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (is_admin() OR is_editor());

CREATE POLICY "Admins and editors can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (is_admin() OR is_editor());

CREATE POLICY "Admins and editors can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (is_admin() OR is_editor());

-- Update blog_tags RLS policies to allow editors
DROP POLICY IF EXISTS "Admins can view all blog tags" ON public.blog_tags;
DROP POLICY IF EXISTS "Admins can insert blog tags" ON public.blog_tags;
DROP POLICY IF EXISTS "Admins can update blog tags" ON public.blog_tags;
DROP POLICY IF EXISTS "Admins can delete blog tags" ON public.blog_tags;

CREATE POLICY "Admins and editors can view all blog tags" 
ON public.blog_tags 
FOR SELECT 
USING (is_admin() OR is_editor());

CREATE POLICY "Admins and editors can insert blog tags" 
ON public.blog_tags 
FOR INSERT 
WITH CHECK (is_admin() OR is_editor());

CREATE POLICY "Admins and editors can update blog tags" 
ON public.blog_tags 
FOR UPDATE 
USING (is_admin() OR is_editor());

CREATE POLICY "Admins and editors can delete blog tags" 
ON public.blog_tags 
FOR DELETE 
USING (is_admin() OR is_editor());

-- Update blog_post_tags RLS policies to allow editors
DROP POLICY IF EXISTS "Admins can view all blog post tags" ON public.blog_post_tags;
DROP POLICY IF EXISTS "Admins can insert blog post tags" ON public.blog_post_tags;
DROP POLICY IF EXISTS "Admins can update blog post tags" ON public.blog_post_tags;
DROP POLICY IF EXISTS "Admins can delete blog post tags" ON public.blog_post_tags;

CREATE POLICY "Admins and editors can view all blog post tags" 
ON public.blog_post_tags 
FOR SELECT 
USING (is_admin() OR is_editor());

CREATE POLICY "Admins and editors can insert blog post tags" 
ON public.blog_post_tags 
FOR INSERT 
WITH CHECK (is_admin() OR is_editor());

CREATE POLICY "Admins and editors can update blog post tags" 
ON public.blog_post_tags 
FOR UPDATE 
USING (is_admin() OR is_editor());

CREATE POLICY "Admins and editors can delete blog post tags" 
ON public.blog_post_tags 
FOR DELETE 
USING (is_admin() OR is_editor());

-- Create RPC function to search users for admin management
CREATE OR REPLACE FUNCTION public.search_users(search_term text)
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  created_at timestamptz,
  roles text[]
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    u.id,
    u.email,
    COALESCE(p.full_name, '') as full_name,
    u.created_at,
    COALESCE(
      array_agg(ur.role::text) FILTER (WHERE ur.role IS NOT NULL), 
      ARRAY[]::text[]
    ) as roles
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  LEFT JOIN public.user_roles ur ON ur.user_id = u.id
  WHERE 
    u.email ILIKE '%' || search_term || '%' 
    OR COALESCE(p.full_name, '') ILIKE '%' || search_term || '%'
  GROUP BY u.id, u.email, p.full_name, u.created_at
  ORDER BY u.created_at DESC
  LIMIT 50;
$function$;

-- Create RPC function to manage user roles (admin only)
CREATE OR REPLACE FUNCTION public.manage_user_role(
  target_user_id uuid,
  target_role app_role,
  action text -- 'add' or 'remove'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only admins can manage user roles
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Prevent self-removal of admin role
  IF auth.uid() = target_user_id AND target_role = 'admin' AND action = 'remove' THEN
    RAISE EXCEPTION 'Cannot remove admin role from yourself.';
  END IF;

  IF action = 'add' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, target_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSIF action = 'remove' THEN
    DELETE FROM public.user_roles 
    WHERE user_id = target_user_id AND role = target_role;
  ELSE
    RAISE EXCEPTION 'Invalid action. Use "add" or "remove".';
  END IF;

  RETURN true;
END;
$function$;