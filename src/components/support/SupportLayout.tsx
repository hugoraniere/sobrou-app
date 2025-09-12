import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SupportLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
}

const SupportLayout: React.FC<SupportLayoutProps> = ({
  children,
  showBackButton = false,
  title = "Central de Ajuda",
  subtitle = "Encontre respostas para suas dúvidas ou entre em contato conosco"
}) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Link to="/suporte">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-text-primary">
                  Central de Suporte
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link to="/suporte/meus-tickets">
                    <Button variant="ghost" size="sm">
                      Meus Tickets
                    </Button>
                  </Link>
                  <Link to="/suporte/novo">
                    <Button size="sm">
                      Novo Ticket
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/auth">
                  <Button size="sm">
                    Fazer Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Title Section */}
      {!showBackButton && (
        <section className="bg-background-surface border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              {title}
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </section>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background-surface mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-text-secondary">
              Ainda precisa de ajuda?{' '}
              {user ? (
                <Link to="/suporte/novo" className="text-primary hover:underline">
                  Abra um ticket
                </Link>
              ) : (
                <Link to="/auth" className="text-primary hover:underline">
                  Faça login para abrir um ticket
                </Link>
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SupportLayout;