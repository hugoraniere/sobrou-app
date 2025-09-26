import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Shield, Smartphone, Zap, Star } from 'lucide-react';
import LazyImage from '@/components/ui/LazyImage';
import { useLandingPage } from '@/contexts/LandingPageContext';
import * as LucideIcons from 'lucide-react';
import InlineEditableText from '@/components/admin/inline-editor/InlineEditableText';
import InlineEditableImage from '@/components/admin/inline-editor/InlineEditableImage';

interface HeroSectionProps {
  editMode?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ editMode = false }) => {
const { getConfig, updateConfig } = useLandingPage();
  const heroConfig = getConfig('hero');

  // Fallback data em caso de não carregar a configuração
  const config = heroConfig?.content || {
    title: "Organize suas finanças com linguagem natural",
    subtitle: "Diga adeus às planilhas complicadas. Com nossa IA, você organiza suas finanças falando naturalmente, como se fosse uma conversa.",
    cta_text: "Começar gratuitamente",
    cta_url: "/auth",
    background_image: "/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png",
    benefits: [
      {
        icon: "Zap",
        title: "Configuração em 5 minutos",
        description: "Comece a usar imediatamente"
      },
      {
        icon: "Shield",
        title: "Dados 100% seguros",
        description: "Criptografia de ponta a ponta"
      },
      {
        icon: "Smartphone",
        title: "Acesso multiplataforma",
        description: "Web, mobile e desktop"
      }
    ]
  };

  // Se a seção estiver oculta, não renderizar
  if (heroConfig && !heroConfig.is_visible) {
    return null;
  }

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || Star;
    return <IconComponent className="h-5 w-5 text-primary" />;
  };

  const handleConfigUpdate = async (field: string, value: any) => {
    if (!editMode) return;
    const updatedConfig = { ...config, [field]: value };
    await updateConfig('hero', updatedConfig);
  };

  const handleBenefitUpdate = async (index: number, field: string, value: string) => {
    if (!editMode) return;
    const updatedBenefits = [...config.benefits];
    updatedBenefits[index] = { ...updatedBenefits[index], [field]: value };
    const updatedConfig = { ...config, benefits: updatedBenefits };
    await updateConfig('hero', updatedConfig);
  };

  return (
    <section id="hero" className="w-full lg:h-[90vh] py-12 bg-green-50/30 overflow-x-visible flex items-center justify-center relative">
      <div className="h-full grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center gap-16 overflow-visible">
        {/* Div 1 - Conteúdo */}
        <div className="flex flex-col justify-center items-center text-center lg:text-left lg:items-start">
          <div className="max-w-2xl mx-auto lg:mx-0">
            {editMode ? (
              <InlineEditableText
                value={config.title}
                onChange={(value) => handleConfigUpdate('title', value)}
                element="h1"
                className="font-alliance-n2 text-4xl lg:text-[3.21515625rem] font-semibold leading-[1.3] mb-6 md:text-5xl"
                placeholder="Digite o título principal"
              />
            ) : (
              <h1 
                className="font-alliance-n2 text-4xl lg:text-[3.21515625rem] font-semibold leading-[1.3] mb-6 md:text-5xl"
                dangerouslySetInnerHTML={{ __html: config.title }}
              />
            )}
            
            {editMode ? (
              <InlineEditableText
                value={config.subtitle}
                onChange={(value) => handleConfigUpdate('subtitle', value)}
                element="div"
                className="font-alliance text-gray-600 mb-8 text-lg font-light"
                placeholder="Digite o subtítulo"
                multiline
              />
            ) : (
              <div 
                className="font-alliance text-gray-600 mb-8 text-lg font-light"
                dangerouslySetInnerHTML={{ __html: config.subtitle }}
              />
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={config.cta_url || "/auth"}>
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-white font-alliance-n2 text-lg px-4 w-full sm:w-auto">
                  {editMode ? (
                    <InlineEditableText
                      value={config.cta_text}
                      onChange={(value) => handleConfigUpdate('cta_text', value)}
                      element="span"
                      placeholder="Texto do botão"
                    />
                  ) : (
                    config.cta_text
                  )}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-6 text-gray-600 justify-center lg:justify-start">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span className="font-alliance">Comece em menos de 2 minutos</span>
            </div>
            
            {/* Benefícios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full">
              {config.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-green-100">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    {renderIcon(benefit.icon)}
                  </div>
                  <div className="text-left">
                    {editMode ? (
                      <InlineEditableText
                        value={benefit.title}
                        onChange={(value) => handleBenefitUpdate(index, 'title', value)}
                        element="span"
                        className="font-alliance text-sm font-medium text-gray-900 block"
                        placeholder="Título do benefício"
                      />
                    ) : (
                      <span className="font-alliance text-sm font-medium text-gray-900 block">{benefit.title}</span>
                    )}
                    {editMode ? (
                      <InlineEditableText
                        value={benefit.description}
                        onChange={(value) => handleBenefitUpdate(index, 'description', value)}
                        element="span"
                        className="font-alliance text-xs text-gray-600"
                        placeholder="Descrição do benefício"
                      />
                    ) : (
                      <span className="font-alliance text-xs text-gray-600">{benefit.description}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Div 2 - Imagem - Normal em mobile */}
        <div className="lg:hidden">
          {editMode ? (
            <InlineEditableImage
              src={config.background_image}
              alt="Dashboard do Sobrou mostrando controle financeiro completo"
              onImageChange={(src) => handleConfigUpdate('background_image', src)}
              section="hero"
              className="w-full h-auto object-contain object-center shadow-2xl rounded-lg"
            />
          ) : (
            <LazyImage 
              src={config.background_image}
              alt="Dashboard do Sobrou mostrando controle financeiro completo" 
              className="w-full h-auto object-contain object-center shadow-2xl rounded-lg"
              priority
              width={800}
              height={600}
            />
          )}
        </div>
      </div>

      {/* Imagem sangrando para a direita - Apenas desktop */}
      <div className="hidden lg:block absolute right-0 top-[10%] bottom-[10%] w-1/2 pointer-events-none overflow-hidden flex items-center justify-start">
        {editMode ? (
          <InlineEditableImage
            src={config.background_image}
            alt="Dashboard do Sobrou mostrando controle financeiro completo"
            onImageChange={(src) => handleConfigUpdate('background_image', src)}
            section="hero"
            className="max-h-full w-auto object-contain object-center shadow-2xl"
          />
        ) : (
          <LazyImage 
            src={config.background_image}
            alt="Dashboard do Sobrou mostrando controle financeiro completo" 
            className="max-h-full w-auto object-contain object-center shadow-2xl"
            priority
            width={1200}
            height={800}
          />
        )}
      </div>
    </section>
  );
};

export default HeroSection;