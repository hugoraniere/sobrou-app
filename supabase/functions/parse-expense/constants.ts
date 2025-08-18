
export const INCOME_KEYWORDS = [
  "recebi", "ganhei", "salário", "salario", "pagamento", 
  "me pagou", "freelancer", "bônus", "bonus", "pix",
  "caiu na conta", "entrou", "faturei", "venda", "vendido",
  "fiz um freela", "lucro", "rendimento", "ganho", "comissão",
  "entrada", "receita", "transferência", "transferencia", "depósito",
  "deposito", "cashback", "restituição", "restituicao", "premio",
  "prêmio", "dividendos", "aluguel recebido", "recebido"
];

export const SAVING_KEYWORDS = [
  "economizei", "poupei", "guardar", "guardei", "poupança", 
  "poupanca", "reserva"
];

export const CATEGORY_MAPPING: Record<string, string[]> = {
  "alimentacao": [
    "comida", "mercado", "restaurante", "almoço", "almoco", 
    "jantar", "café", "cafe", "lanche", "supermercado"
  ],
  "moradia": [
    "aluguel", "condomínio", "condominio", "luz", "água", "agua", 
    "energia", "gás", "gas", "iptu"
  ],
  "transporte": [
    "transporte", "transporte público", "uber", "99", "taxi", "ônibus", "onibus", "metrô", "metro", 
    "gasolina", "combustível", "combustivel", "estacionamento", "pedágio", "pedagio", "passagem"
  ],
  "internet": [
    "internet", "wifi", "telefone", "celular", "tim", "vivo", 
    "claro", "oi", "netflix", "spotify", "amazon prime", "prime video",
    "disney", "hbo", "globoplay", "youtube premium", "assinatura"
  ],
  "cartao": [
    "cartão", "cartao", "fatura", "crédito", "credito", "nubank", 
    "bradesco", "itaú", "itau"
  ],
  "saude": [
    "médico", "medico", "hospital", "remédio", "remedio", 
    "consulta", "exame", "farmácia", "farmacia", "academia", 
    "gym", "fitness", "treino", "musculação", "musculacao",
    "exercício", "exercicio", "dentista", "clínica", "clinica"
  ],
  "lazer": [
    "cinema", "show", "teatro", "viagem", "passeio", "bar", 
    "festa", "jogos", "netflix", "spotify"
  ],
  "compras": [
    "comprei", "compra", "compras", "comprando", "shopping", "loja", "roupa", "roupas", 
    "presente", "eletrônico", "eletronico", "celular", "computador", "notebook",
    "amazon", "mercado livre", "mercadolivre", "aliexpress", "shopee", "shein", 
    "americanas", "magazine", "casas bahia", "extra", "carrefour", "walmart",
    "sapatos", "tênis", "tenis", "calçados", "calcados", "joia", "joias", 
    "relógio", "relogio", "óculos", "oculos", "bolsa", "mochila", "perfume",
    "cosméticos", "cosmeticos", "maquiagem", "produto", "produtos", "gadget",
    "eletrônicos", "eletronicos", "móveis", "moveis", "decoração", "decoracao",
    "utensílios", "utensilios", "objeto", "objetos", "item", "itens",
    "magazine luiza"
  ],
  "investimentos": [
    "investimento", "ação", "acao", "bolsa", "tesouro", "cdb", 
    "poupança", "poupanca"
  ],
  "familia": [
    "escola", "creche", "filho", "família", "familia", "criança", 
    "crianca"
  ],
  "doacoes": [
    "doação", "doacao", "caridade", "ajuda", "ong"
  ]
};
