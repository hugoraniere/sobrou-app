import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Star } from 'lucide-react';
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
    title:
      "Organize suas finanças, <span style='color: #22c55e;'>é só digitar</span>",
    subtitle:
      'Chega de planilhas complexas. Digite seus gastos em linguagem natural e deixe nossa IA organizar tudo automaticamente.',
    cta_text: 'Começar agora',
    cta_url: '/auth',
    background_image:
      '/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png',
    benefits: [
      {
        icon: 'Shield',
        title: 'Segurança dos seus dados em primeiro lugar',
        description: 'Proteção avançada para suas informações',
      },
      {
        icon: 'Smartphone',
        title: 'Acesse quando quiser, no celular ou computador',
        description: 'Disponível em todos os dispositivos',
      },
    ],
  };

  // Se a seção estiver oculta, não renderizar
  if (heroConfig && !heroConfig.is_visible) return null;

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || Star;
    return <IconComponent className="h-5 w-5 text-primary" />;
  };

  const handleConfigUpdate = async (field: string, value: any) => {
    if (!editMode) return;
    const updatedConfig = { ...config, [field]: value };
    await updateConfig('hero', updatedConfig);
  };

  const handleBenefitUpdate = async (
    index: number,
    field: string,
    value: string
  ) => {
    if (!editMode) return;
    const updatedBenefits = [...config.benefits];
    updatedBenefits[index] = { ...updatedBenefits[index], [field]: value };
    const updatedConfig = { ...config, benefits: updatedBenefits };
    await updateConfig('hero', updatedConfig);
  };

  return (
    <section
      id="hero"
      className="w-full py-16 lg:py-24 overflow-x-visible bg-main-bg-color relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            {editMode ? (
              <InlineEditableText
                value={config.title}
                onChange={(value) => handleConfigUpdate('title', value)}
                element="h1"
                className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900"
                placeholder="Digite o título principal"
              />
            ) : (
              <h1
                className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900"
                dangerouslySetInnerHTML={{ __html: config.title }}
              />
            )}

            {editMode ? (
              <InlineEditableText
                value={config.subtitle}
                onChange={(value) => handleConfigUpdate('subtitle', value)}
                element="div"
                className="text-lg lg:text-xl text-gray-600 leading-relaxed"
                placeholder="Digite o subtítulo"
                multiline
              />
            ) : (
              <div
                className="text-lg lg:text-xl text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: config.subtitle }}
              />
            )}

            <div>
              <Link to={config.cta_url || '/auth'}>
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg rounded-full">
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

            <div className="inline-flex w-fit items-center justify-center lg:justify-start gap-2 text-gray-600 lg:mx-0 mx-0">
              <CheckCircle2 className="text-primary h-5 w-5" />
              <span>Comece em menos de 2 minutos</span>
            </div>

            {/* Benefits - agora como cards lado a lado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
              {config.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm ring-1 ring-black/5"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    {renderIcon(benefit.icon)}
                  </div>
                  <div className="text-left">
                    {editMode ? (
                      <InlineEditableText
                        value={benefit.title}
                        onChange={(value) =>
                          handleBenefitUpdate(index, 'title', value)
                        }
                        element="span"
                        className="text-base font-medium text-gray-900 block"
                        placeholder="Título do benefício"
                      />
                    ) : (
                      <span className="text-base font-medium text-gray-900 block">
                        {benefit.title}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative mx-auto lg:mx-0">
            {editMode ? (
              <InlineEditableImage
                src={config.background_image}
                alt="Dashboard do Sobrou mostrando controle financeiro completo"
                onImageChange={(src) => handleConfigUpdate('background_image', src)}
                section="hero"
                className="w-full h-auto object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <LazyImage
                src={config.background_image}
                alt="Dashboard do Sobrou mostrando controle financeiro completo"
                className="w-full h-auto object-contain rounded-lg shadow-2xl"
                priority
                width={800}
                height={600}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
