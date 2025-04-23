
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
 *   if (isMobile) { /* render mobile menu */ }
 */
export function useMobile() {
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [isMobile, setIsMobile] = useState<boolean>(width <= 768);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Atualiza na montagem
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile, width };
}

