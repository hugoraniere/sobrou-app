import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LogoWithAlphaBadge from '@/components/brand/LogoWithAlphaBadge';
import LogoWithSupportBadge from '@/components/brand/LogoWithSupportBadge';
import HeaderAuthButtons from '@/components/ui/HeaderAuthButtons';

const SiteNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  
  const isSupportPage = location.pathname.startsWith('/suporte');
  
  const isActivePage = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    window.addEventListener('scroll', handleScroll);
    checkMobile();
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-main-bg-color/95 backdrop-blur-sm shadow-sm border-b border-border/40' : 'bg-main-bg-color'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {isSupportPage ? (
                <LogoWithSupportBadge size="md" />
              ) : (
                <LogoWithAlphaBadge size="md" />
              )}
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePage('/') ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              Início
            </Link>
            <Link 
              to="/blog" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePage('/blog') ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/suporte" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePage('/suporte') ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              Suporte
            </Link>
          </nav>

          <HeaderAuthButtons isMobile={isMobile} />
        </div>
      </div>
    </header>
  );
};

export default SiteNavbar;