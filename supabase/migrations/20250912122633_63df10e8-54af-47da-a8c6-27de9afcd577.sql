-- Criar enum para roles de suporte
CREATE TYPE support_role AS ENUM ('support_agent', 'support_admin');

-- Criar sequência para numeração de tickets
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1;

-- Tópicos de Suporte
CREATE TABLE public.support_topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'HelpCircle',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Artigos de Suporte
CREATE TABLE public.support_articles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    topic_id UUID REFERENCES public.support_topics(id),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    helpful_votes INTEGER DEFAULT 0,
    not_helpful_votes INTEGER DEFAULT 0,
    reading_time_minutes INTEGER DEFAULT 1,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- FAQ Entries
CREATE TABLE public.faq_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer_md TEXT NOT NULL,
    tags TEXT[],
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tickets
CREATE TABLE public.tickets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_number TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    assignee_id UUID REFERENCES auth.users(id),
    type TEXT NOT NULL CHECK (type IN ('bug', 'solicitacao', 'reclamacao', 'duvida')),
    category TEXT NOT NULL,
    subcategory TEXT,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'baixa' CHECK (priority IN ('baixa', 'media', 'alta')),
    status TEXT DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_andamento', 'aguardando_resposta', 'resolvido', 'fechado')),
    url_context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    sla_due_at TIMESTAMP WITH TIME ZONE
);

-- Mensagens do Ticket
CREATE TABLE public.ticket_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Anexos
CREATE TABLE public.ticket_attachments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    message_id UUID REFERENCES public.ticket_messages(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Votos nos Artigos
CREATE TABLE public.article_votes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID NOT NULL REFERENCES public.support_articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    ip_address TEXT,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(article_id, user_id),
    UNIQUE(article_id, ip_address)
);

-- Roles de suporte na tabela user_roles (usando enum existente)
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'support_agent';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'support_admin';

