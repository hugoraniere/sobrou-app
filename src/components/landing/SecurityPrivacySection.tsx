import React from 'react';
import { Shield, Lock, Eye, Server, FileCheck } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import InlineEditableText from '@/components/admin/inline-editor/InlineEditableText';
import InlineEditableIcon from '@/components/admin/inline-editor/InlineEditableIcon';

interface SecurityPrivacySectionProps {
  editMode?: boolean;
}

const SecurityPrivacySection: React.FC<SecurityPrivacySectionProps> = ({ editMode = false }) => {
  const { getConfig, updateConfig } = useLandingPage();
  const securityConfig = getConfig('security');

  // Fallback data
  const config = securityConfig?.content || {
    title: "Seus dados protegidos e privados",
    subtitle: "Segurança bancária e privacidade total. Seus dados financeiros ficam apenas com você.",
    calloutTitle: "Compromisso com a Transparência",
    calloutText: "Seguimos rigorosamente a LGPD (Lei Geral de Proteção de Dados). Você pode exportar, editar ou excluir todos os seus dados a qualquer momento. Nossa política de privacidade é clara e acessível, sem letras miúdas ou armadilhas.",
    features: [
      {
        icon: "Shield",
        title: "Criptografia Total",
        description: "Todos os dados são criptografados com padrão bancário AES-256. Suas informações ficam totalmente protegidas."
      },
      {
        icon: "Lock",
        title: "Acesso Seguro",
        description: "Autenticação multifator, sessões seguras e controle total sobre quem acessa suas informações."
      },
      {
        icon: "Eye",
        title: "Privacidade por Design",
        description: "Não vendemos nem compartilhamos seus dados. Você tem controle total sobre suas informações pessoais."
      },
      {
        icon: "Server",
        title: "Infraestrutura Confiável",
        description: "Hospedagem em servidores seguros, backup automático e alta disponibilidade garantida."
      }
    ]
  };

  // Se a seção estiver oculta, não renderizar
  if (securityConfig && !securityConfig.is_visible) {
    return null;
  }

  const handleConfigChange = async (newContent: any) => {
    await updateConfig('security', newContent);
  };

  const getIconComponent = (iconName: string) => {
    const icons = { Shield, Lock, Eye, Server, FileCheck };
    return icons[iconName as keyof typeof icons] || Shield;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
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
              className="text-lg text-gray-600 max-w-3xl mx-auto"
              placeholder="Subtítulo da seção"
            />
          ) : (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {config.features.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon);
            
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {editMode ? (
                    <InlineEditableIcon
                      iconName={feature.icon}
                      onIconChange={(newIcon) => {
                        const updatedFeatures = [...config.features];
                        updatedFeatures[index] = { ...feature, icon: newIcon };
                        handleConfigChange({ ...config, features: updatedFeatures });
                      }}
                      className="w-8 h-8 text-primary"
                    />
                  ) : (
                    <IconComponent className="w-8 h-8 text-primary" />
                  )}
                </div>
                {editMode ? (
                  <InlineEditableText
                    value={feature.title}
                    onChange={(value) => {
                      const updatedFeatures = [...config.features];
                      updatedFeatures[index] = { ...feature, title: value };
                      handleConfigChange({ ...config, features: updatedFeatures });
                    }}
                    element="h3"
                    className="text-lg font-semibold text-gray-900 mb-3"
                    placeholder="Título do recurso"
                  />
                ) : (
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
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
                    className="text-gray-600 text-sm leading-relaxed"
                    placeholder="Descrição do recurso"
                  />
                ) : (
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          {editMode ? (
            <InlineEditableText
              value={config.calloutTitle}
              onChange={(value) => handleConfigChange({ ...config, calloutTitle: value })}
              element="h3"
              className="text-xl font-semibold text-gray-900 mb-4"
              placeholder="Título do destaque"
            />
          ) : (
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{config.calloutTitle}</h3>
          )}
          {editMode ? (
            <InlineEditableText
              value={config.calloutText}
              onChange={(value) => handleConfigChange({ ...config, calloutText: value })}
              element="p"
              className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
              placeholder="Texto do destaque"
            />
          ) : (
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {config.calloutText}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SecurityPrivacySection;