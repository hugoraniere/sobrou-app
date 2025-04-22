
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';

const CtaSection: React.FC = () => {
  return (
    <section className="bg-primary py-24 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-alliance-n2 text-3xl md:text-4xl font-bold mb-6">
          Comece agora mesmo
        </h2>
        <p className="font-alliance text-xl mb-8 opacity-90">
          Controle suas finanças de forma simples e inteligente
        </p>
        <Link to="/auth?tab=signup">
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-alliance-n2">
            Criar conta gratuita
          </Button>
        </Link>
        <div className="flex items-center justify-center gap-2 mt-6 text-white/90">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-alliance">Comece em menos de 2 minutos</span>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
