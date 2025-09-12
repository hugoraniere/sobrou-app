import { supabase } from '@/integrations/supabase/client';
import type { 
  SupportTopic, 
  SupportArticle, 
  FAQEntry, 
  Ticket, 
  TicketMessage, 
  TicketAttachment,
  ArticleVote,
  CreateTicketData,
  TicketFilters
} from '@/types/support';

export class SupportService {
  // Topics
  static async getTopics() {
    const { data, error } = await supabase
      .from('support_topics')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) throw error;
    return data as SupportTopic[];
  }

  static async getAllTopics() {
    const { data, error } = await supabase
      .from('support_topics')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data as SupportTopic[];
  }

  static async createTopic(topic: Omit<SupportTopic, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('support_topics')
      .insert(topic)
      .select()
      .single();
    
    if (error) throw error;
    return data as SupportTopic;
  }

  static async updateTopic(id: string, updates: Partial<SupportTopic>) {
    const { data, error } = await supabase
      .from('support_topics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as SupportTopic;
  }

  static async deleteTopic(id: string) {
    const { error } = await supabase
      .from('support_topics')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Articles
  static async getArticles(filters?: { topic_id?: string; search?: string; featured?: boolean }) {
    let query = supabase
      .from('support_articles')
      .select(`
        *,
        topic:support_topics(*)
      `)
      .eq('status', 'published');

    if (filters?.topic_id) {
      query = query.eq('topic_id', filters.topic_id);
    }

    if (filters?.featured) {
      query = query.eq('is_featured', true);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    
    if (error) throw error;
    return data as SupportArticle[];
  }

  static async getAllArticles() {
    const { data, error } = await supabase
      .from('support_articles')
      .select(`
        *,
        topic:support_topics(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as SupportArticle[];
  }

  static async getArticleBySlug(slug: string) {
    const { data, error } = await supabase
      .from('support_articles')
      .select(`
        *,
        topic:support_topics(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    
    if (error) throw error;

    // Increment view count
    await supabase
      .from('support_articles')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', data.id);

    return { ...data, view_count: (data.view_count || 0) + 1 } as SupportArticle;
  }

  static async getPopularArticles(limit = 6) {
    const { data, error } = await supabase
      .from('support_articles')
      .select(`
        *,
        topic:support_topics(*)
      `)
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as SupportArticle[];
  }

  static async getRecentArticles(limit = 6) {
    const { data, error } = await supabase
      .from('support_articles')
      .select(`
        *,
        topic:support_topics(*)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as SupportArticle[];
  }

  static async getRelatedArticles(articleId: string, topicId?: string, limit = 3) {
    let query = supabase
      .from('support_articles')
      .select(`
        *,
        topic:support_topics(*)
      `)
      .eq('status', 'published')
      .neq('id', articleId);

    if (topicId) {
      query = query.eq('topic_id', topicId);
    }

    const { data, error } = await query
      .order('view_count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as SupportArticle[];
  }

  static async createArticle(article: Omit<SupportArticle, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'helpful_votes' | 'not_helpful_votes' | 'reading_time_minutes'>) {
    const { data, error } = await supabase
      .from('support_articles')
      .insert(article)
      .select(`
        *,
        topic:support_topics(*)
      `)
      .single();
    
    if (error) throw error;
    return data as SupportArticle;
  }

  static async updateArticle(id: string, updates: Partial<SupportArticle>) {
    const { data, error } = await supabase
      .from('support_articles')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        topic:support_topics(*)
      `)
      .single();
    
    if (error) throw error;
    return data as SupportArticle;
  }

  static async deleteArticle(id: string) {
    const { error } = await supabase
      .from('support_articles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // FAQ
  static async getFAQEntries() {
    const { data, error } = await supabase
      .from('faq_entries')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) throw error;
    return data as FAQEntry[];
  }

  static async getAllFAQEntries() {
    const { data, error } = await supabase
      .from('faq_entries')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data as FAQEntry[];
  }

  static async createFAQEntry(entry: Omit<FAQEntry, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('faq_entries')
      .insert(entry)
      .select()
      .single();
    
    if (error) throw error;
    return data as FAQEntry;
  }

  static async updateFAQEntry(id: string, updates: Partial<FAQEntry>) {
    const { data, error } = await supabase
      .from('faq_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as FAQEntry;
  }

  static async deleteFAQEntry(id: string) {
    const { error } = await supabase
      .from('faq_entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Tickets
  static async getMyTickets() {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Ticket[];
  }

  static async getAllTickets(filters?: TicketFilters) {
    let query = supabase
      .from('tickets')
      .select('*');

    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }

    if (filters?.type?.length) {
      query = query.in('type', filters.type);
    }

    if (filters?.priority?.length) {
      query = query.in('priority', filters.priority);
    }

    if (filters?.assignee) {
      if (filters.assignee === 'unassigned') {
        query = query.is('assignee_id', null);
      } else {
        query = query.eq('assignee_id', filters.assignee);
      }
    }

    if (filters?.search) {
      query = query.or(`subject.ilike.%${filters.search}%,description.ilike.%${filters.search}%,ticket_number.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Ticket[];
  }

  static async getTicketById(id: string) {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Ticket;
  }

  static async createTicket(ticketData: CreateTicketData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Omit ticket_number as it's auto-generated by trigger
    const insertData = {
      user_id: user.id,
      type: ticketData.type,
      category: ticketData.category,
      subcategory: ticketData.subcategory || null,
      subject: ticketData.subject,
      description: ticketData.description,
      priority: ticketData.priority,
      url_context: ticketData.url_context || null
    };

    const { data, error } = await supabase
      .from('tickets')
      .insert(insertData as any)
      .select()
      .single();
    
    if (error) throw error;
    return data as Ticket;
  }

  static async updateTicket(id: string, updates: Partial<Ticket>) {
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Ticket;
  }

  // Ticket Messages
  static async getTicketMessages(ticketId: string) {
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as TicketMessage[];
  }

  static async createTicketMessage(message: Omit<TicketMessage, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('ticket_messages')
      .insert(message)
      .select()
      .single();
    
    if (error) throw error;
    return data as TicketMessage;
  }

  // Article Votes
  static async voteOnArticle(articleId: string, isHelpful: boolean, ipAddress?: string) {
    const { data: user } = await supabase.auth.getUser();
    
    const voteData = {
      article_id: articleId,
      is_helpful: isHelpful,
      user_id: user.user?.id || null,
      ip_address: user.user ? null : ipAddress
    };

    const { data, error } = await supabase
      .from('article_votes')
      .upsert(voteData, { 
        onConflict: user.user ? 'article_id,user_id' : 'article_id,ip_address'
      })
      .select()
      .single();
    
    if (error) throw error;

    // Update article vote counts
    const { data: votes } = await supabase
      .from('article_votes')
      .select('is_helpful')
      .eq('article_id', articleId);

    if (votes) {
      const helpfulVotes = votes.filter(v => v.is_helpful).length;
      const notHelpfulVotes = votes.filter(v => !v.is_helpful).length;

      await supabase
        .from('support_articles')
        .update({
          helpful_votes: helpfulVotes,
          not_helpful_votes: notHelpfulVotes
        })
        .eq('id', articleId);
    }

    return data as ArticleVote;
  }

  static async getUserVoteForArticle(articleId: string) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
      .from('article_votes')
      .select('*')
      .eq('article_id', articleId)
      .eq('user_id', user.user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as ArticleVote | null;
  }

  // Search
  static async search(query: string) {
    const [articlesResult, faqResult] = await Promise.allSettled([
      supabase
        .from('support_articles')
        .select(`
          *,
          topic:support_topics(*)
        `)
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`),
      supabase
        .from('faq_entries')
        .select('*')
        .eq('is_active', true)
        .or(`question.ilike.%${query}%,answer_md.ilike.%${query}%`)
    ]);

    const articles = articlesResult.status === 'fulfilled' ? articlesResult.value.data || [] : [];
    const faqs = faqResult.status === 'fulfilled' ? faqResult.value.data || [] : [];

    return {
      articles: articles as SupportArticle[],
      faqs: faqs as FAQEntry[]
    };
  }
}