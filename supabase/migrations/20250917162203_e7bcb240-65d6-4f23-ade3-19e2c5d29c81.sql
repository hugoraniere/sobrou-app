-- Create product tour tables
CREATE TABLE public.product_tour_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  anchor_id TEXT NOT NULL,
  page_route TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  visible_when TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user tour progress table
CREATE TABLE public.user_tour_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tour_version TEXT NOT NULL DEFAULT '1.0',
  started_at TIMESTAMP WITH TIME ZONE,
  current_step_key TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  skipped_at TIMESTAMP WITH TIME ZONE,
  total_steps INTEGER NOT NULL DEFAULT 0,
  completed_steps INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tour_version)
);

-- Create tour events table for analytics
CREATE TABLE public.tour_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id UUID,
  event_type TEXT NOT NULL, -- 'tour_started', 'step_viewed', 'step_completed', 'tour_skipped', 'tour_completed'
  step_key TEXT,
  page_route TEXT,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tour settings table
CREATE TABLE public.tour_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_tour_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tour_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_tour_steps
CREATE POLICY "Anyone can view active tour steps" ON public.product_tour_steps
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage tour steps" ON public.product_tour_steps
  FOR ALL USING (is_admin());

-- RLS Policies for user_tour_progress
CREATE POLICY "Users can view their own tour progress" ON public.user_tour_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tour progress" ON public.user_tour_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tour progress" ON public.user_tour_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tour progress" ON public.user_tour_progress
  FOR SELECT USING (is_admin());

-- RLS Policies for tour_events
CREATE POLICY "Users can insert their own tour events" ON public.tour_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all tour events" ON public.tour_events
  FOR SELECT USING (is_admin());

-- RLS Policies for tour_settings
CREATE POLICY "Anyone can view tour settings" ON public.tour_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tour settings" ON public.tour_settings
  FOR ALL USING (is_admin());

-- Create indexes for performance
CREATE INDEX idx_product_tour_steps_page_route ON public.product_tour_steps(page_route);
CREATE INDEX idx_product_tour_steps_step_order ON public.product_tour_steps(step_order);
CREATE INDEX idx_user_tour_progress_user_id ON public.user_tour_progress(user_id);
CREATE INDEX idx_tour_events_user_id ON public.tour_events(user_id);
CREATE INDEX idx_tour_events_event_type ON public.tour_events(event_type);
CREATE INDEX idx_tour_events_created_at ON public.tour_events(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_product_tour_steps_updated_at
  BEFORE UPDATE ON public.product_tour_steps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_tour_progress_updated_at
  BEFORE UPDATE ON public.user_tour_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tour_settings_updated_at
  BEFORE UPDATE ON public.tour_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial tour steps
INSERT INTO public.product_tour_steps (step_key, title, description, anchor_id, page_route, step_order) VALUES
-- Dashboard steps
('dashboard_overview', 'Visão Geral Financeira', 'Aqui você vê um resumo rápido das suas finanças 💰', 'dashboard.kpis.overview-cards', '/dashboard', 1),
('dashboard_add_transaction', 'Adicionar Transação', 'Clique aqui para adicionar receitas e despesas', 'dashboard.header.add-transaction-btn', '/dashboard', 2),
('dashboard_recent_transactions', 'Transações Recentes', 'Suas últimas movimentações ficam sempre à mão', 'dashboard.transactions.recent-list', '/dashboard', 3),
('dashboard_category_expenses', 'Gastos por Categoria', 'Dinheiro não some — ele vai pra algum lugar. Aqui você descobre pra onde 👀', 'dashboard.charts.category-expenses', '/dashboard', 4),
('dashboard_goals_progress', 'Progresso das Metas', 'Acompanhe o progresso das suas metas financeiras', 'dashboard.goals.progress-section', '/dashboard', 5),
('dashboard_bills_summary', 'Resumo de Contas', 'Nunca mais esqueça de uma conta importante', 'dashboard.bills.summary-card', '/dashboard', 6),

-- Transactions steps
('transactions_ai_input', 'IA para Transações', 'Use IA para adicionar transações com linguagem natural 🤖', 'transactions.ai.prompt-input', '/transactions', 7),
('transactions_view_toggle', 'Alterar Visualização', 'Alternar entre visão mensal and todas as transações', 'transactions.filters.view-toggle', '/transactions', 8),
('transactions_search', 'Busca de Transações', 'Encontre rapidamente qualquer transação', 'transactions.filters.search-bar', '/transactions', 9),
('transactions_import', 'Importar Extrato', 'Importe dados direto do seu banco', 'transactions.actions.import-statement-btn', '/transactions', 10),

-- Monthly Summary steps  
('monthly_year_selector', 'Seletor de Período', 'Escolha o período para análise', 'monthly-summary.filters.year-selector', '/monthly-summary', 11),
('monthly_expenses_tab', 'Gastos Mensais', 'Veja seus gastos organizados por mês', 'monthly-summary.tabs.monthly-expenses', '/monthly-summary', 12),
('monthly_data_table', 'Dados Detalhados', 'Dados detalhados para planejamento financeiro', 'monthly-summary.data.monthly-table', '/monthly-summary', 13),

-- Bills steps
('bills_new_bill', 'Nova Conta', 'Adicione contas fixas e parcelamentos', 'bills-to-pay.actions.new-bill-btn', '/bills-to-pay', 14),
('bills_period_filters', 'Filtros de Período', 'Organize por período de vencimento', 'bills-to-pay.filters.period-filters', '/bills-to-pay', 15),
('bills_list', 'Lista de Contas', 'Nunca mais perca um vencimento', 'bills-to-pay.list.bills-list', '/bills-to-pay', 16),

-- Goals steps
('goals_new_goal', 'Nova Meta', 'Crie metas financeiras e transforme sonhos em planos', 'goals.actions.new-goal-btn', '/goals', 17),
('goals_progress_cards', 'Progresso das Metas', 'Acompanhe seu progresso e se motive! 🎯', 'goals.progress.goal-cards', '/goals', 18),

-- Support steps
('support_search', 'Busca de Ajuda', 'Encontre respostas rapidamente', 'support.search.main-search', '/suporte', 19),
('support_faq', 'Perguntas Frequentes', 'Dúvidas frequentes organizadas para você', 'support.faq.accordion', '/suporte', 20);

-- Insert tour settings
INSERT INTO public.tour_settings (setting_key, setting_value) VALUES
('tour_enabled', '{"enabled": true, "auto_start_for_new_users": true}'),
('tour_config', '{"version": "1.0", "total_steps": 20, "show_progress": true, "allow_skip": true}'),
('tour_messages', '{"welcome_title": "Bem-vindo ao Sobrou! 👋", "welcome_description": "Vamos fazer um tour rápido para você conhecer as principais funcionalidades", "completion_title": "Parabéns! 🎉", "completion_description": "Você completou o tour. Agora você já sabe usar o Sobrou!"}');