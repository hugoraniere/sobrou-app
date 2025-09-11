import { supabase } from '@/integrations/supabase/client';
import type { BlogPost, BlogTag, CreateBlogPostData, UpdateBlogPostData } from '@/types/blog';

export class BlogService {
  // Blog Posts
  static async getBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        tags:blog_post_tags(
          tag:blog_tags(*)
        )
      `)
      .order('published_at', { ascending: false });

    if (error) throw error;

    return data.map(post => ({
      ...post,
      tags: post.tags.map((t: any) => t.tag)
    }));
  }

  static async getBlogPost(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        tags:blog_post_tags(
          tag:blog_tags(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      ...data,
      tags: data.tags.map((t: any) => t.tag)
    };
  }

  static async createBlogPost(postData: CreateBlogPostData): Promise<BlogPost> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { tags, ...blogPostData } = postData;

    // Create the blog post
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        ...blogPostData,
        user_id: user.user.id
      })
      .select()
      .single();

    if (postError) throw postError;

    // Handle tags
    if (tags && tags.length > 0) {
      await this.updatePostTags(post.id, tags);
    }

    return await this.getBlogPost(post.id) as BlogPost;
  }

  static async updateBlogPost(postData: UpdateBlogPostData): Promise<BlogPost> {
    const { id, tags, ...updateData } = postData;

    // Update the blog post
    const { error: postError } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id);

    if (postError) throw postError;

    // Handle tags if provided
    if (tags !== undefined) {
      await this.updatePostTags(id, tags);
    }

    return await this.getBlogPost(id) as BlogPost;
  }

  static async deleteBlogPost(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Tags
  static async getTags(): Promise<BlogTag[]> {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  static async createTag(name: string): Promise<BlogTag> {
    const { data, error } = await supabase
      .from('blog_tags')
      .insert({ name })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getOrCreateTags(tagNames: string[]): Promise<BlogTag[]> {
    const existingTags = await this.getTags();
    const existingTagNames = existingTags.map(tag => tag.name.toLowerCase());
    
    const newTagNames = tagNames.filter(name => 
      !existingTagNames.includes(name.toLowerCase())
    );

    // Create new tags
    const newTags = await Promise.all(
      newTagNames.map(name => this.createTag(name))
    );

    // Return all tags (existing + new)
    const allTags = [...existingTags, ...newTags];
    return tagNames.map(name => 
      allTags.find(tag => tag.name.toLowerCase() === name.toLowerCase())!
    );
  }

  // Post-Tag relationships
  private static async updatePostTags(postId: string, tagNames: string[]): Promise<void> {
    // Get or create tags
    const tags = await this.getOrCreateTags(tagNames);

    // Remove existing tags for this post
    await supabase
      .from('blog_post_tags')
      .delete()
      .eq('post_id', postId);

    // Add new tags
    if (tags.length > 0) {
      const { error } = await supabase
        .from('blog_post_tags')
        .insert(
          tags.map(tag => ({
            post_id: postId,
            tag_id: tag.id
          }))
        );

      if (error) throw error;
    }
  }

  // Storage
  static async uploadImage(file: File, path?: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from('blog')
      .upload(filePath, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from('blog')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  }

  // Role checks
  static async isAdmin(): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('is_admin');

    if (error) throw error;
    return data;
  }

  static async isEditor(): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('is_editor');

    if (error) throw error;
    return data;
  }

  static async canAccessAdmin(): Promise<boolean> {
    try {
      const [isAdmin, isEditor] = await Promise.all([
        this.isAdmin(),
        this.isEditor()
      ]);
      return isAdmin || isEditor;
    } catch (error) {
      return false;
    }
  }

  // User management (admin only)
  static async searchUsers(searchTerm: string = ''): Promise<any[]> {
    const { data, error } = await supabase
      .rpc('search_users', { search_term: searchTerm });

    if (error) throw error;
    return data || [];
  }

  static async manageUserRole(
    userId: string, 
    role: 'admin' | 'editor', 
    action: 'add' | 'remove'
  ): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('manage_user_role', {
        target_user_id: userId,
        target_role: role,
        action: action
      });

    if (error) throw error;
    return data;
  }
}