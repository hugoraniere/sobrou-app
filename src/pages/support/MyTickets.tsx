import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import SupportLayout from '@/components/support/SupportLayout';
import TicketCard from '@/components/support/TicketCard';
import { TicketService } from '@/services/ticketService';
import { Ticket, TicketFilters } from '@/types/support';
import { useToast } from '@/hooks/use-toast';

const MyTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TicketFilters>({});
  const { toast } = useToast();

  useEffect(() => {
    loadTickets();
  }, [filters]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await TicketService.getMyTickets(filters);
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        message: 'Não foi possível carregar os tickets.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value || undefined }));
  };

  const handleStatusFilter = (status: string) => {
    if (status === 'all') {
      setFilters(prev => ({ ...prev, status: undefined }));
    } else {
      setFilters(prev => ({ ...prev, status: [status as Ticket['status']] }));
    }
  };

  if (loading) {
    return (
      <SupportLayout showBackButton currentPage="Meus Tickets">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SupportLayout>
    );
  }

  return (
    <SupportLayout showBackButton currentPage="Meus Tickets">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Meus Tickets</h1>
          <Link to="/suporte/novo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Ticket
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar tickets..."
                    className="pl-10"
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>
              <Select onValueChange={handleStatusFilter}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="aguardando_resposta">Aguardando Resposta</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {tickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="mb-4">
                <Filter className="h-12 w-12 text-muted-foreground mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum ticket encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não criou nenhum ticket de suporte.
              </p>
              <Link to="/suporte/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Ticket
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </SupportLayout>
  );
};

export default MyTickets;