import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';

const CtaSection: React.FC = () => {
  const { getConfig } = useLandingPage();
  const ctaConfig = getConfig('cta');

  // Fallback data
  const config = ctaConfig?.content || {
    title: "Comece a organizar suas finanças hoje",
    subtitle: "Junte-se a milhares de usuários que já transformaram sua vida financeira",
    cta_text: "Começar gratuitamente",
    cta_url: "/auth"
  };

  // Se a seção estiver oculta, não renderizar
  if (ctaConfig && !ctaConfig.is_visible) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {config.title}
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {config.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-primary hover:bg-white/95 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Link to={config.cta_url}>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {config.cta_text}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;