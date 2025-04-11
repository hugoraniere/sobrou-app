
import { 
  ShoppingCart, Home, Car, Clapperboard, Heart, Book, Briefcase, 
  Bank, LineChart, CreditCard, Gift, FileText, Sparkles, 
  Repeat, ArrowLeftRight, PiggyBank 
} from "lucide-react";

export interface TransactionCategory {
  id: string;
  name: string;
  icon: any; // Componente do Lucide React
  keywords: string[];
  type?: 'expense' | 'income' | 'transfer' | 'all';
}

export const transactionCategories: TransactionCategory[] = [
  {
    id: "food",
    name: "Alimentação",
    icon: ShoppingCart,
    keywords: ["mercado", "supermercado", "feira", "sacolão", "pão", "leite", "frutas", "comida", "alimentação", "marmita", "hortifruti"],
    type: "expense"
  },
  {
    id: "housing",
    name: "Moradia",
    icon: Home,
    keywords: ["aluguel", "condomínio", "luz", "água", "energia", "gás", "IPTU", "residência", "faxina", "eletricidade"],
    type: "expense"
  },
  {
    id: "transportation",
    name: "Transporte",
    icon: Car,
    keywords: ["uber", "99", "metrô", "ônibus", "gasolina", "combustível", "corrida", "transporte", "carro"],
    type: "expense"
  },
  {
    id: "entertainment",
    name: "Lazer",
    icon: Clapperboard,
    keywords: ["cinema", "bar", "pizza", "restaurante", "rolê", "festa", "balada", "viagem", "show", "netflix", "streaming"],
    type: "expense"
  },
  {
    id: "health",
    name: "Saúde",
    icon: Heart,
    keywords: ["farmácia", "remédio", "médico", "consulta", "exame", "dentista", "hospital", "plano de saúde"],
    type: "expense"
  },
  {
    id: "education",
    name: "Educação",
    icon: Book,
    keywords: ["curso", "faculdade", "escola", "mensalidade", "aula", "workshop", "inscrição", "EAD"],
    type: "expense"
  },
  {
    id: "work",
    name: "Trabalho",
    icon: Briefcase,
    keywords: ["freelance", "job", "cliente", "projeto", "comissão", "extra", "prestação de serviço"],
    type: "income"
  },
  {
    id: "salary",
    name: "Salário",
    icon: Bank,
    keywords: ["salário", "empresa", "pagamento fixo", "contracheque", "holerite"],
    type: "income"
  },
  {
    id: "investments",
    name: "Investimentos",
    icon: LineChart,
    keywords: ["ação", "dividendos", "aplicação", "fundo", "CDB", "tesouro", "cripto", "BTC", "rendimento", "poupança"],
    type: "income"
  },
  {
    id: "credit_card",
    name: "Cartão de Crédito",
    icon: CreditCard,
    keywords: ["fatura", "parcela", "limite", "dívida", "cartão", "cobrança", "juros"],
    type: "expense"
  },
  {
    id: "gifts",
    name: "Presentes",
    icon: Gift,
    keywords: ["presente", "doação", "mimo", "caridade", "cesta", "contribuir"],
    type: "expense"
  },
  {
    id: "taxes",
    name: "Taxas e Impostos",
    icon: FileText,
    keywords: ["taxa", "multa", "IOF", "IR", "INSS", "imposto", "tarifa"],
    type: "expense"
  },
  {
    id: "personal_care",
    name: "Cuidados Pessoais",
    icon: Sparkles,
    keywords: ["cabelo", "salão", "manicure", "spa", "estética", "autocuidado", "beleza"],
    type: "expense"
  },
  {
    id: "subscriptions",
    name: "Assinaturas",
    icon: Repeat,
    keywords: ["spotify", "netflix", "youtube", "adobe", "plano mensal", "assinatura", "recorrente"],
    type: "expense"
  },
  {
    id: "transfers",
    name: "Transferências",
    icon: ArrowLeftRight,
    keywords: ["pix", "TED", "DOC", "saque", "depósito", "entre contas", "transferência"],
    type: "transfer"
  },
  {
    id: "savings",
    name: "Poupança",
    icon: PiggyBank,
    keywords: ["guardar", "reserva", "cofrinho", "meta", "economia", "sobra"],
    type: "expense"
  }
];

export const getCategoryById = (id: string): TransactionCategory | undefined => {
  return transactionCategories.find(cat => cat.id === id);
};

export const getCategoryByKeyword = (text: string): TransactionCategory | undefined => {
  const lowerText = text.toLowerCase();
  
  return transactionCategories.find(category => 
    category.keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))
  );
};
