
export const INCOME_KEYWORDS = [
  "recebi", "ganhei", "salário", "salario", "pagamento", 
  "me pagou", "freelancer", "bônus", "bonus", "pix"
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
    "uber", "99", "taxi", "ônibus", "onibus", "metrô", "metro", 
    "gasolina", "combustível", "combustivel"
  ],
  "internet": [
    "internet", "wifi", "telefone", "celular", "tim", "vivo", 
    "claro", "oi"
  ],
  "cartao": [
    "cartão", "cartao", "fatura", "crédito", "credito", "nubank", 
    "bradesco", "itaú", "itau"
  ],
  "saude": [
    "médico", "medico", "hospital", "remédio", "remedio", 
    "consulta", "exame", "farmácia", "farmacia"
  ],
  "lazer": [
    "cinema", "show", "teatro", "viagem", "passeio", "bar", 
    "festa", "jogos", "netflix", "spotify"
  ],
  "compras": [
    "roupa", "shopping", "loja", "compra", "presente", 
    "eletrônico", "eletronico"
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
