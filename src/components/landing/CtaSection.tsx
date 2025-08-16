import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
const CtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Comece a organizar suas finanças hoje
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de usuários que já transformaram sua vida financeira
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
            <Link to="/auth">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Começar gratuitamente
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
export default CtaSection;