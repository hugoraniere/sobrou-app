-- Atualizar conteúdo da seção hero
UPDATE landing_page_config 
SET content = '{
  "title": "Organize suas finanças, <span style=\"color: #10b981;\">é só digitar</span>",
  "subtitle": "Chega de planilhas complexas. Digite seus gastos em linguagem natural e deixe nossa IA organizar tudo automaticamente.",
  "cta_text": "Começar agora",
  "cta_url": "/auth",
  "background_image": "/lovable-uploads/862677f9-9f47-483c-9958-536fd7f15a65.png",
  "benefits": [
    {
      "icon": "Shield",
      "title": "Segurança dos seus dados em primeiro lugar"
    },
    {
      "icon": "Smartphone", 
      "title": "Acesse quando quiser, no celular ou computador"
    }
  ]
}'
WHERE section_key = 'hero';

-- Atualizar conteúdo da seção modules
UPDATE landing_page_config 
SET content = '{
  "title": "Módulos completos para seu negócio",
  "subtitle": "Todas as ferramentas que você precisa para gerenciar suas finanças pessoais ou empresariais",
  "modules": [
    {
      "id": "dashboard",
      "iconName": "BarChart3",
      "title": "Dashboard Inteligente",
      "description": "Visão completa das suas finanças com gráficos interativos e insights personalizados.",
      "image": "/placeholder.svg"
    },
    {
      "id": "transactions", 
      "iconName": "Receipt",
      "title": "Gestão de Transações",
      "description": "Cadastro por voz, texto ou WhatsApp. Importação de extratos bancários automática.",
      "image": "/placeholder.svg"
    },
    {
      "id": "planning",
      "iconName": "Calendar", 
      "title": "Planejamento Mensal",
      "description": "Organize seu orçamento, compare períodos e simule cenários financeiros.",
      "image": "/placeholder.svg"
    },
    {
      "id": "goals",
      "iconName": "Target",
      "title": "Metas de Economia", 
      "description": "Defina objetivos, acompanhe progresso e receba sugestões inteligentes de economia.",
      "image": "/placeholder.svg"
    },
    {
      "id": "bills",
      "iconName": "Receipt",
      "title": "Contas a Pagar",
      "description": "Controle total sobre vencimentos, pagamentos e fluxo de caixa.",
      "image": "/placeholder.svg"
    },
    {
      "id": "calculator",
      "iconName": "Calculator", 
      "title": "Calculadora de Restaurante",
      "description": "Ferramenta especializada para calcular custos de pratos e ingredientes.",
      "image": "/placeholder.svg"
    }
  ]
}'
WHERE section_key = 'modules';