import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ticket } from '@/types/support';
import TicketStatusChip from './TicketStatusChip';
import { MessageCircle, Clock } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'bug': 'Bug/Erro técnico',
      'solicitacao': 'Solicitação',
      'reclamacao': 'Reclamação',
      'duvida': 'Dúvida'
    };
    return categories[category] || category;
  };

  return (
    <Link to={`/suporte/ticket/${ticket.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate mb-1">
                {ticket.subject}
              </h3>
              <p className="text-xs text-muted-foreground">
                #{ticket.ticket_number} • {getCategoryLabel(ticket.category)}
              </p>
            </div>
            <TicketStatusChip status={ticket.status} priority={ticket.priority} />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {ticket.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(ticket.created_at), {
                addSuffix: true,
                locale: ptBR
              })}
            </div>
            {ticket.sla_due_at && (
              <div className="flex items-center gap-1">
                <span>SLA:</span>
                {formatDistanceToNow(new Date(ticket.sla_due_at), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TicketCard;