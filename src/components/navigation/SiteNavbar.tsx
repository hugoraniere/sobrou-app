import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LogoWithAlphaBadge from '@/components/brand/LogoWithAlphaBadge';
import LogoWithSupportBadge from '@/components/brand/LogoWithSupportBadge';
import HeaderAuthButtons from '@/components/ui/HeaderAuthButtons';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const SiteNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-border/40' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {isSupportPage ? (
                <LogoWithSupportBadge size="sm" />
              ) : (
                <LogoWithAlphaBadge size="sm" />
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex">
            <HeaderAuthButtons isMobile={false} />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link 
                    to="/" 
                    className={`text-lg font-medium transition-colors hover:text-primary p-2 ${
                      isActivePage('/') ? 'text-primary bg-primary/10 rounded-md' : 'text-text-secondary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Início
                  </Link>
                  <Link 
                    to="/blog" 
                    className={`text-lg font-medium transition-colors hover:text-primary p-2 ${
                      isActivePage('/blog') ? 'text-primary bg-primary/10 rounded-md' : 'text-text-secondary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link 
                    to="/suporte" 
                    className={`text-lg font-medium transition-colors hover:text-primary p-2 ${
                      isActivePage('/suporte') ? 'text-primary bg-primary/10 rounded-md' : 'text-text-secondary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Suporte
                  </Link>
                  <div className="pt-4 border-t">
                    <HeaderAuthButtons isMobile={true} />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteNavbar;