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
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
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
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              placeholder="Subtítulo da seção"
            />
          ) : (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {config.features.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon);
            const iconColors = ['text-green-600', 'text-blue-600', 'text-purple-600', 'text-orange-600'];
            const bgColors = ['bg-green-500/10', 'bg-blue-500/10', 'bg-purple-500/10', 'bg-orange-500/10'];
            
            return (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${bgColors[index % bgColors.length]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {editMode ? (
                    <InlineEditableIcon
                      iconName={feature.icon}
                      onIconChange={(newIcon) => {
                        const updatedFeatures = [...config.features];
                        updatedFeatures[index] = { ...feature, icon: newIcon };
                        handleConfigChange({ ...config, features: updatedFeatures });
                      }}
                      className={`w-8 h-8 ${iconColors[index % iconColors.length]}`}
                    />
                  ) : (
                    <IconComponent className={`w-8 h-8 ${iconColors[index % iconColors.length]}`} />
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
                    className="text-lg font-semibold text-foreground mb-3"
                    placeholder="Título do recurso"
                  />
                ) : (
                  <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
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
                    className="text-muted-foreground text-sm"
                    placeholder="Descrição do recurso"
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 text-center border border-border/30">
          <div className="flex items-center justify-center mb-4">
            <FileCheck className="w-8 h-8 text-primary" />
          </div>
          {editMode ? (
            <InlineEditableText
              value={config.calloutTitle}
              onChange={(value) => handleConfigChange({ ...config, calloutTitle: value })}
              element="h3"
              className="text-xl font-semibold text-foreground mb-4"
              placeholder="Título do destaque"
            />
          ) : (
            <h3 className="text-xl font-semibold text-foreground mb-4">{config.calloutTitle}</h3>
          )}
          {editMode ? (
            <InlineEditableText
              value={config.calloutText}
              onChange={(value) => handleConfigChange({ ...config, calloutText: value })}
              element="p"
              className="text-muted-foreground max-w-2xl mx-auto"
              placeholder="Texto do destaque"
            />
          ) : (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {config.calloutText}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SecurityPrivacySection;