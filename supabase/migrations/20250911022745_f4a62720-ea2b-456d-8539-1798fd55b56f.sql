-- Create blog post views table
CREATE TABLE public.blog_post_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID,
  ip_address TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT
);

-- Enable RLS on blog_post_views
ALTER TABLE public.blog_post_views ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_post_views
CREATE POLICY "Anyone can view blog post views" 
ON public.blog_post_views 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert blog post views" 
ON public.blog_post_views 
FOR INSERT 
WITH CHECK (true);

-- Create blog comments table
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blog_comments
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_comments
CREATE POLICY "Anyone can view approved blog comments" 
ON public.blog_comments 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Anyone can insert blog comments" 
ON public.blog_comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins and editors can view all blog comments" 
ON public.blog_comments 
FOR SELECT 
USING (is_admin() OR is_editor());

CREATE POLICY "Admins and editors can update blog comments" 
ON public.blog_comments 
FOR UPDATE 
USING (is_admin() OR is_editor());

CREATE POLICY "Admins and editors can delete blog comments" 
ON public.blog_comments 
FOR DELETE 
USING (is_admin() OR is_editor());

-- Create view for blog post statistics
CREATE OR REPLACE VIEW public.blog_post_stats AS
SELECT 
  bp.id,
  bp.title,
  bp.user_id as author_id,
  COUNT(DISTINCT bpv.id) as view_count,
  COUNT(DISTINCT bc.id) as comment_count,
  bp.published_at,
  bp.created_at
FROM public.blog_posts bp
LEFT JOIN public.blog_post_views bpv ON bp.id = bpv.post_id
LEFT JOIN public.blog_comments bc ON bp.id = bc.post_id AND bc.status = 'approved'
GROUP BY bp.id, bp.title, bp.user_id, bp.published_at, bp.created_at;

-- Create view for overall blog statistics
CREATE OR REPLACE VIEW public.blog_overall_stats AS
SELECT 
  COUNT(DISTINCT bp.id) as total_posts,
  COUNT(DISTINCT bpv.id) as total_views,
  COUNT(DISTINCT bc.id) as total_comments
FROM public.blog_posts bp
LEFT JOIN public.blog_post_views bpv ON bp.id = bpv.post_id
LEFT JOIN public.blog_comments bc ON bp.id = bc.post_id AND bc.status = 'approved';

-- Create RPC function to get user blog statistics
CREATE OR REPLACE FUNCTION public.get_user_blog_stats(target_user_id UUID)
RETURNS TABLE(
  total_posts BIGINT,
  total_views BIGINT,
  avg_views_per_post NUMERIC,
  total_comments BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(DISTINCT bp.id) as total_posts,
    COUNT(DISTINCT bpv.id) as total_views,
    CASE 
      WHEN COUNT(DISTINCT bp.id) > 0 THEN 
        ROUND(COUNT(DISTINCT bpv.id)::NUMERIC / COUNT(DISTINCT bp.id), 2)
      ELSE 0
    END as avg_views_per_post,
    COUNT(DISTINCT bc.id) as total_comments
  FROM public.blog_posts bp
  LEFT JOIN public.blog_post_views bpv ON bp.id = bpv.post_id
  LEFT JOIN public.blog_comments bc ON bp.id = bc.post_id AND bc.status = 'approved'
  WHERE bp.user_id = target_user_id;
$$;

-- Add trigger for updating blog_comments updated_at
CREATE TRIGGER update_blog_comments_updated_at
BEFORE UPDATE ON public.blog_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();