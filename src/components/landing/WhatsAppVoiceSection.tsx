import React from 'react';
import { MessageCircle, Phone, Mic, Zap, Shield, Clock } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import InlineEditableText from '@/components/admin/inline-editor/InlineEditableText';
import InlineEditableImage from '@/components/admin/inline-editor/InlineEditableImage';

interface WhatsAppVoiceSectionProps {
  editMode?: boolean;
}

const WhatsAppVoiceSection: React.FC<WhatsAppVoiceSectionProps> = ({ editMode = false }) => {
  const { getConfig, updateConfig } = useLandingPage();
  const whatsappConfig = getConfig('whatsapp');

  // Fallback data
  const config = whatsappConfig?.content || {
    title: "Conecte-se via WhatsApp & Voz",
    subtitle: "Controle suas finanças de forma natural e intuitiva através de comandos de voz e mensagens no WhatsApp",
    image: "",
    features: [
      {
        icon: "MessageCircle",
        title: "WhatsApp Bot",
        description: "Registre gastos e consulte saldo através do WhatsApp de forma simples e rápida"
      },
      {
        icon: "Mic", 
        title: "Comando de Voz",
        description: "Fale naturalmente suas transações e deixe a IA processar automaticamente"
      },
      {
        icon: "Zap",
        title: "Resposta Instantânea",
        description: "Receba confirmações e relatórios em tempo real, onde quer que esteja"
      }
    ]
  };

  // Se a seção estiver oculta, não renderizar
  if (whatsappConfig && !whatsappConfig.is_visible) {
    return null;
  }

  const handleConfigChange = async (newContent: any) => {
    await updateConfig('whatsapp', newContent);
  };

  const handleImageChange = async (imageUrl: string | null) => {
    await handleConfigChange({ ...config, image: imageUrl || "" });
  };

  const getIconComponent = (iconName: string) => {
    const icons = { MessageCircle, Phone, Mic, Zap, Shield, Clock };
    return icons[iconName as keyof typeof icons] || MessageCircle;
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {editMode ? (
              <InlineEditableText
                value={config.title}
                onChange={(value) => handleConfigChange({ ...config, title: value })}
                element="h2"
                className="text-3xl md:text-4xl font-bold text-foreground mb-6"
                placeholder="Título da seção"
              />
            ) : (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {config.title}
              </h2>
            )}
            {editMode ? (
              <InlineEditableText
                value={config.subtitle}
                onChange={(value) => handleConfigChange({ ...config, subtitle: value })}
                element="p"
                className="text-xl text-muted-foreground mb-8"
                placeholder="Subtítulo da seção"
              />
            ) : (
              <p className="text-xl text-muted-foreground mb-8">
                {config.subtitle}
              </p>
            )}

            <div className="space-y-6">
              {config.features.map((feature, index) => {
                const IconComponent = getIconComponent(feature.icon);
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      {editMode ? (
                        <InlineEditableText
                          value={feature.title}
                          onChange={(value) => {
                            const updatedFeatures = [...config.features];
                            updatedFeatures[index] = { ...feature, title: value };
                            handleConfigChange({ ...config, features: updatedFeatures });
                          }}
                          element="h3"
                          className="text-lg font-semibold text-foreground mb-2"
                          placeholder="Título do recurso"
                        />
                      ) : (
                        <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                      )}
                      {editMode ? (
                        <InlineEditableText
                          value={feature.description}
                          onChange={(value) => {
                            const updatedFeatures = [...config.features];
                            updatedFeatures[index] = { ...feature, description: value };
                            handleConfigChange({ ...config, features: updatedFeatures });
                          }}
                          element="p"
                          className="text-muted-foreground"
                          placeholder="Descrição do recurso"
                        />
                      ) : (
                        <p className="text-muted-foreground">{feature.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            {editMode ? (
              <InlineEditableImage
                src={config.image}
                alt="WhatsApp e Comandos de Voz"
                onImageChange={handleImageChange}
                section="whatsapp"
                containerClassName="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                {config.image ? (
                  <img 
                    src={config.image} 
                    alt="WhatsApp e Comandos de Voz"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-16 h-16 text-primary" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppVoiceSection;