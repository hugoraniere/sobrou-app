
// Consolidate all text constants into a single file to simplify imports

export const COMMON_TEXT = {
  income: "Receita",
  expense: "Despesa",
  balance: "Saldo",
  savings: "Poupança",
  today: "Hoje",
  thisMonth: "Este Mês",
  lastMonth: "Mês Passado",
  upcoming: "Em breve",
  accumulated: "Acumulado",
  cancel: "Cancelar",
  error: "Erro",
  save: "Salvar",
  saving: "Salvando...",
  dashboard: "Visão Geral",
  transactions: "Transações",
  goals: "Metas",
  settings: "Configurações",
  user: "Usuário",
  daily: "Diária",
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual",
  processing: "Processando...",
  attention: "Atenção"
};

export const DASHBOARD_TEXT = {
  title: "Painel de Controle",
  subtitle: "Acompanhe suas finanças e analise seus hábitos de gastos",
  welcome: "Bem-vindo ao seu painel financeiro! Aqui você pode acompanhar suas finanças de forma rápida.",
  fromLastMonth: "do mês anterior",
  tabs: {
    overview: "Visão Geral",
    transactions: "Transações",
    analytics: "Análises"
  },
  charts: {
    categoryBreakdown: "Distribuição por categoria",
    incomeByType: "Fontes de receita",
    dailyEvolution: "Movimentações diárias",
    balanceByAccount: "Saldo por conta/cartão",
    balanceEvolution: "Evolução do saldo",
    monthlyComparison: "Comparação mensal",
    revenueVsExpense: "Receita vs Despesa (últimos 6 meses)",
    financialGoals: "Metas financeiras",
    noData: "Sem dados para exibir",
    noGoals: "Nenhuma meta de economia encontrada",
    createGoal: "Criar uma meta",
    day: "Dia",
    amount: "Valor",
    expensesOverTime: "Despesas ao longo do tempo"
  },
  bigNumbers: {
    monthlyExpenses: "Despesas Mensais",
    monthlyExpensesTooltip: "Total de despesas do mês atual",
    monthlyIncome: "Receita Mensal",
    monthlyIncomeTooltip: "Total de receitas do mês atual",
    availableBalance: "Saldo Disponível",
    availableBalanceTooltip: "Seu saldo disponível atual em todas as contas",
    pendingBalance: "Saldo Pendente",
    pendingBalanceTooltip: "Transações agendadas futuras",
    totalSavings: "Total de Economias",
    totalSavingsTooltip: "Suas economias acumuladas em todas as metas"
  },
  emptyState: {
    message: "Comece a registrar para ver seus dados"
  }
};

export const TRANSACTIONS_TEXT = {
  title: "Transações",
  subtitle: "Visualize e gerencie todas as suas transações financeiras",
  date: "Data",
  type: "Tipo",
  category: "Categoria",
  description: "Descrição",
  descriptionPlaceholder: "Ex: Supermercado",
  amount: "Valor",
  actions: "Ações",
  recurring: "Transação Recorrente",
  frequency: "Frequência",
  addNew: "Adicionar Nova Transação",
  add: "Adicionar Transação",
  addDescription: "Preencha os detalhes da nova transação",
  editTitle: "Editar Transação",
  editDescription: "Modifique os detalhes da transação abaixo",
  deleteTitle: "Excluir Transação",
  deleteConfirmation: "Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.",
  delete: "Excluir",
  deleteSuccess: "Transação excluída",
  transactionDeletedMessage: "Sua transação foi excluída.",
  deleteError: "Falha ao excluir transação",
  updateSuccess: "Transação atualizada com sucesso",
  updateError: "Falha ao atualizar transação",
  save: "Salvar alterações",
  undo: "Desfazer",
  restoreSuccess: "Transação restaurada",
  restoreDescription: "Sua transação foi restaurada.",
  removeRecurring: "Remover recorrência",
  setRecurring: "Tornar recorrente",
  expense: "Despesa",
  income: "Receita",
  allTransactions: "Todas as Transações",
  pageDescription: "Visualize, edite e gerencie suas transações",
  fetchError: "Erro ao carregar transações",
  addRecurring: "Adicionar Recorrente"
};

export const WHATSAPP_TEXT = {
  connection: "Conexão WhatsApp",
  description: "Conecte seu WhatsApp para registrar transações automaticamente",
  phoneNumberHint: "Inclua o código do país e DDD",
  connecting: "Conectando...",
  connect: "Conectar",
  status: "Status",
  statusDescription: "Seu número está conectado",
  connected: "Conectado",
  howToUse: "Como usar",
  howToUseDesc: "Instruções para usar o WhatsApp",
  examples: "Exemplos de mensagens",
  errorEmptyNumber: "Por favor, insira um número de telefone válido",
  successConnection: "WhatsApp conectado com sucesso!",
  errorConnection: "Erro ao conectar WhatsApp"
};

export const SETTINGS_TEXT = {
  title: "Configurações",
  tabs: {
    profile: "Perfil",
    preferences: "Preferências",
    whatsapp: "WhatsApp"
  },
  appearance: "Aparência",
  appearanceDescription: "Personalize a aparência do aplicativo",
  appearanceUpdated: "Aparência atualizada com sucesso",
  darkMode: "Modo escuro",
  darkModeDescription: "Alterne entre tema claro e escuro",
  chatPreferences: "Preferências de Chat",
  chatPreferencesDesc: "Configure suas preferências de chat",
  enableAI: "Ativar IA",
  enableAIDesc: "Permite que a IA ajude com suas finanças",
  security: "Segurança",
  securityDesc: "Gerencie as configurações de segurança",
  twoFactor: "Autenticação em dois fatores",
  twoFactorDesc: "Adicione uma camada extra de segurança",
  notifications: "Notificações",
  notificationsDesc: "Gerencie suas preferências de notificação",
  pushNotifications: "Notificações push",
  pushNotificationsDesc: "Receba notificações importantes",
  notificationsDescription: "Controle quais alertas você deseja receber",
  spendingAlerts: "Alertas de gastos",
  spendingAlertsDescription: "Receba alertas quando seus gastos ultrapassarem limites definidos",
  goalAchieved: "Metas atingidas",
  goalAchievedDescription: "Seja notificado quando atingir suas metas financeiras",
  autoSuggestions: "Sugestões automáticas",
  autoSuggestionsDescription: "Receba dicas personalizadas para melhorar suas finanças",
  preferencesUpdated: "Preferências atualizadas com sucesso",
  whatsapp: "Integração WhatsApp",
  whatsappDescription: "Registre transações diretamente pelo WhatsApp",
  whatsappStatus: "Status da Conexão",
  whatsappConnected: "Conectado",
  whatsappNotConnected: "Não conectado",
  manageConnection: "Gerenciar",
  connectWhatsapp: "Conectar WhatsApp",
  whatsappTips: "Como usar o WhatsApp",
  whatsappTip1: "Envie mensagens como \"Gastei R$50 no mercado\"",
  whatsappTip2: "Transações serão adicionadas automaticamente",
  whatsappTip3: "Suporte a várias categorias de despesas"
};

export const AUTH_TEXT = {
  confirmLogout: "Confirmar Saída",
  logoutConfirmation: "Tem certeza que deseja sair? Sua sessão será encerrada.",
  logout: "Sair"
};

export const TEXT = {
  common: COMMON_TEXT,
  dashboard: DASHBOARD_TEXT,
  transactions: TRANSACTIONS_TEXT,
  whatsapp: WHATSAPP_TEXT,
  settings: SETTINGS_TEXT,
  auth: AUTH_TEXT
};
