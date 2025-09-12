import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SupportHeaderButtons from '@/components/ui/SupportHeaderButtons';
import BackButton from '@/components/ui/BackButton';
import AppButton from '@/components/ui/AppButton';
import LogoWithSupportBadge from '@/components/brand/LogoWithSupportBadge';
import SupportBreadcrumb from './SupportBreadcrumb';
import SupportNavigation from './SupportNavigation';

interface SupportLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
  currentPage?: string;
  articleTitle?: string;
}

const SupportLayout: React.FC<SupportLayoutProps> = ({
  children,
  showBackButton = false,
  title = "Central de Ajuda",
  subtitle = "Encontre respostas para suas dúvidas ou entre em contato conosco",
  currentPage,
  articleTitle
}) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {showBackButton ? (
              <BackButton />
            ) : (
              <Link to="/">
                <LogoWithSupportBadge size="sm" />
              </Link>
            )}
            
            <SupportHeaderButtons />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {!showBackButton && (
          <section className="bg-primary py-12 md:py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                {title}
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                {subtitle}
              </p>
            </div>
          </section>
        )}
        
        <div className="container mx-auto px-4 py-6">
          <SupportBreadcrumb currentPage={currentPage} articleTitle={articleTitle} />
          <SupportNavigation />
        </div>
        
        <div className="container mx-auto px-4 pb-12">
          {children}
        </div>
      </main>

      <footer className="border-t bg-background mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Ainda precisa de ajuda?{' '}
              <a 
                href="https://wa.me/5583993211642" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Fale conosco
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SupportLayout;