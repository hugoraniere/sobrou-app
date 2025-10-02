import React from 'react';
import { Upload, FileText, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import InlineEditableText from '@/components/admin/inline-editor/InlineEditableText';
import InlineEditableImage from '@/components/admin/inline-editor/InlineEditableImage';
import InlineEditableIcon from '@/components/admin/inline-editor/InlineEditableIcon';

interface StatementImportSectionProps {
  editMode?: boolean;
}

const StatementImportSection: React.FC<StatementImportSectionProps> = ({ editMode = false }) => {
  const { getConfig, updateConfig } = useLandingPage();
  const statementConfig = getConfig('statement');

  // Fallback data
  const config = statementConfig?.content || {
    title: "Importação inteligente de extratos",
    subtitle: "Economize horas de trabalho manual. Importe extratos bancários e deixe nossa IA organizar tudo.",
    image: "",
    features: [
      {
        icon: "FileText",
        title: "Múltiplos Formatos",
        description: "Suporte para PDF, CSV, Excel e outros formatos comuns de extratos bancários. Reconhecimento automático do layout."
      },
      {
        icon: "Zap",
        title: "Categorização Automática",
        description: "Nossa IA analisa históricos e padrões para categorizar automaticamente suas transações com alta precisão."
      },
      {
        icon: "CheckCircle",
        title: "Processamento Rápido",
        description: "Centenas de transações processadas em segundos. Revisão fácil e ajustes rápidos quando necessário."
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {editMode ? (
              <InlineEditableImage
                src={config.image}
                alt="Importação de Extratos"
                onImageChange={handleImageChange}
                section="statement"
                containerClassName="aspect-square bg-gray-200 rounded-2xl"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="aspect-square bg-gray-200 rounded-2xl flex items-center justify-center">
                {config.image ? (
                  <img 
                    src={config.image} 
                    alt="Importação de Extratos"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="text-gray-400 text-8xl">📄</div>
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
                          onIconChange={(iconName) => {
                            const updatedFeatures = [...config.features];
                            updatedFeatures[index] = { ...feature, icon: iconName };
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
        </div>
      </div>
    </section>
  );
};

export default StatementImportSection;