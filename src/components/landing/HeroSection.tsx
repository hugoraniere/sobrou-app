import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative w-full min-h-[100svh] bg-green-50/30 scroll-mt-16 flex items-center overflow-hidden">
      {/* Imagem absoluta para desktop - ocupa toda a altura */}
      <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-[34vw] max-w-[720px] xl:max-w-[820px] pointer-events-none z-0">
        <div className="absolute inset-0 rounded-2xl bg-primary/5 translate-x-8 translate-y-8 -z-10" />
        <img
          src="/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png"
          alt="Dashboard do Sobrou mostrando controle financeiro completo"
          className="rounded-2xl shadow-2xl w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          sizes="(min-width: 1024px) 34vw, 90vw"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Layout para desktop */}
        <div className="hidden lg:grid grid-cols-12 items-center gap-12 lg:gap-16 h-full min-h-[100svh]">
          {/* Texto / CTA - 6 colunas */}
          <div className="col-span-6 flex flex-col justify-center px-4 text-left">
            <h1 className="font-alliance-n2 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Organize suas finanças,<br />
              é só digitar
            </h1>
            <p className="font-alliance text-xl text-gray-600 mb-8">
              Chega de planilhas complexas. Digite seus gastos em linguagem natural e deixe nossa IA organizar tudo automaticamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-white font-alliance-n2 text-lg px-4 w-full sm:w-auto">
                  Começar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-6 text-gray-600 justify-start">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="font-alliance">Comece em menos de 2 minutos</span>
            </div>
          </div>
          
          {/* Espaçador para desktop - 6 colunas reservadas para imagem absoluta */}
          <div className="col-span-6"></div>
        </div>
        
        {/* Layout para mobile/tablet - conteúdo centralizado */}
        <div className="lg:hidden flex flex-col items-center justify-center text-center py-16 px-4 min-h-[80vh]">
          <h1 className="font-alliance-n2 text-4xl md:text-5xl font-bold leading-tight mb-6">
            Organize suas finanças,<br />
            é só digitar
          </h1>
          <p className="font-alliance text-xl text-gray-600 mb-8 max-w-2xl">
            Chega de planilhas complexas. Digite seus gastos em linguagem natural e deixe nossa IA organizar tudo automaticamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary-hover text-white font-alliance-n2 text-lg px-4 w-full sm:w-auto">
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-gray-600 justify-center mb-8">
            <CheckCircle2 className="text-primary h-5 w-5" />
            <span className="font-alliance">Comece em menos de 2 minutos</span>
          </div>
          
          {/* Imagem abaixo do conteúdo para mobile/tablet */}
          <div className="w-full max-w-md mx-auto">
            <img
              src="/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png"
              alt="Dashboard do Sobrou mostrando controle financeiro completo"
              className="w-full h-auto rounded-2xl shadow-2xl"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;
