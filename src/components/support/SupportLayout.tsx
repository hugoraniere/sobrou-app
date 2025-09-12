import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import TransparentHeader from '@/components/header/TransparentHeader';
import BackButton from '@/components/ui/BackButton';
import LogoWithSupportBadge from '@/components/brand/LogoWithSupportBadge';
import SupportBreadcrumb from './SupportBreadcrumb';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import { getSectionContainer } from '@/constants/layoutTokens';

interface SupportLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
  currentPage?: string;
  articleTitle?: string;
  showSearchAndActions?: boolean;
}

const SupportLayout: React.FC<SupportLayoutProps> = ({
  children,
  showBackButton = false,
  title = "Central de Ajuda",
  subtitle = "Encontre respostas para suas dúvidas ou entre em contato conosco",
  currentPage,
  articleTitle,
  showSearchAndActions = false
}) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {showBackButton ? (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <BackButton />
              <div className="hidden md:flex items-center space-x-8 font-outfit text-sm">
                <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
                  Início
                </Link>
                <Link to="/blog" className="text-gray-700 hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link to="/suporte" className="text-gray-700 hover:text-primary transition-colors">
                  Suporte
                </Link>
              </div>
            </div>
          </div>
        </header>
      ) : (
        <TransparentHeader />
      )}

      <main className="flex-1">
        {!showBackButton && !showSearchAndActions && (
          <section className="bg-primary py-12 md:py-16">
            <div className={getSectionContainer()}>
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  {title}
                </h1>
                <p className="text-lg text-white/90 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              </div>
            </div>
          </section>
        )}
        
        <ResponsivePageContainer className="py-8">
          <div className="mb-8">
            <SupportBreadcrumb currentPage={currentPage} articleTitle={articleTitle} />
          </div>
          {showSearchAndActions && (
            <div className="mb-12">
              {children}
            </div>
          )}
        </ResponsivePageContainer>
        
        {!showSearchAndActions && (
          <ResponsivePageContainer className="pb-12">
            {children}
          </ResponsivePageContainer>
        )}
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