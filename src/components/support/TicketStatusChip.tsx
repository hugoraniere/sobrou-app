import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/types/support';

interface TicketStatusChipProps {
  status: Ticket['status'];
  priority?: Ticket['priority'];
}

const TicketStatusChip: React.FC<TicketStatusChipProps> = ({ status, priority }) => {
  const getStatusConfig = (status: Ticket['status']) => {
    switch (status) {
      case 'aberto':
        return { 
          label: 'Aberto', 
          className: 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
        };
      case 'em_andamento':
        return { 
          label: 'Em Andamento', 
          className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
        };
      case 'aguardando_resposta':
        return { 
          label: 'Aguardando Resposta', 
          className: 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
        };
      case 'resolvido':
        return { 
          label: 'Resolvido', 
          className: 'bg-green-100 text-green-700 hover:bg-green-200' 
        };
      case 'fechado':
        return { 
          label: 'Fechado', 
          className: 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
        };
      default:
        return { 
          label: status, 
          className: 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
        };
    }
  };

  const getPriorityConfig = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'alta':
        return { 
          label: 'Alta', 
          className: 'bg-red-100 text-red-700 hover:bg-red-200' 
        };
      case 'media':
        return { 
          label: 'Média', 
          className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
        };
      case 'baixa':
        return { 
          label: 'Baixa', 
          className: 'bg-green-100 text-green-700 hover:bg-green-200' 
        };
      default:
        return { 
          label: priority, 
          className: 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className={statusConfig.className}>
        {statusConfig.label}
      </Badge>
      {priority && (
        <Badge variant="outline" className={getPriorityConfig(priority).className}>
          {getPriorityConfig(priority).label}
        </Badge>
      )}
    </div>
  );
};

export default TicketStatusChip;