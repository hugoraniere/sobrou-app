-- Criar tabela para configurações da landing page
CREATE TABLE public.landing_page_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.landing_page_config ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Admins can manage landing page config" 
ON public.landing_page_config 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Anyone can view landing page config" 
ON public.landing_page_config 
FOR SELECT 
USING (true);

-- Trigger para updated_at
CREATE TRIGGER update_landing_page_config_updated_at
  BEFORE UPDATE ON public.landing_page_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir configurações padrão
INSERT INTO public.landing_page_config (section_key, content, is_visible) VALUES
('hero', '{
  "title": "Organize suas finanças com linguagem natural",
  "subtitle": "Diga adeus às planilhas complicadas. Com nossa IA, você organiza suas finanças falando naturalmente, como se fosse uma conversa.",
  "cta_text": "Começar gratuitamente",
  "cta_url": "/auth",
  "background_image": "/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png",
  "benefits": [
    {
      "icon": "Zap",
      "title": "Configuração em 5 minutos",
      "description": "Comece a usar imediatamente"
    },
    {
      "icon": "Shield",
      "title": "Dados 100% seguros",
      "description": "Criptografia de ponta a ponta"
    },
    {
      "icon": "Smartphone",
      "title": "Acesso multiplataforma",
      "description": "Web, mobile e desktop"
    }
  ]
}'::jsonb, true),

('modules', '{
  "title": "Recursos que facilitam sua vida",
  "subtitle": "Descubra como nossa plataforma pode transformar sua gestão financeira",
  "modules": [
    {
      "icon": "MessageSquare",
      "title": "Conversação Natural",
      "description": "Adicione gastos e receitas falando naturalmente, sem formulários complicados.",
      "image": "/placeholder.svg"
    },
    {
      "icon": "Brain",
      "title": "IA Inteligente",
      "description": "Nossa IA categoriza automaticamente suas transações e oferece insights personalizados.",
      "image": "/placeholder.svg"
    },
    {
      "icon": "PieChart",
      "title": "Relatórios Visuais",
      "description": "Visualize seus gastos com gráficos intuitivos e relatórios detalhados.",
      "image": "/placeholder.svg"
    },
    {
      "icon": "Target",
      "title": "Metas Financeiras",
      "description": "Defina objetivos e acompanhe seu progresso de forma simples e motivadora.",
      "image": "/placeholder.svg"
    }
  ]
}'::jsonb, true),

('whatsapp', '{
  "title": "Gerencie tudo pelo WhatsApp",
  "subtitle": "Adicione gastos, consulte saldo e receba relatórios direto no seu WhatsApp. Simples assim!",
  "features": [
    "Adicione transações por áudio ou texto",
    "Receba relatórios automáticos",
    "Consulte seu saldo a qualquer momento",
    "Receba lembretes de contas a pagar"
  ],
  "cta_text": "Conectar WhatsApp",
  "demo_image": "/placeholder.svg"
}'::jsonb, true),

('statement_import', '{
  "title": "Importe extratos automaticamente",
  "subtitle": "Conecte suas contas bancárias ou importe extratos em PDF. Nossa IA organiza tudo para você.",
  "features": [
    "Suporte a todos os bancos brasileiros",
    "Importação por PDF ou API",
    "Categorização automática inteligente",
    "Detecção de transações duplicadas"
  ],
  "cta_text": "Começar importação"
}'::jsonb, true),

('automation', '{
  "title": "IA que aprende com você",
  "subtitle": "Quanto mais você usa, mais inteligente fica. Sugestões personalizadas para melhorar suas finanças.",
  "features": [
    "Categorização automática de gastos",
    "Detecção de padrões de consumo",
    "Alertas de gastos incomuns",
    "Sugestões de economia personalizadas"
  ]
}'::jsonb, true),

('security', '{
  "title": "Segurança e privacidade em primeiro lugar",
  "subtitle": "Seus dados financeiros merecem o mais alto nível de proteção. Utilizamos criptografia militar.",
  "features": [
    "Criptografia AES-256",
    "Autenticação de dois fatores",
    "Auditoria de segurança contínua",
    "Conformidade com LGPD"
  ],
  "certifications": [
    "ISO 27001",
    "SOC 2 Type II",
    "LGPD Compliant"
  ]
}'::jsonb, true),

('faq', '{
  "title": "Perguntas frequentes",
  "subtitle": "Tire suas dúvidas sobre nossa plataforma",
  "questions": [
    {
      "question": "Como funciona a IA para categorizar transações?",
      "answer": "Nossa IA analisa o histórico de transações e aprende com seus padrões de uso. Ela identifica automaticamente categorias como alimentação, transporte, lazer, etc., e vai ficando mais precisa com o tempo."
    },
    {
      "question": "Meus dados bancários ficam seguros?",
      "answer": "Sim, utilizamos criptografia de nível militar (AES-256) e seguimos os mais rigorosos padrões de segurança. Seus dados são protegidos e nunca compartilhados com terceiros."
    },
    {
      "question": "Posso usar no celular?",
      "answer": "Claro! Nossa plataforma é totalmente responsiva e funciona perfeitamente em celulares, tablets e desktops. Você também pode usar via WhatsApp."
    },
    {
      "question": "Há limite de transações?",
      "answer": "No plano gratuito você pode adicionar até 100 transações por mês. Nos planos pagos não há limite de transações."
    }
  ]
}'::jsonb, true),

('cta', '{
  "title": "Comece a organizar suas finanças hoje",
  "subtitle": "Junte-se a milhares de usuários que já transformaram sua vida financeira",
  "cta_text": "Começar gratuitamente",
  "cta_url": "/auth"
}'::jsonb, true);

-- Criar bucket para imagens da landing page se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('landing-page', 'landing-page', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para o bucket landing-page
CREATE POLICY "Landing page images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'landing-page');

CREATE POLICY "Admins can upload landing page images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'landing-page' AND is_admin());

CREATE POLICY "Admins can update landing page images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'landing-page' AND is_admin());

CREATE POLICY "Admins can delete landing page images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'landing-page' AND is_admin());