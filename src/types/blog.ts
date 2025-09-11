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
  tags?: BlogTag[];
}

export interface BlogTag {
  id: string;
  name: string;
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