-- Create blog_post_likes table for tracking user likes
CREATE TABLE public.blog_post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id),
  UNIQUE(post_id, ip_address)
);

-- Enable RLS
ALTER TABLE public.blog_post_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_post_likes
CREATE POLICY "Anyone can insert blog post likes" 
ON public.blog_post_likes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view blog post likes" 
ON public.blog_post_likes 
FOR SELECT 
USING (true);

-- Add public access policies for blog_posts
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (true);

-- Add public access policies for blog_tags
CREATE POLICY "Anyone can view blog tags" 
ON public.blog_tags 
FOR SELECT 
USING (true);

-- Add public access policies for blog_post_tags
CREATE POLICY "Anyone can view blog post tags" 
ON public.blog_post_tags 
FOR SELECT 
USING (true);

-- Create RPC function to get public blog posts with pagination and search
CREATE OR REPLACE FUNCTION public.get_public_blog_posts(
  search_term TEXT DEFAULT '',
  page_size INTEGER DEFAULT 10,
  page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  cover_image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  user_id UUID,
  tags JSONB,
  like_count BIGINT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
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
           bp.published_at, bp.created_at, bp.updated_at, bp.user_id, like_counts.like_count
  ORDER BY bp.published_at DESC
  LIMIT page_size OFFSET page_offset;
$$;

-- Create RPC function to get a single public blog post
CREATE OR REPLACE FUNCTION public.get_public_blog_post(target_post_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  cover_image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  user_id UUID,
  tags JSONB,
  like_count BIGINT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
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
           bp.published_at, bp.created_at, bp.updated_at, bp.user_id, like_counts.like_count;
$$;

-- Create RPC function to toggle blog post like
CREATE OR REPLACE FUNCTION public.toggle_blog_post_like(
  target_post_id UUID,
  user_id_param UUID DEFAULT NULL,
  ip_address_param TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  like_exists BOOLEAN;
BEGIN
  -- Check if like already exists
  IF user_id_param IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.blog_post_likes 
      WHERE post_id = target_post_id AND user_id = user_id_param
    ) INTO like_exists;
    
    IF like_exists THEN
      DELETE FROM public.blog_post_likes 
      WHERE post_id = target_post_id AND user_id = user_id_param;
      RETURN FALSE;
    ELSE
      INSERT INTO public.blog_post_likes (post_id, user_id) 
      VALUES (target_post_id, user_id_param);
      RETURN TRUE;
    END IF;
  ELSE
    SELECT EXISTS(
      SELECT 1 FROM public.blog_post_likes 
      WHERE post_id = target_post_id AND ip_address = ip_address_param
    ) INTO like_exists;
    
    IF like_exists THEN
      DELETE FROM public.blog_post_likes 
      WHERE post_id = target_post_id AND ip_address = ip_address_param;
      RETURN FALSE;
    ELSE
      INSERT INTO public.blog_post_likes (post_id, ip_address) 
      VALUES (target_post_id, ip_address_param);
      RETURN TRUE;
    END IF;
  END IF;
END;
$$;