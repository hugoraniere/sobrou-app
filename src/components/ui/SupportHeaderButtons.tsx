import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const SupportHeaderButtons: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/suporte/meus-tickets">
          <Button variant="ghost" size="sm">
            Meus Tickets
          </Button>
        </Link>
        <Link to={user ? "/suporte/novo" : "/auth?redirect=/suporte/novo"}>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Ticket
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/auth?redirect=/suporte/novo">
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Ticket
        </Button>
      </Link>
      <Link to="/auth?redirect=/suporte">
        <Button size="sm">
          Entrar
        </Button>
      </Link>
    </div>
  );
};

export default SupportHeaderButtons;