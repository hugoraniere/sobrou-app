import React from 'react';
import { MessageCircle, Phone, Mic, Zap, Shield, Clock } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import InlineEditableText from '@/components/admin/inline-editor/InlineEditableText';
import InlineEditableImage from '@/components/admin/inline-editor/InlineEditableImage';
import InlineEditableIcon from '@/components/admin/inline-editor/InlineEditableIcon';

interface WhatsAppVoiceSectionProps {
  editMode?: boolean;
}

const WhatsAppVoiceSection: React.FC<WhatsAppVoiceSectionProps> = ({ editMode = false }) => {
  const { getConfig, updateConfig } = useLandingPage();
  const whatsappConfig = getConfig('whatsapp');

  // Fallback data
  const config = whatsappConfig?.content || {
    title: "Registre gastos por WhatsApp e voz",
    subtitle: "A forma mais rápida e natural de controlar suas finanças. Sem complicação, sem perder tempo.",
    image: "",
    features: [
      {
        icon: "MessageCircle",
        title: "WhatsApp Integrado",
        description: "Envie mensagens diretamente pelo WhatsApp: \"Gastei 80 reais com combustível\". Nossa IA processa e categoriza automaticamente."
      },
      {
        icon: "Mic", 
        title: "Comando de Voz",
        description: "Grave áudios no app ou WhatsApp. Transcrição automática e processamento inteligente de múltiplas transações em uma única gravação."
      },
      {
        icon: "Smartphone",
        title: "PWA Mobile",
        description: "Instale como app nativo no seu celular. Funciona offline e sincroniza quando conectar."
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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {editMode ? (
              <InlineEditableText
                value={config.title}
                onChange={(value) => handleConfigChange({ ...config, title: value })}
                element="h2"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                placeholder="Título da seção"
              />
            ) : (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {config.title}
              </h2>
            )}
            {editMode ? (
              <InlineEditableText
                value={config.subtitle}
                onChange={(value) => handleConfigChange({ ...config, subtitle: value })}
                element="p"
                className="text-lg text-gray-600 mb-8 leading-relaxed"
                placeholder="Subtítulo da seção"
              />
            ) : (
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {config.subtitle}
              </p>
            )}

            <div className="space-y-6">
              {config.features.map((feature, index) => {
                const IconComponent = getIconComponent(feature.icon);
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      {editMode ? (
                        <InlineEditableIcon
                          iconName={feature.icon}
                          onIconChange={(newIcon) => {
                            const updatedFeatures = [...config.features];
                            updatedFeatures[index] = { ...feature, icon: newIcon };
                            handleConfigChange({ ...config, features: updatedFeatures });
                          }}
                          className="w-6 h-6 text-primary"
                        />
                      ) : (
                        <IconComponent className="w-6 h-6 text-primary" />
                      )}
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
                          className="text-lg font-semibold text-gray-900 mb-2"
                          placeholder="Título do recurso"
                        />
                      ) : (
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
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
                          className="text-gray-600 leading-relaxed"
                          placeholder="Descrição do recurso"
                        />
                      ) : (
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
                containerClassName="aspect-square bg-gray-200 rounded-2xl"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="aspect-square bg-gray-200 rounded-2xl flex items-center justify-center">
                {config.image ? (
                  <img 
                    src={config.image} 
                    alt="WhatsApp e Comandos de Voz"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="text-gray-400 text-8xl">📱</div>
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