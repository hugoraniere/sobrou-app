import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';

const CtaSection: React.FC = () => {
  return (
    <section id="cta" className="w-full py-16 sm:py-20 lg:py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary py-16 sm:py-20 lg:py-24 text-white rounded-2xl">
          <div className="text-center">
            <h2 className="font-outfit text-3xl md:text-4xl font-bold mb-6">
              Comece agora mesmo
            </h2>
            <p className="font-outfit text-xl mb-8 opacity-90">
              Controle suas finanças de forma simples e inteligente
            </p>
            <Link to="/auth?tab=signup">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-outfit w-full sm:w-auto">
                Criar conta gratuita
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-2 mt-6 text-white/90">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-outfit">Comece em menos de 2 minutos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
