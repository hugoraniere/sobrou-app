-- Atualizar todas as seções restantes com conteúdo das imagens de referência
UPDATE landing_page_config 
SET content = '{
  "title": "Registre gastos por WhatsApp e voz",
  "subtitle": "A forma mais rápida e natural de controlar suas finanças. Sem complicação, sem perder tempo.",
  "image": "",
  "features": [
    {
      "icon": "MessageCircle",
      "title": "WhatsApp Integrado",
      "description": "Envie mensagens diretamente pelo WhatsApp: \"Gastei 80 reais com combustível\". Nossa IA processa e categoriza automaticamente."
    },
    {
      "icon": "Mic", 
      "title": "Comando de Voz",
      "description": "Grave áudios no app ou WhatsApp. Transcrição automática e processamento inteligente de múltiplas transações em uma única gravação."
    },
    {
      "icon": "Smartphone",
      "title": "PWA Mobile",
      "description": "Instale como app nativo no seu celular. Funciona offline e sincroniza quando conectar."
    }
  ]
}'
WHERE section_key = 'whatsapp';

UPDATE landing_page_config 
SET content = '{
  "title": "Inteligência Artificial a seu favor",
  "subtitle": "Deixe nossa IA trabalhar por você: insights automáticos, alertas inteligentes e sugestões personalizadas",
  "callout": "IA que aprende com você e evolui constantemente",
  "features": [
    {
      "icon": "Lightbulb",
      "title": "Insights Automáticos",
      "description": "Nossa IA analisa seus padrões de gastos e identifica oportunidades de economia, tendências preocupantes e comportamentos financeiros.",
      "quote": "Seus gastos com delivery aumentaram 30% este mês. Considere cozinhar mais em casa para economizar R$ 200."
    },
    {
      "icon": "Bell",
      "title": "Alertas Inteligentes", 
      "description": "Receba notificações proativas sobre gastos incomuns, metas em risco, contas próximas do vencimento e oportunidades de economia.",
      "quote": "⚠️ Você gastou 80% do orçamento de entretenimento em apenas 15 dias do mês."
    },
    {
      "icon": "TrendingUp",
      "title": "Previsões Financeiras",
      "description": "Simulações automáticas de cenários futuros baseados em seus padrões atuais. Visualize o impacto de mudanças nos seus hábitos.",
      "quote": "Mantendo este padrão, você economizará R$ 1.200 até o final do ano."
    },
    {
      "icon": "Target",
      "title": "Metas Adaptativas",
      "description": "Nossas metas se ajustam automaticamente baseadas no seu desempenho, sugerindo valores realistas e estratégias personalizadas.",
      "quote": "Baseado no seu histórico, sugerimos aumentar sua meta de economia para R$ 800/mês."
    }
  ]
}'
WHERE section_key = 'automation';

UPDATE landing_page_config 
SET content = '{
  "title": "Perguntas Frequentes",
  "subtitle": "Tire suas dúvidas sobre o Sobrou e descubra como transformar seu controle financeiro",
  "questions": [
    {
      "question": "Como funciona a integração com WhatsApp?",
      "answer": "Você conecta seu número nas configurações e pode enviar mensagens como \"Gastei R$ 50 com mercado\" para nosso bot. A IA processa automaticamente e categoriza."
    },
    {
      "question": "Meus dados bancários ficam seguros?",
      "answer": "Sim, usamos criptografia de nível bancário (AES-256) e seguimos a LGPD. Não temos acesso às suas contas - você importa apenas extratos que escolher."
    },
    {
      "question": "Posso usar offline?",
      "answer": "Algumas funções básicas funcionam offline, mas para sincronização e análises com IA é necessária conexão com internet."
    },
    {
      "question": "Como a IA categoriza meus gastos?",
      "answer": "Nossa IA analisa o texto da transação e identifica automaticamente a categoria mais apropriada, aprendendo com seus padrões."
    },
    {
      "question": "Qual a diferença entre as versões gratuita e paga?",
      "answer": "A versão gratuita permite até 100 transações/mês. Nos planos pagos não há limite e você tem recursos avançados de IA."
    },
    {
      "question": "Posso importar dados de outros apps?",
      "answer": "Sim, suportamos importação de extratos em PDF, CSV, Excel e outros formatos comuns de bancos e apps financeiros."
    },
    {
      "question": "O app funciona para empresas também?",
      "answer": "Sim, temos módulos específicos para gestão empresarial, incluindo calculadora de custos para restaurantes e controle de fluxo de caixa."
    },
    {
      "question": "Como cancelo minha conta?",
      "answer": "Você pode cancelar a qualquer momento nas configurações. Todos os seus dados podem ser exportados antes do cancelamento."
    }
  ]
}'
WHERE section_key = 'faq';