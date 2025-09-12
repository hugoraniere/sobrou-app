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

  return (
    <nav className="mb-6">
      <div className="flex flex-wrap gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SupportNavigation;