import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, HelpCircle, Plus, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    label: 'Central de Ajuda',
    href: '/suporte',
    icon: Home
  },
  {
    label: 'Novo Ticket',
    href: '/suporte/novo',
    icon: Plus
  },
  {
    label: 'Meus Tickets',
    href: '/suporte/meus-tickets',
    icon: FileText
  }
];

const SupportNavigation: React.FC = () => {
  const location = useLocation();

  const centralDeAjuda = navigationItems.find(item => item.href === '/suporte');
  const novoTicket = navigationItems.find(item => item.href === '/suporte/novo');
  const meusTickets = navigationItems.find(item => item.href === '/suporte/meus-tickets');

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Central de Ajuda - Esquerda */}
        <div className="flex-shrink-0">
          {centralDeAjuda && (
            <Link
              to={centralDeAjuda.href}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors",
                isActive(centralDeAjuda.href)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-accent text-accent-foreground hover:bg-primary/10 hover:text-primary border border-border"
              )}
            >
              <centralDeAjuda.icon className="h-4 w-4" />
              {centralDeAjuda.label}
            </Link>
          )}
        </div>

        {/* Botões de Ação - Direita */}
        <div className="flex items-center gap-3">
          {novoTicket && (
            <Link
              to={novoTicket.href}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm",
                isActive(novoTicket.href)
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <novoTicket.icon className="h-4 w-4" />
              {novoTicket.label}
            </Link>
          )}
          
          {meusTickets && (
            <Link
              to={meusTickets.href}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors",
                isActive(meusTickets.href)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              )}
            >
              <meusTickets.icon className="h-4 w-4" />
              {meusTickets.label}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SupportNavigation;