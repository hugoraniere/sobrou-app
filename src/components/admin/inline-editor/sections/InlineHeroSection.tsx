import React, { useState, useEffect } from 'react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import InlineEditableText from '../InlineEditableText';
import InlineEditableImage from '../InlineEditableImage';
import { Button } from '@/components/ui/button';
import { HeroConfig } from '@/services/landingPageService';

interface InlineHeroSectionProps {
  onConfigChange: () => void;
}

const InlineHeroSection: React.FC<InlineHeroSectionProps> = ({ onConfigChange }) => {
  const { getConfig, updateConfig } = useLandingPage();
  const [config, setConfig] = useState<HeroConfig | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const heroConfig = await getConfig('hero');
      if (heroConfig?.content) {
        setConfig(heroConfig.content);
      } else {
        // Default config
        setConfig({
          title: 'Automatize seu WhatsApp e venda mais',
          subtitle: 'Transforme conversas em vendas com nossa plataforma completa de automação e gestão financeira.',
          cta_text: 'Começar Gratuitamente',
          cta_url: '#',
          background_image: '',
          benefits: [
            {
              icon: '🚀',
              title: 'Automação Inteligente',
              description: 'Respostas automáticas personalizadas'
            },
            {
              icon: '💰',
              title: 'Gestão Financeira',
              description: 'Controle total das suas finanças'
            },
            {
              icon: '📊',
              title: 'Relatórios Detalhados',
              description: 'Insights para crescer seu negócio'
            }
          ]
        });
      }
    };

    loadConfig();
  }, [getConfig]);

  const handleConfigUpdate = async (field: string, value: any) => {
    if (!config) return;

    const updatedConfig = { ...config, [field]: value };
    setConfig(updatedConfig);
    
    await updateConfig('hero', updatedConfig);
    onConfigChange();
  };

  const handleBenefitUpdate = async (index: number, field: string, value: string) => {
    if (!config) return;

    const updatedBenefits = [...config.benefits];
    updatedBenefits[index] = { ...updatedBenefits[index], [field]: value };
    
    const updatedConfig = { ...config, benefits: updatedBenefits };
    setConfig(updatedConfig);
    
    await updateConfig('hero', updatedConfig);
    onConfigChange();
  };

  if (!config) return null;

  return (
    <section 
      id="section-hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: config.background_image ? `url(${config.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Image Editor */}
      {!config.background_image && (
        <div className="absolute inset-0">
          <InlineEditableImage
            src={config.background_image}
            section="hero"
            onImageChange={(url) => handleConfigUpdate('background_image', url)}
            placeholder="Adicionar imagem de fundo"
            containerClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {config.background_image && (
        <div className="absolute inset-0 group">
          <InlineEditableImage
            src={config.background_image}
            section="hero"
            onImageChange={(url) => handleConfigUpdate('background_image', url)}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <InlineEditableText
            element="h1"
            value={config.title}
            onChange={(value) => handleConfigUpdate('title', value)}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            placeholder="Título principal"
          />

          <InlineEditableText
            element="p"
            value={config.subtitle}
            onChange={(value) => handleConfigUpdate('subtitle', value)}
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto"
            placeholder="Subtítulo descritivo"
            multiline
          />

          <div className="mb-12">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <InlineEditableText
                value={config.cta_text}
                onChange={(value) => handleConfigUpdate('cta_text', value)}
                className="text-inherit"
                placeholder="Texto do botão"
              />
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {config.benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">
                  <InlineEditableText
                    value={benefit.icon}
                    onChange={(value) => handleBenefitUpdate(index, 'icon', value)}
                    className="inline-block"
                    placeholder="🚀"
                  />
                </div>
                <InlineEditableText
                  element="h3"
                  value={benefit.title}
                  onChange={(value) => handleBenefitUpdate(index, 'title', value)}
                  className="text-xl font-bold mb-2"
                  placeholder="Título do benefício"
                />
                <InlineEditableText
                  element="p"
                  value={benefit.description}
                  onChange={(value) => handleBenefitUpdate(index, 'description', value)}
                  className="text-white/80"
                  placeholder="Descrição do benefício"
                  multiline
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InlineHeroSection;