import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import InlineEditableText from '@/components/admin/inline-editor/InlineEditableText';

interface CtaSectionProps {
  editMode?: boolean;
}

const CtaSection: React.FC<CtaSectionProps> = ({ editMode = false }) => {
  const { getConfig, updateConfig } = useLandingPage();
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

  const handleConfigChange = async (newContent: any) => {
    await updateConfig('cta', newContent);
  };

  return (
    <section className="py-20 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {editMode ? (
          <InlineEditableText
            value={config.title}
            onChange={(value) => handleConfigChange({ ...config, title: value })}
            element="h2"
            className="text-3xl md:text-4xl font-bold mb-6"
            placeholder="Título do CTA"
          />
        ) : (
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {config.title}
          </h2>
        )}
        {editMode ? (
          <InlineEditableText
            value={config.subtitle}
            onChange={(value) => handleConfigChange({ ...config, subtitle: value })}
            element="p"
            className="text-lg mb-8 max-w-2xl mx-auto opacity-90"
            placeholder="Subtítulo do CTA"
          />
        ) : (
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            {config.subtitle}
          </p>
        )}
        <div className="flex justify-center">
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg rounded-full"
          >
            <Link to={config.cta_url}>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {editMode ? (
                <InlineEditableText
                  value={config.cta_text}
                  onChange={(value) => handleConfigChange({ ...config, cta_text: value })}
                  element="span"
                  placeholder="Texto do botão"
                />
              ) : (
                config.cta_text
              )}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;