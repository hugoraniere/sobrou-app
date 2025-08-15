import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative w-full min-h-[100svh] bg-green-50/30 scroll-mt-16 flex items-center overflow-hidden">
      {/* Imagem absoluta para desktop - fora do container para encostar na borda */}
      <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 w-[34vw] max-w-[720px] xl:max-w-[820px] pointer-events-none z-0">
        <div className="absolute inset-0 rounded-2xl bg-primary/5 translate-x-8 translate-y-8 -z-10" />
        <img
          src="/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png"
          alt="Dashboard do Sobrou mostrando controle financeiro completo"
          className="rounded-2xl shadow-2xl w-full h-auto"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          sizes="(min-width: 1024px) 34vw, 90vw"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
        <div className="grid grid-cols-12 items-center gap-12 lg:gap-16 h-full">
          {/* Texto / CTA - 8 colunas */}
          <div className="col-span-12 lg:col-span-8 flex flex-col justify-center px-4 text-center lg:text-left">
            <h1 className="font-alliance-n2 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Organize suas finanças,<br />
              é só digitar
            </h1>
            <p className="font-alliance text-xl text-gray-600 mb-8">
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
          
          {/* Espaçador para desktop - 4 colunas reservadas para imagem absoluta */}
          <div className="hidden lg:block col-span-4"></div>
        </div>
        
        {/* Imagem responsiva para mobile/tablet - fora do grid para ocupar altura total */}
        <div className="lg:hidden absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png"
            alt="Dashboard do Sobrou mostrando controle financeiro completo"
            className="w-full h-full object-cover object-center rounded-2xl shadow-2xl opacity-10"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection;
