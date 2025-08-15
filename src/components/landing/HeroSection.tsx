import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative w-full bg-green-50/30 scroll-mt-16">
      {/* Imagem absoluta para desktop - estende até a borda direita */}
      <div className="hidden lg:block absolute top-16 bottom-8 right-0 w-1/2 z-0 pointer-events-none">
        <img
          src="/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png"
          alt="Dashboard do Sobrou mostrando controle financeiro completo"
          className="w-full h-full object-cover object-left"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          aria-hidden="true"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Layout flex responsivo */}
        <div className="flex flex-col lg:flex-row items-stretch h-[100vh]">
          {/* Coluna de texto - 50% no desktop */}
          <div className="flex flex-col justify-center text-center lg:text-left lg:basis-1/2 py-16 lg:py-0 lg:pr-8">
            <h1 className="font-alliance-n2 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Organize suas finanças,<br />
              é só digitar
            </h1>
            <p className="font-alliance text-xl text-gray-600 mb-8 max-w-2xl lg:max-w-none">
              Chega de planilhas complexas. Digite seus gastos em linguagem natural e deixe nossa IA organizar tudo automaticamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-white font-alliance-n2 text-lg px-4 w-full sm:w-auto">
                  Começar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-6 text-gray-600 justify-center lg:justify-start">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="font-alliance">Comece em menos de 2 minutos</span>
            </div>
          </div>
          
          {/* Coluna de imagem - apenas mobile */}
          <div className="lg:hidden flex items-center justify-center p-4">
            <img
              src="/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png"
              alt="Dashboard do Sobrou mostrando controle financeiro completo"
              className="w-full max-w-sm h-auto rounded-2xl shadow-2xl"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              sizes="90vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;
