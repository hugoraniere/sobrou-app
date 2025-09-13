
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LogoWithAlphaBadge from '@/components/brand/LogoWithAlphaBadge';
import LogoWithSupportBadge from '@/components/brand/LogoWithSupportBadge';
import HeaderAuthButtons from '@/components/ui/HeaderAuthButtons';


const TransparentHeader = () => {
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
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    const media = window.matchMedia('(max-width: 768px)');
    const handleMedia = () => setIsMobile(media.matches);

    // Initialize state
    handleScroll();
    handleMedia();

    window.addEventListener('scroll', handleScroll);
    media.addEventListener('change', handleMedia);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      media.removeEventListener('change', handleMedia);
    };
  }, []);

  return (
    <header className="w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/" className="flex items-center">
            {isSupportPage ? (
              <LogoWithSupportBadge size="sm" className="h-8" />
            ) : (
              <LogoWithAlphaBadge size="sm" className="h-8" />
            )}
          </Link>

          <nav className="hidden md:flex items-center space-x-8 font-outfit text-sm">
            <Link 
              to="/" 
              className={`transition-colors ${
                isActivePage('/') 
                  ? 'text-primary font-semibold' 
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              Início
            </Link>
            <Link 
              to="/blog" 
              className={`transition-colors ${
                isActivePage('/blog') 
                  ? 'text-primary font-semibold' 
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/suporte" 
              className={`transition-colors ${
                isActivePage('/suporte') 
                  ? 'text-primary font-semibold' 
                  : 'text-gray-700 hover:text-primary'
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

export default TransparentHeader;
