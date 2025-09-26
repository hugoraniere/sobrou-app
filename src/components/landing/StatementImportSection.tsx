import React from 'react';
import { Upload, FileText, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import InlineEditableText from '@/components/admin/inline-editor/InlineEditableText';
import InlineEditableImage from '@/components/admin/inline-editor/InlineEditableImage';

interface StatementImportSectionProps {
  editMode?: boolean;
}

const StatementImportSection: React.FC<StatementImportSectionProps> = ({ editMode = false }) => {
  const { getConfig, updateConfig } = useLandingPage();
  const statementConfig = getConfig('statement');

  // Fallback data
  const config = statementConfig?.content || {
    title: "Importação Automática de Extratos",
    subtitle: "Conecte suas contas bancárias e cartões de crédito para importação automática e categorização inteligente",
    image: "",
    features: [
      {
        icon: "Upload",
        title: "Importação Automática",
        description: "Conecte-se com mais de 100 bancos e cartões para sincronização automática"
      },
      {
        icon: "Zap",
        title: "Categorização IA",
        description: "Nossa IA categoriza suas transações automaticamente com 95% de precisão"
      },
      {
        icon: "CheckCircle",
        title: "Conciliação Inteligente",
        description: "Identificamos duplicatas e reconciliamos transações automaticamente"
      }
    ]
  };

  // Se a seção estiver oculta, não renderizar
  if (statementConfig && !statementConfig.is_visible) {
    return null;
  }

  const handleConfigChange = async (newContent: any) => {
    await updateConfig('statement', newContent);
  };

  const handleImageChange = async (imageUrl: string | null) => {
    await handleConfigChange({ ...config, image: imageUrl || "" });
  };

  const getIconComponent = (iconName: string) => {
    const icons = { Upload, FileText, Zap, CheckCircle, AlertTriangle };
    return icons[iconName as keyof typeof icons] || Upload;
  };

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {editMode ? (
              <InlineEditableImage
                src={config.image}
                alt="Importação de Extratos"
                onImageChange={handleImageChange}
                section="statement"
                containerClassName="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
                {config.image ? (
                  <img 
                    src={config.image} 
                    alt="Importação de Extratos"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-32 h-32 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Upload className="w-16 h-16 text-blue-600" />
                  </div>
                )}
              </div>
            )}
          </div>
          
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
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
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
        </div>
      </div>
    </section>
  );
};

export default StatementImportSection;