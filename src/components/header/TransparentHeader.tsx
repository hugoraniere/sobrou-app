
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LogoWithAlphaBadge from '@/components/brand/LogoWithAlphaBadge';
import HeaderAuthButtons from '@/components/ui/HeaderAuthButtons';


const TransparentHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
            <LogoWithAlphaBadge size="sm" className="h-8" />
          </Link>

          <nav className="hidden md:flex items-center space-x-8 font-outfit text-sm">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              Início
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/suporte" className="text-gray-700 hover:text-primary transition-colors">
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
