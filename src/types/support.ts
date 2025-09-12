export interface SupportTopic {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupportArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  topic_id: string | null;
  status: 'draft' | 'published';
  is_featured: boolean;
  view_count: number;
  helpful_votes: number;
  not_helpful_votes: number;
  reading_time_minutes: number;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  topic?: SupportTopic;
}

export interface FAQEntry {
  id: string;
  question: string;
  answer_md: string;
  tags: string[] | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  user_id: string;
  assignee_id: string | null;
  type: 'bug' | 'solicitacao' | 'reclamacao' | 'duvida';
  category: string;
  subcategory: string | null;
  subject: string;
  description: string;
  priority: 'baixa' | 'media' | 'alta';
  status: 'aberto' | 'em_andamento' | 'aguardando_resposta' | 'resolvido' | 'fechado';
  url_context: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  sla_due_at: string | null;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_internal: boolean;
  created_at: string;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  message_id: string | null;
  filename: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface ArticleVote {
  id: string;
  article_id: string;
  user_id: string | null;
  ip_address: string | null;
  is_helpful: boolean;
  created_at: string;
}

export interface CreateTicketData {
  type: Ticket['type'];
  category: string;
  subcategory?: string;
  subject: string;
  description: string;
  priority: Ticket['priority'];
  url_context?: string;
}

export interface TicketFilters {
  status?: Ticket['status'][];
  type?: Ticket['type'][];
  priority?: Ticket['priority'][];
  assignee?: string;
  search?: string;
}

export type TicketTypeLabels = {
  [K in Ticket['type']]: string;
};

export type TicketStatusLabels = {
  [K in Ticket['status']]: string;
};

export type PriorityLabels = {
  [K in Ticket['priority']]: string;
};