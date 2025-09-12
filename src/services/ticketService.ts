// Mock service for tickets until database tables are created
import { CreateTicketData, Ticket, TicketMessage, TicketFilters } from '@/types/support';

export class TicketService {
  static async createTicket(data: CreateTicketData): Promise<Ticket> {
    // Mock implementation - replace with actual Supabase calls when tables exist
    const mockTicket: Ticket = {
      id: crypto.randomUUID(),
      ticket_number: `SUP-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      user_id: 'mock-user-id',
      assignee_id: null,
      type: data.type,
      category: data.category,
      subcategory: data.subcategory || null,
      subject: data.subject,
      description: data.description,
      priority: data.priority,
      status: 'aberto',
      url_context: data.url_context || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resolved_at: null,
      sla_due_at: null,
    };
    
    // Store in localStorage for demo purposes
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    tickets.push(mockTicket);
    localStorage.setItem('support_tickets', JSON.stringify(tickets));
    
    return mockTicket;
  }

  static async getMyTickets(filters?: TicketFilters): Promise<Ticket[]> {
    // Mock implementation - get from localStorage
    const tickets: Ticket[] = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    
    let filteredTickets = tickets;
    
    if (filters?.status?.length) {
      filteredTickets = filteredTickets.filter(ticket => 
        filters.status!.includes(ticket.status)
      );
    }

    if (filters?.search) {
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(filters.search!.toLowerCase()) ||
        ticket.description.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    return filteredTickets.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  static async getTicketById(id: string): Promise<Ticket | null> {
    const tickets: Ticket[] = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    return tickets.find(ticket => ticket.id === id) || null;
  }

  static async getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
    // Mock implementation
    return [];
  }

  static async createTicketMessage(ticketId: string, message: string): Promise<TicketMessage> {
    // Mock implementation
    const mockMessage: TicketMessage = {
      id: crypto.randomUUID(),
      ticket_id: ticketId,
      user_id: 'mock-user-id',
      message,
      is_internal: false,
      created_at: new Date().toISOString(),
    };
    return mockMessage;
  }
}