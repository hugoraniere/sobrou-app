import { supabase } from '@/integrations/supabase/client';
import { CreateTicketData, Ticket, TicketMessage, TicketFilters } from '@/types/support';
import { Database } from '@/integrations/supabase/types';

type TicketInsert = Omit<Database['public']['Tables']['tickets']['Insert'], 'ticket_number'> & {
  ticket_number?: string;
};

export class TicketService {
  static async createTicket(data: CreateTicketData): Promise<Ticket> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    const insertData: TicketInsert = {
      user_id: user.id,
      type: data.type,
      category: data.category,
      subcategory: data.subcategory || null,
      subject: data.subject,
      description: data.description,
      priority: data.priority,
      url_context: data.url_context || window.location.href,
    };

    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return ticket as Ticket;
  }

  static async getMyTickets(filters?: TicketFilters): Promise<Ticket[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    let query = supabase
      .from('tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`subject.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Ticket[];
  }

  static async getTicketById(id: string): Promise<Ticket | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as Ticket;
  }

  static async getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
    const { data, error } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as TicketMessage[];
  }

  static async createTicketMessage(ticketId: string, message: string): Promise<TicketMessage> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: ticketId,
        user_id: user.id,
        message,
        is_internal: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as TicketMessage;
  }

  static async uploadAttachment(ticketId: string, file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      throw new Error('Apenas arquivos PNG e JPG são permitidos');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Arquivo muito grande. Máximo 5MB');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${ticketId}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('support-attachments')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Save attachment record
    const { error: dbError } = await supabase
      .from('ticket_attachments')
      .insert({
        ticket_id: ticketId,
        filename: file.name,
        file_path: fileName,
        file_size: file.size,
        mime_type: file.type,
      });

    if (dbError) throw dbError;

    return fileName;
  }

  static async getTicketAttachments(ticketId: string) {
    const { data, error } = await supabase
      .from('ticket_attachments')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}