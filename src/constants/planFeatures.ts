export interface FeatureModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: PlanFeature[];
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  type: 'boolean' | 'limit' | 'text';
  defaultLimit?: string;
}

export const FEATURE_MODULES: FeatureModule[] = [
  {
    id: 'dashboard',
    name: 'Painel de Controle',
    description: 'Funcionalidades de análise e controle financeiro',
    icon: 'LayoutDashboard',
    features: [
      {
        id: 'basic_dashboard',
        name: 'Dashboard Básico',
        description: 'Visão geral de receitas e despesas',
        type: 'boolean'
      },
      {
        id: 'advanced_analytics',
        name: 'Análises Avançadas',
        description: 'Gráficos detalhados e insights financeiros',
        type: 'boolean'
      },
      {
        id: 'custom_reports',
        name: 'Relatórios Personalizados',
        description: 'Geração de relatórios customizados',
        type: 'boolean'
      },
      {
        id: 'data_export',
        name: 'Exportação de Dados',
        description: 'Exportar dados em Excel, PDF e CSV',
        type: 'limit',
        defaultLimit: '10/mês'
      },
      {
        id: 'transaction_limit',
        name: 'Limite de Transações',
        description: 'Número máximo de transações por mês',
        type: 'limit',
        defaultLimit: '100/mês'
      }
    ]
  },
  {
    id: 'content',
    name: 'Conteúdo',
    description: 'Acesso a materiais educativos e blog',
    icon: 'FileText',
    features: [
      {
        id: 'blog_access',
        name: 'Acesso ao Blog',
        description: 'Leitura de artigos sobre educação financeira',
        type: 'boolean'
      },
      {
        id: 'premium_content',
        name: 'Conteúdo Premium',
        description: 'Acesso a materiais exclusivos e cursos',
        type: 'boolean'
      },
      {
        id: 'webinars',
        name: 'Webinars',
        description: 'Participação em webinars ao vivo',
        type: 'limit',
        defaultLimit: '2/mês'
      },
      {
        id: 'downloadable_resources',
        name: 'Recursos para Download',
        description: 'E-books, planilhas e guias',
        type: 'limit',
        defaultLimit: '5/mês'
      }
    ]
  },
  {
    id: 'support',
    name: 'Suporte',
    description: 'Canais de atendimento e suporte',
    icon: 'MessageSquare',
    features: [
      {
        id: 'help_center',
        name: 'Central de Ajuda',
        description: 'Acesso à base de conhecimento',
        type: 'boolean'
      },
      {
        id: 'email_support',
        name: 'Suporte por Email',
        description: 'Atendimento via email',
        type: 'boolean'
      },
      {
        id: 'priority_support',
        name: 'Suporte Prioritário',
        description: 'Atendimento com prioridade e tempo de resposta reduzido',
        type: 'boolean'
      },
      {
        id: 'phone_support',
        name: 'Suporte Telefônico',
        description: 'Atendimento por telefone',
        type: 'boolean'
      },
      {
        id: 'personal_advisor',
        name: 'Consultor Pessoal',
        description: 'Consultor financeiro dedicado',
        type: 'limit',
        defaultLimit: '1 hora/mês'
      }
    ]
  },
  {
    id: 'personalization',
    name: 'Personalização',
    description: 'Customização e configurações avançadas',
    icon: 'Palette',
    features: [
      {
        id: 'custom_categories',
        name: 'Categorias Customizadas',
        description: 'Criar categorias personalizadas para transações',
        type: 'limit',
        defaultLimit: '10 categorias'
      },
      {
        id: 'custom_tags',
        name: 'Tags Personalizadas',
        description: 'Sistema de tags para organização',
        type: 'limit',
        defaultLimit: '20 tags'
      },
      {
        id: 'custom_alerts',
        name: 'Alertas Personalizados',
        description: 'Configurar alertas customizados',
        type: 'limit',
        defaultLimit: '5 alertas'
      },
      {
        id: 'custom_goals',
        name: 'Metas Customizadas',
        description: 'Criar metas de economia personalizadas',
        type: 'limit',
        defaultLimit: '3 metas'
      },
      {
        id: 'white_label',
        name: 'White Label',
        description: 'Personalização da marca e interface',
        type: 'boolean'
      }
    ]
  },
  {
    id: 'tools',
    name: 'Ferramentas',
    description: 'Ferramentas avançadas e integrações',
    icon: 'Settings',
    features: [
      {
        id: 'ai_chat',
        name: 'Chat IA',
        description: 'Assistente de IA para dúvidas financeiras',
        type: 'limit',
        defaultLimit: '50 mensagens/mês'
      },
      {
        id: 'whatsapp_integration',
        name: 'Integração WhatsApp',
        description: 'Receber notificações e fazer consultas via WhatsApp',
        type: 'boolean'
      },
      {
        id: 'api_access',
        name: 'Acesso à API',
        description: 'Integração com sistemas externos via API',
        type: 'boolean'
      },
      {
        id: 'bank_sync',
        name: 'Sincronização Bancária',
        description: 'Importação automática de transações bancárias',
        type: 'limit',
        defaultLimit: '2 contas'
      },
      {
        id: 'multiple_accounts',
        name: 'Múltiplas Contas',
        description: 'Gerenciar várias contas financeiras',
        type: 'limit',
        defaultLimit: '5 contas'
      }
    ]
  }
];

// Helper function to get all features as a flat array (for backwards compatibility)
export const getAllFeatures = (): PlanFeature[] => {
  return FEATURE_MODULES.flatMap(module => module.features);
};

// Helper function to get feature by ID
export const getFeatureById = (featureId: string): PlanFeature | undefined => {
  return getAllFeatures().find(feature => feature.id === featureId);
};

// Helper function to get module by feature ID
export const getModuleByFeatureId = (featureId: string): FeatureModule | undefined => {
  return FEATURE_MODULES.find(module => 
    module.features.some(feature => feature.id === featureId)
  );
};

// User permission types (different from plan features)
export interface UserPermission {
  id: string;
  name: string;
  description: string;
  level: 'user' | 'content' | 'support' | 'admin';
}

export const USER_PERMISSIONS: UserPermission[] = [
  {
    id: 'default',
    name: 'Usuário Padrão',
    description: 'Acesso básico às funcionalidades do sistema',
    level: 'user'
  },
  {
    id: 'content',
    name: 'Gestor de Conteúdo',
    description: 'Pode gerenciar blog, artigos e materiais educativos',
    level: 'content'
  },
  {
    id: 'support',
    name: 'Agente de Suporte',
    description: 'Pode acessar central de ajuda e atender usuários',
    level: 'support'
  },
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acesso total ao sistema e configurações',
    level: 'admin'
  }
];