-- Função para gerar número do ticket
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ticket_number = 'SUP-' || LPAD(nextval('ticket_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular tempo de leitura
CREATE OR REPLACE FUNCTION public.calculate_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reading_time_minutes = GREATEST(1, CEILING(LENGTH(NEW.content) / 1000.0)); -- ~1000 caracteres por minuto
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar role de suporte
CREATE OR REPLACE FUNCTION public.is_support_agent()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role(auth.uid(), 'support_agent') OR public.has_role(auth.uid(), 'support_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_support_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_role(auth.uid(), 'support_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER trigger_generate_ticket_number
    BEFORE INSERT ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_ticket_number();

CREATE TRIGGER trigger_calculate_reading_time
    BEFORE INSERT OR UPDATE ON public.support_articles
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_reading_time();

CREATE TRIGGER update_support_topics_updated_at
    BEFORE UPDATE ON public.support_topics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_articles_updated_at
    BEFORE UPDATE ON public.support_articles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Support Topics
ALTER TABLE public.support_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active support topics"
ON public.support_topics FOR SELECT
USING (is_active = true);

CREATE POLICY "Support agents can view all support topics"
ON public.support_topics FOR SELECT
USING (is_support_agent());

CREATE POLICY "Support admins can manage support topics"
ON public.support_topics FOR ALL
USING (is_support_admin())
WITH CHECK (is_support_admin());

-- Support Articles
ALTER TABLE public.support_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
ON public.support_articles FOR SELECT
USING (status = 'published');

CREATE POLICY "Support agents can view all articles"
ON public.support_articles FOR SELECT
USING (is_support_agent());

CREATE POLICY "Support agents can manage articles"
ON public.support_articles FOR ALL
USING (is_support_agent())
WITH CHECK (is_support_agent());

-- FAQ Entries
ALTER TABLE public.faq_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active FAQ entries"
ON public.faq_entries FOR SELECT
USING (is_active = true);

CREATE POLICY "Support agents can manage FAQ entries"
ON public.faq_entries FOR ALL
USING (is_support_agent())
WITH CHECK (is_support_agent());

-- Tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets"
ON public.tickets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets"
ON public.tickets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets"
ON public.tickets FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Support agents can view all tickets"
ON public.tickets FOR SELECT
USING (is_support_agent());

CREATE POLICY "Support agents can update all tickets"
ON public.tickets FOR UPDATE
USING (is_support_agent());

-- Ticket Messages
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their tickets"
ON public.ticket_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.tickets 
        WHERE id = ticket_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can create messages in their tickets"
ON public.ticket_messages FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.tickets 
        WHERE id = ticket_id AND user_id = auth.uid()
    ) AND
    is_internal = false
);

CREATE POLICY "Support agents can view all messages"
ON public.ticket_messages FOR SELECT
USING (is_support_agent());

CREATE POLICY "Support agents can create messages"
ON public.ticket_messages FOR INSERT
WITH CHECK (is_support_agent());

-- Ticket Attachments
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments from their tickets"
ON public.ticket_attachments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.tickets 
        WHERE id = ticket_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can create attachments in their tickets"
ON public.ticket_attachments FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.tickets 
        WHERE id = ticket_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Support agents can manage all attachments"
ON public.ticket_attachments FOR ALL
USING (is_support_agent());

-- Article Votes
ALTER TABLE public.article_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view article votes"
ON public.article_votes FOR SELECT
USING (true);

CREATE POLICY "Users can vote on articles"
ON public.article_votes FOR INSERT
WITH CHECK (
    (auth.uid() = user_id AND ip_address IS NULL) OR
    (user_id IS NULL AND ip_address IS NOT NULL)
);

CREATE POLICY "Users can update their votes"
ON public.article_votes FOR UPDATE
USING (auth.uid() = user_id OR is_support_agent());

CREATE POLICY "Users can delete their votes"
ON public.article_votes FOR DELETE
USING (auth.uid() = user_id OR is_support_agent());

-- Criar bucket para anexos de suporte
INSERT INTO storage.buckets (id, name, public) 
VALUES ('support-attachments', 'support-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Policies para storage
CREATE POLICY "Users can upload attachments to their tickets"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'support-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view attachments from their tickets"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'support-attachments' AND
    (
        auth.uid()::text = (storage.foldername(name))[1] OR
        is_support_agent()
    )
);

CREATE POLICY "Support agents can manage all attachments"
ON storage.objects FOR ALL
USING (
    bucket_id = 'support-attachments' AND
    is_support_agent()
);

-- Inserir dados iniciais

-- Tópicos de exemplo
INSERT INTO public.support_topics (name, description, icon, sort_order) VALUES
('Primeiros Passos', 'Guias para começar a usar o sistema', 'BookOpen', 1),
('Transações', 'Dúvidas sobre gerenciamento de transações', 'CreditCard', 2),
('Relatórios', 'Como gerar e interpretar relatórios', 'BarChart3', 3),
('Conta e Perfil', 'Configurações de conta e perfil', 'User', 4),
('Problemas Técnicos', 'Bugs e problemas do sistema', 'AlertTriangle', 5);

-- FAQ de exemplo
INSERT INTO public.faq_entries (question, answer_md, sort_order) VALUES
('Como criar minha primeira transação?', 'Para criar uma transação, acesse o menu **Transações** e clique em **Nova Transação**. Preencha os campos obrigatórios: descrição, valor, categoria e data.', 1),
('Como categorizar minhas transações automaticamente?', 'O sistema possui IA integrada que categoriza transações automaticamente baseado na descrição. Você pode corrigir as categorias manualmente se necessário.', 2),
('Posso importar dados do meu banco?', 'Sim! Use a função **Importar Extrato** na página de transações para carregar arquivos PDF ou CSV do seu banco.', 3),
('Como alterar minha senha?', 'Vá em **Configurações > Perfil** e clique em **Alterar Senha**. Você receberá um email com instruções.', 4),
('O sistema funciona offline?', 'O sistema precisa de conexão com a internet para sincronizar dados. Algumas funcionalidades básicas podem funcionar offline temporariamente.', 5);

-- Artigos de exemplo
INSERT INTO public.support_articles (title, slug, content, excerpt, topic_id, status, is_featured) 
SELECT 
    'Guia Completo: Como Começar', 
    'guia-completo-como-comecar', 
    '# Guia Completo: Como Começar

Bem-vindo ao nosso sistema de gestão financeira! Este guia irá te ajudar a dar os primeiros passos.

## 1. Configure seu Perfil

Primeiro, complete as informações do seu perfil:
- Nome completo
- Foto de perfil
- Preferências de notificação

## 2. Adicione sua Primeira Transação

1. Vá para **Transações > Nova Transação**
2. Preencha os campos obrigatórios
3. Escolha uma categoria apropriada
4. Clique em **Salvar**

## 3. Configure suas Categorias

Personalize as categorias de acordo com seus hábitos:
- Alimentação
- Transporte  
- Lazer
- Contas Fixas

## 4. Explore os Relatórios

Acesse a aba **Dashboard** para ver:
- Gráficos de gastos por categoria
- Evolução mensal
- Metas de economia

## Próximos Passos

- Configure metas financeiras
- Importe extratos bancários
- Configure lembretes de contas', 
    'Aprenda como configurar e usar o sistema pela primeira vez', 
    (SELECT id FROM public.support_topics WHERE name = 'Primeiros Passos'), 
    'published', 
    true;