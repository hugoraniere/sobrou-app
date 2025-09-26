import React from 'react';
import { Brain, TrendingUp, Bell, Target, Lightbulb } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import InlineEditableText from '@/components/admin/inline-editor/InlineEditableText';
import InlineEditableIcon from '@/components/admin/inline-editor/InlineEditableIcon';

interface AutomationAISectionProps {
  editMode?: boolean;
}

const AutomationAISection: React.FC<AutomationAISectionProps> = ({ editMode = false }) => {
  const { getConfig, updateConfig } = useLandingPage();
  const automationConfig = getConfig('automation');

  // Fallback data
  const config = automationConfig?.content || {
    title: "Automação Financeira com IA",
    subtitle: "Nossa inteligência artificial trabalha 24/7 para otimizar suas finanças e identificar oportunidades de economia",
    callout: "A IA continua aprendendo com seus hábitos para oferecer sugestões cada vez mais precisas e personalizadas.",
    features: [
      {
        icon: "Lightbulb",
        title: "Insights Automáticos",
        description: "Análise de padrões de gastos para identificar oportunidades de economia e tendências financeiras",
        quote: "Você gasta 23% mais com delivery nos fins de semana. Considere cozinhar em casa para economizar R$ 180/mês."
      },
      {
        icon: "Bell",
        title: "Alertas Inteligentes", 
        description: "Notificações proativas sobre gastos incomuns, metas próximas do limite e contas a vencer",
        quote: "Atenção: Gasto com cartão de crédito 40% acima da média. Considere revisar as compras deste mês."
      },
      {
        icon: "TrendingUp",
        title: "Previsões Financeiras",
        description: "Simulações de cenários futuros baseados em seus hábitos atuais e metas estabelecidas",
        quote: "Com o padrão atual, você atingirá sua meta de R$ 10.000 em aproximadamente 8 meses."
      },
      {
        icon: "Target",
        title: "Metas Adaptativas",
        description: "Ajuste automático de metas de economia baseado no seu desempenho e sugestões realistas",
        quote: "Sua meta de economia foi ajustada para R$ 800/mês (anteriormente R$ 1.200) com base no seu histórico."
      }
    ]
  };

  // Se a seção estiver oculta, não renderizar
  if (automationConfig && !automationConfig.is_visible) {
    return null;
  }

  const handleConfigChange = async (newContent: any) => {
    await updateConfig('automation', newContent);
  };

  const getIconComponent = (iconName: string) => {
    const icons = { Brain, TrendingUp, Bell, Target, Lightbulb };
    return icons[iconName as keyof typeof icons] || Brain;
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto mb-16">
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
              className="text-xl text-muted-foreground"
              placeholder="Subtítulo da seção"
            />
          ) : (
            <p className="text-xl text-muted-foreground">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {config.features.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon);
            const gradientColors = [
              'from-yellow-500/20 to-orange-500/20',
              'from-blue-500/20 to-purple-500/20',
              'from-green-500/20 to-teal-500/20',
              'from-purple-500/20 to-pink-500/20'
            ];
            const iconColors = ['text-yellow-600', 'text-blue-600', 'text-green-600', 'text-purple-600'];
            
            return (
              <div key={index} className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50">
                <div className={`w-16 h-16 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} rounded-xl flex items-center justify-center mb-6`}>
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
                    className="text-xl font-semibold text-foreground mb-4"
                    placeholder="Título do recurso"
                  />
                ) : (
                  <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
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
                    className="text-muted-foreground mb-6"
                    placeholder="Descrição do recurso"
                  />
                ) : (
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                )}
                <div className="bg-muted/30 rounded-lg p-4">
                  {editMode ? (
                    <InlineEditableText
                      value={feature.quote}
                      onChange={(value) => {
                        const updatedFeatures = [...config.features];
                        updatedFeatures[index] = { ...feature, quote: value };
                        handleConfigChange({ ...config, features: updatedFeatures });
                      }}
                      element="p"
                      className="text-sm text-muted-foreground italic"
                      placeholder="Exemplo de insight"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground italic">"{feature.quote}"</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          {editMode ? (
            <InlineEditableText
              value={config.callout}
              onChange={(value) => handleConfigChange({ ...config, callout: value })}
              element="p"
              className="text-center text-lg text-muted-foreground max-w-3xl mx-auto"
              placeholder="Texto de destaque sobre a IA"
            />
          ) : (
            <p className="text-center text-lg text-muted-foreground max-w-3xl mx-auto">
              {config.callout}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AutomationAISection;