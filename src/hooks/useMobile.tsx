
import { useState, useEffect } from "react";

/**
 * useMobile - Hook para facilitar responsividade entre Desktop e Mobile (PWA).
 *
 * Retorna um objeto com:
 *  - isMobile: boolean (verdadeiro se for mobile)
 *  - width: largura atual da tela
 *
 * Exemplo de uso:
 *   const { isMobile, width } = useMobile();
 *   if (isMobile) {
 *     // renderiza menu móvel
 *   }
 */
export function useMobile() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [isMobile, setIsMobile] = useState<boolean>(width <= 768);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setWidth(currentWidth);
      setIsMobile(currentWidth <= 768);
      
      // Adiciona classe para facilitar estilização responsiva
      document.documentElement.classList.toggle('is-mobile', currentWidth <= 768);
    };

    // Adiciona suporte para orientação do dispositivo
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    
    handleResize(); // Atualiza na montagem
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      document.documentElement.classList.remove('is-mobile');
    };
  }, []);

  return { 
    isMobile, 
    width,
    // Métodos auxiliares para PWA
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
  };
}

