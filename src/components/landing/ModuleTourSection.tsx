import React from 'react';
import { BarChart3, Calendar, Receipt, Target, Calculator } from 'lucide-react';
import InlineEditableText from '@/components/admin/inline-editor/InlineEditableText';
import InlineEditableIcon from '@/components/admin/inline-editor/InlineEditableIcon';
import InlineEditableImage from '@/components/admin/inline-editor/InlineEditableImage';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { getIconComponent } from '@/utils/iconLibrary';

interface ModuleTourSectionProps {
  editMode?: boolean;
}

const ModuleTourSection: React.FC<ModuleTourSectionProps> = ({ editMode = false }) => {
  const { getConfig, updateConfig } = useLandingPage();
  
  const config = getConfig('modules');
  
  // Default modules data
  const defaultModules = [
    {
      id: 'dashboard',
      iconName: 'BarChart3',
      title: "Dashboard Inteligente",
      description: "Visão completa das suas finanças com gráficos interativos e insights personalizados.",
      image: "/placeholder.svg"
    },
    {
      id: 'transactions',
      iconName: 'Receipt',
      title: "Gestão de Transações",
      description: "Cadastro por voz, texto ou WhatsApp. Importação de extratos bancários automática.",
      image: "/placeholder.svg"
    },
    {
      id: 'planning',
      iconName: 'Calendar',
      title: "Planejamento Mensal",
      description: "Organize seu orçamento, compare períodos e simule cenários financeiros.",
      image: "/placeholder.svg"
    },
    {
      id: 'goals',
      iconName: 'Target',
      title: "Metas de Economia",
      description: "Defina objetivos, acompanhe progresso e receba sugestões inteligentes de economia.",
      image: "/placeholder.svg"
    },
    {
      id: 'bills',
      iconName: 'Receipt',
      title: "Contas a Pagar",
      description: "Controle total sobre vencimentos, pagamentos e fluxo de caixa.",
      image: "/placeholder.svg"
    },
    {
      id: 'calculator',
      iconName: 'Calculator',
      title: "Calculadora de Restaurante",
      description: "Ferramenta especializada para calcular custos de pratos e ingredientes.",
      image: "/placeholder.svg"
    }
  ];

  const currentConfig = config?.content || {};
  const title = currentConfig.title || "Módulos completos para seu negócio";
  const subtitle = currentConfig.subtitle || "Todas as ferramentas que você precisa para gerenciar suas finanças pessoais ou empresariais";
  const modules = currentConfig.modules || defaultModules;

  const handleConfigChange = async (field: string, value: any) => {
    const newContent = {
      ...currentConfig,
      [field]: value
    };
    await updateConfig('modules', newContent);
  };

  const handleModuleChange = async (moduleId: string, field: string, value: any) => {
    const updatedModules = modules.map((module: any) => 
      module.id === moduleId ? { ...module, [field]: value } : module
    );
    await handleConfigChange('modules', updatedModules);
  };

  if (config?.is_visible === false) {
    return null;
  }

  return (
    <section id="modulos" className="w-full py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          {editMode ? (
            <InlineEditableText
              value={title}
              onChange={(value) => handleConfigChange('title', value)}
              element="h2"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              placeholder="Título da seção"
            />
          ) : (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
          )}
          {editMode ? (
            <InlineEditableText
              value={subtitle}
              onChange={(value) => handleConfigChange('subtitle', value)}
              element="p"
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              placeholder="Subtítulo da seção"
            />
          ) : (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module: any) => {
            const IconComponent = getIconComponent(module.iconName);
            return (
              <div key={module.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="mb-6">
                  <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    {editMode ? (
                      <InlineEditableIcon
                        iconName={module.iconName}
                        onIconChange={(iconName) => handleModuleChange(module.id, 'iconName', iconName)}
                        className="text-primary"
                        size={24}
                      />
                    ) : (
                      IconComponent && <IconComponent className="text-primary h-6 w-6" />
                    )}
                  </div>
                  {editMode ? (
                    <InlineEditableText
                      value={module.title}
                      onChange={(value) => handleModuleChange(module.id, 'title', value)}
                      element="h3"
                      className="text-lg font-semibold text-gray-900 mb-3"
                      placeholder="Título do módulo"
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {module.title}
                    </h3>
                  )}
                  {editMode ? (
                    <InlineEditableText
                      value={module.description}
                      onChange={(value) => handleModuleChange(module.id, 'description', value)}
                      element="p"
                      className="text-gray-600 text-sm leading-relaxed mb-6"
                      placeholder="Descrição do módulo"
                      multiline
                    />
                  ) : (
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {module.description}
                    </p>
                  )}
                </div>
                <div className="relative">
                  {editMode ? (
                    <InlineEditableImage
                      src={module.image}
                      alt={`Interface do módulo ${module.title}`}
                      onImageChange={(imageUrl) => handleModuleChange(module.id, 'image', imageUrl)}
                      section="modules"
                      className="w-full h-40 object-cover rounded-lg bg-gray-100"
                    />
                  ) : (
                    <div className="w-full h-40 object-cover rounded-lg bg-gray-100 flex items-center justify-center">
                      {module.image && module.image !== "/placeholder.svg" ? (
                        <img
                          src={module.image}
                          alt={`Interface do módulo ${module.title}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-gray-400 text-6xl">📊</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ModuleTourSection;