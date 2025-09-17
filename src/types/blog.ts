export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  cover_image_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  slug: string;
  tags?: BlogTag[];
  like_count?: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPostTag {
  id: string;
  post_id: string;
  tag_id: string;
}

export interface CreateBlogPostData {
  title: string;
  subtitle?: string;
  content: string;
  cover_image_url?: string;
  tags: string[];
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string;
}

export interface FeaturedPost {
  id: string;
  post_id: string;
  cta_text?: string;
  cta_url?: string;
  post_title: string;
  post_subtitle?: string;
  post_content: string;
  post_cover_image_url?: string;
  post_slug: string;
  post_published_at: string;
}

export interface CreateFeaturedPostData {
  post_id: string;
  cta_text?: string;
  cta_url?: string;
  display_order?: number;
  start_date?: string;
  end_date?: string;
}