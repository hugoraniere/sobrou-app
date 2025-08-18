
// Palavras-chave específicas para cada categoria
// Essas palavras-chave serão usadas para categorizar automaticamente transações
export const categoryKeywords: Record<string, string[]> = {
  // Alimentação
  'alimentacao': [
    'restaurante', 'lanchonete', 'bar', 'pizzaria', 'hambúrguer', 'hamburger',
    'fast food', 'churrascaria', 'sushi', 'comida', 'almoço', 'jantar', 'café',
    'padaria', 'supermercado', 'mercado extra', 'mercado carrefour', 'pão de açúcar',
    'hortifruti', 'feira', 'delivery', 'ifood', 'rappi', 'uber eats', 'james', 'food', 
    'bistro', 'snack', 'cantina', 'açougue', 'acougue', 'peixaria', 'quitanda'
  ],
  
  // Moradia
  'moradia': [
    'aluguel', 'condomínio', 'condominio', 'água', 'agua', 'luz', 'energia', 'gás',
    'gas', 'iptu', 'taxa', 'imobiliária', 'imobiliaria', 'reforma', 'manutenção',
    'manutencao', 'mobília', 'mobilia', 'decoração', 'decoracao', 'obra', 'arquiteto',
    'engenheiro', 'pedreiro', 'pintor', 'eletricista', 'encanador', 'seguro residencial'
  ],
  
  // Transporte
  'transporte': [
    'transporte', 'transporte público', 'transporte urbano', 'uber', '99', 'taxi', 'cabify', 'gasolina', 'combustível', 'combustivel', 'álcool',
    'alcool', 'etanol', 'diesel', 'estacionamento', 'pedágio', 'pedagio', 'metrô', 'metro',
    'ônibus', 'onibus', 'trem', 'passagem', 'bilhete', 'carro', 'moto', 'seguro auto',
    'mecânico', 'mecanico', 'oficina', 'revisão', 'revisao', 'pneu', 'peças', 'pecas'
  ],
  
  // Internet
  'internet': [
    'internet', 'wifi', 'fibra', 'banda larga', 'net', 'vivo', 'claro', 'oi', 'tim',
    'operadora', 'telefone', 'celular', 'plano', 'dados', 'móvel', 'movel', 'tv',
    'streaming', 'netflix', 'amazon prime', 'prime video', 'disney', 'hbo', 'spotify', 'deezer',
    'youtube premium', 'globoplay', 'telecomunicações', 'telecomunicacoes'
  ],
  
  // Cartão de crédito
  'cartao': [
    'fatura', 'cartão', 'cartao', 'crédito', 'credito', 'débito', 'debito', 'banco',
    'bradesco', 'itaú', 'itau', 'santander', 'caixa', 'bb', 'brasil', 'nubank',
    'inter', 'c6', 'visa', 'mastercard', 'elo', 'american express', 'amex', 'taxa',
    'juros', 'parcela', 'anuidade', 'financiamento', 'empréstimo', 'emprestimo'
  ],
  
  // Saúde
  'saude': [
    'farmácia', 'farmacia', 'drogaria', 'remédio', 'remedio', 'médico', 'medico',
    'consulta', 'exame', 'hospital', 'clínica', 'clinica', 'laboratório', 'laboratorio',
    'dentista', 'psicólogo', 'psicologo', 'fisioterapeuta', 'terapia', 'plano de saúde',
    'plano', 'suplemento', 'vitamina', 'academia', 'fitness', 'treino', 'vacina'
  ],
  
  // Lazer
  'lazer': [
    'cinema', 'teatro', 'show', 'concerto', 'balada', 'festa', 'ingresso', 'entrada',
    'evento', 'parque', 'viagem', 'passagem aérea', 'passagem', 'hotel', 'hospedagem',
    'pousada', 'resort', 'passeio', 'tour', 'excursão', 'excursao', 'praia', 'camping',
    'bar', 'bebida', 'álcool', 'diversão', 'lazer', 'entretenimento', 'hobby'
  ],
  
  // Compras
  'compras': [
    'comprei', 'compra', 'compras', 'comprando', 'comprou', 'adquiri', 'aquisição', 'aquisicao',
    'loja', 'shopping', 'magazine', 'americanas', 'amazon', 'mercado livre', 'mercadolivre',
    'aliexpress', 'shopee', 'shein', 'submarino', 'casas bahia', 'extra', 'carrefour', 'walmart',
    'ponto frio', 'fast shop', 'ricardo eletro', 'e-commerce', 'ecommerce', 'online',
    'roupas', 'roupa', 'vestuário', 'vestuario', 'calçados', 'calcados', 'sapatos', 'tênis', 'tenis',
    'sandália', 'sandalia', 'bota', 'chinelo', 'joia', 'joias', 'relógio', 'relogio', 'óculos', 'oculos',
    'bolsa', 'carteira', 'mochila', 'mala', 'perfume', 'colônia', 'cosméticos', 'cosmeticos',
    'maquiagem', 'shampoo', 'condicionador', 'produto de beleza', 'eletrônico', 'eletronico',
    'eletrônicos', 'eletronicos', 'celular', 'smartphone', 'computador', 'notebook', 'tablet',
    'fone', 'headphone', 'carregador', 'cabo', 'gadget', 'acessório', 'acessorio',
    'móveis', 'moveis', 'sofá', 'sofa', 'mesa', 'cadeira', 'cama', 'guarda-roupa',
    'decoração', 'decoracao', 'quadro', 'vaso', 'almofada', 'cortina', 'tapete',
    'utensílios', 'utensilios', 'panela', 'frigideira', 'prato', 'copo', 'talher',
    'produto', 'produtos', 'item', 'itens', 'objeto', 'objetos', 'mercadoria',
    'presente', 'mimo', 'lembrança', 'lembranca', 'brinde'
  ],
  
  // Investimentos
  'investimentos': [
    'investimento', 'aplicação', 'aplicacao', 'tesouro', 'cdb', 'lci', 'lca', 'ações',
    'acoes', 'bolsa', 'b3', 'fundo', 'previdência', 'previdencia', 'aposentadoria',
    'poupança', 'poupanca', 'rendimento', 'dividendo', 'juros', 'corretora', 'xp',
    'clear', 'rico', 'modal', 'btg', 'nubainvest', 'warren', 'bitcoin', 'cripto'
  ],
  
  // Família
  'familia': [
    'escola', 'colégio', 'colegio', 'creche', 'mensalidade', 'uniforme', 'material',
    'livro', 'caderno', 'filho', 'filha', 'criança', 'crianca', 'bebê', 'bebe',
    'fralda', 'brinquedo', 'roupa infantil', 'pediatra', 'educação', 'educacao',
    'curso', 'faculdade', 'universidade', 'matrícula', 'matricula', 'formatura'
  ],
  
  // Doações
  'doacoes': [
    'doação', 'doacao', 'caridade', 'contribuição', 'contribuicao', 'ajuda', 'igreja',
    'templo', 'ong', 'organização', 'organizacao', 'campanha', 'solidariedade', 'apoio',
    'esmola', 'dízimo', 'dizimo', 'oferta', 'instituição', 'instituicao', 'causa'
  ]
};
