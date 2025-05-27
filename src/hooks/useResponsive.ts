
import { useState, useEffect } from 'react';

export function useResponsive() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  
  const [isMobile, setIsMobile] = useState<boolean>(width < 768);
  const [isTablet, setIsTablet] = useState<boolean>(width >= 768 && width < 1024);
  const [isDesktop, setIsDesktop] = useState<boolean>(width >= 1024);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setWidth(currentWidth);
      setIsMobile(currentWidth < 768);
      setIsTablet(currentWidth >= 768 && currentWidth < 1024);
      setIsDesktop(currentWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    
    handleResize();
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return { 
    isMobile, 
    isTablet,
    isDesktop,
    width,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
}
